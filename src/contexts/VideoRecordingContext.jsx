import { createContext, useContext, useRef, useState, useCallback } from 'react';
import { convertToMp4 } from '../utils/convertToMp4';

const VideoRecordingCtx = createContext(null);

export function useVideoRecording() {
  return useContext(VideoRecordingCtx);
}

export function VideoRecordingProvider({ children }) {
  const canvasRef  = useRef(null);
  const recRef     = useRef(null);
  const rafRef     = useRef(null);
  const chunksRef  = useRef([]);
  const cancelRef  = useRef(false);
  const streamRef  = useRef(null);   // flux capturé (vidéo + audio) — à libérer
  const audioRef   = useRef(null);   // { ctx, osc } — à fermer

  // idle | recording | converting | processing
  const [recState, setRecState] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [label,    setLabel]    = useState('');

  // Libère le flux capté et l'AudioContext. SANS ça, un 2e enregistrement (sans
  // recharger la page) reste bloqué : l'ancien track captureStream + l'AudioContext
  // non fermé empêchent le nouveau MediaRecorder de fonctionner.
  const releaseMedia = useCallback(() => {
    try { streamRef.current?.getTracks().forEach(t => t.stop()); } catch { /* ignore */ }
    streamRef.current = null;
    try { audioRef.current?.osc?.stop(); } catch { /* ignore */ }
    try { audioRef.current?.ctx?.close(); } catch { /* ignore */ }
    audioRef.current = null;
  }, []);

  const stop = useCallback(() => {
    cancelRef.current = true;
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    if (recRef.current && recRef.current.state !== 'inactive') recRef.current.stop();
  }, []);

  const startRecording = useCallback(({
    drawFnRef,
    duration = 70_000,
    filename = 'video',
    label: lbl = '',
    format = 'mp4',       // 'mp4' | 'webm'
  }) => {
    const canvas = canvasRef.current;
    if (!canvas || typeof MediaRecorder === 'undefined') return;

    setRecState('recording');
    setProgress(0);
    setLabel(lbl);
    cancelRef.current = false;
    chunksRef.current = [];

    // Défense : libère tout reliquat d'un enregistrement précédent avant d'en
    // démarrer un nouveau (sinon le 2e reste bloqué).
    releaseMedia();

    const ctx = canvas.getContext('2d');

    // Silent audio track — keeps TikTok / Reels pipeline happy
    const videoStream = canvas.captureStream(30);
    // Grab the canvas track so we can call requestFrame() explicitly each rAF.
    // This prevents Safari from silently stalling the captureStream track under memory pressure.
    const videoTrack = videoStream.getVideoTracks()[0] ?? null;
    let stream = videoStream;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const gain = audioCtx.createGain(); gain.gain.value = 0;
      const osc  = audioCtx.createOscillator(); osc.connect(gain);
      const dest = audioCtx.createMediaStreamDestination(); gain.connect(dest); osc.start();
      stream = new MediaStream([...videoStream.getVideoTracks(), ...dest.stream.getAudioTracks()]);
      audioRef.current = { ctx: audioCtx, osc };
    } catch (_) { /* video-only fallback */ }
    streamRef.current = stream;

    // Safari records as fMP4 (H.264), Chrome/Firefox as WebM (VP9)
    const MIME_CANDIDATES = [
      'video/mp4;codecs=avc1', 'video/mp4;codecs=h264', 'video/mp4',
      'video/webm;codecs=h264', 'video/webm;codecs=vp9', 'video/webm',
    ];
    const mime = MIME_CANDIDATES.find(m => MediaRecorder.isTypeSupported(m)) ?? 'video/webm';
    const nativeExt = mime.startsWith('video/mp4') ? 'mp4' : 'webm';

    const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 5_000_000 });
    recRef.current = rec;
    rec.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };

    rec.onstop = async () => {
      // L'enregistrement est terminé : on libère immédiatement le flux capté et
      // l'AudioContext (plus besoin pour la conversion/téléchargement).
      releaseMedia();
      if (cancelRef.current) { setRecState('idle'); setProgress(0); return; }

      const rawBlob    = new Blob(chunksRef.current, { type: mime });
      const baseFilename = filename.replace(/\.(webm|mp4)$/i, '');

      if (format === 'webm') {
        // Direct download — no conversion
        setRecState('processing');
        download(rawBlob, `${baseFilename}.webm`);
        setRecState('idle'); setProgress(0);
        return;
      }

      // MP4: pass through ffmpeg to get a traditional seekable MP4
      setRecState('converting');
      setProgress(0);
      try {
        const mp4Blob = await convertToMp4(rawBlob, setProgress);
        setRecState('processing');
        download(mp4Blob, `${baseFilename}.mp4`);
      } catch (err) {
        console.error('ffmpeg conversion failed, downloading original:', err);
        setRecState('processing');
        download(rawBlob, `${baseFilename}.${nativeExt}`);
      }
      setRecState('idle'); setProgress(0);
    };

    rec.start(1000); // timeslice keeps Safari's MediaRecorder alive on long recordings
    const t0 = performance.now();
    let lastPct = -1;

    function frame(now) {
      if (cancelRef.current) { rec.stop(); return; }
      const tt = Math.min((now - t0) / duration, 1);
      // try/catch: an exception in the draw function must NOT kill the rAF loop,
      // otherwise captureStream freezes the last frame for the rest of the video.
      try {
        if (drawFnRef.current) drawFnRef.current(ctx, tt);
      } catch (err) {
        console.error('[VideoRecording] draw error at t=', tt, err);
      }
      // Explicit requestFrame() forces Safari to capture this canvas frame even
      // when the captureStream track has been silently throttled/muted.
      try {
        if (videoTrack && typeof videoTrack.requestFrame === 'function') videoTrack.requestFrame();
      } catch (_) {}
      const pct = Math.round(tt * 100);
      if (pct !== lastPct) { lastPct = pct; setProgress(pct); }
      if (tt < 1) { rafRef.current = requestAnimationFrame(frame); }
      else { rafRef.current = null; rec.stop(); }
    }
    rafRef.current = requestAnimationFrame(frame);
  }, [releaseMedia]);

  return (
    <VideoRecordingCtx.Provider value={{ recState, progress, label, startRecording, stop }}>
      {/* position off-screen rather than display:none — Safari mutes captureStream tracks
          on hidden (display:none) elements after ~15s, freezing the recording */}
      <canvas ref={canvasRef} width={720} height={1280} style={{ position: 'fixed', top: '-9999px', left: '-9999px', pointerEvents: 'none' }} />
      {children}
    </VideoRecordingCtx.Provider>
  );
}

function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}
