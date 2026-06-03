import { createContext, useContext, useRef, useState, useCallback } from 'react';

const VideoRecordingCtx = createContext(null);

export function useVideoRecording() {
  return useContext(VideoRecordingCtx);
}

export function VideoRecordingProvider({ children }) {
  const canvasRef  = useRef(null);
  const recRef     = useRef(null);
  const rafRef     = useRef(null);
  const chunksRef  = useRef([]);

  const [recState, setRecState] = useState('idle'); // idle | recording | processing
  const [progress, setProgress] = useState(0);
  const [label,    setLabel]    = useState('');

  const stop = useCallback(() => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    if (recRef.current && recRef.current.state !== 'inactive') recRef.current.stop();
  }, []);

  const startRecording = useCallback(async ({
    drawFnRef,
    duration = 70_000,
    filename = 'video.webm',
    label: lbl = '',
  }) => {
    const canvas = canvasRef.current;
    if (!canvas || typeof MediaRecorder === 'undefined') return;

    setRecState('recording');
    setProgress(0);
    setLabel(lbl);
    chunksRef.current = [];

    const ctx = canvas.getContext('2d');

    // Silent audio track — TikTok Creator and Reels require an audio track to re-encode
    const videoStream = canvas.captureStream(30);
    let stream = videoStream;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const gain = audioCtx.createGain();
      gain.gain.value = 0;
      const osc = audioCtx.createOscillator();
      osc.connect(gain);
      const dest = audioCtx.createMediaStreamDestination();
      gain.connect(dest);
      osc.start();
      stream = new MediaStream([...videoStream.getVideoTracks(), ...dest.stream.getAudioTracks()]);
    } catch (_) { /* fallback: video-only */ }

    const MIME_CANDIDATES = [
      'video/mp4;codecs=avc1',
      'video/mp4;codecs=h264',
      'video/mp4',              // Safari iOS — pas de spec codec nécessaire
      'video/webm;codecs=h264',
      'video/webm;codecs=vp9',
      'video/webm',
    ];
    const mime = MIME_CANDIDATES.find(m => MediaRecorder.isTypeSupported(m)) ?? 'video/mp4';
    const ext  = mime.startsWith('video/mp4') ? 'mp4' : 'webm';
    const finalFilename = filename.replace(/\.(webm|mp4)$/i, '') + '.' + ext;

    const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 5_000_000 });
    recRef.current = rec;

    rec.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    rec.onstop = () => {
      setRecState('processing');
      const blob = new Blob(chunksRef.current, { type: mime });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = finalFilename; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 3000);
      setRecState('idle');
      setProgress(0);
    };

    rec.start();
    const t0 = performance.now();

    function frame(now) {
      const tt = Math.min((now - t0) / duration, 1);
      if (drawFnRef.current) drawFnRef.current(ctx, tt);
      setProgress(Math.round(tt * 100));
      if (tt < 1) { rafRef.current = requestAnimationFrame(frame); }
      else { rafRef.current = null; rec.stop(); }
    }
    rafRef.current = requestAnimationFrame(frame);
  }, []);

  return (
    <VideoRecordingCtx.Provider value={{ recState, progress, label, startRecording, stop }}>
      {/* opacity:0 instead of display:none — iOS Safari needs the canvas in the render pipeline for captureStream to work */}
      <canvas ref={canvasRef} width={720} height={1280} style={{ position: 'fixed', top: 0, left: 0, opacity: 0, pointerEvents: 'none', zIndex: -1 }} />
      {children}
    </VideoRecordingCtx.Provider>
  );
}
