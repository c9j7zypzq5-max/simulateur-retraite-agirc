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
    if (rafRef.current) { clearInterval(rafRef.current); rafRef.current = null; }
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
    const FPS = 30;

    // captureStream(0) = manual frame capture: we push exactly one frame per tick
    // via track.requestFrame() so the output is constant-frame-rate (CFR).
    // Letting captureStream sample on its own under requestAnimationFrame on iOS
    // Safari yields variable-frame-rate video with gaps, which TikTok's re-encoder
    // turns into a freeze. Photos plays VFR fine, TikTok does not.
    const videoStream = canvas.captureStream(0);
    const videoTrack  = videoStream.getVideoTracks()[0];
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

    // Fixed-cadence render loop: advance logical time by a constant step and push
    // exactly one frame per tick. Guarantees evenly-spaced frames (no gaps), so the
    // recorded video is smooth CFR that TikTok can re-encode without freezing.
    const totalFrames = Math.max(1, Math.round((duration / 1000) * FPS));
    let frameIdx = 0;
    rafRef.current = setInterval(() => {
      const tt = Math.min(frameIdx / totalFrames, 1);
      if (drawFnRef.current) drawFnRef.current(ctx, tt);
      if (videoTrack && videoTrack.requestFrame) videoTrack.requestFrame();
      else if (videoStream.requestFrame) videoStream.requestFrame();
      setProgress(Math.round(tt * 100));
      frameIdx++;
      if (tt >= 1) {
        clearInterval(rafRef.current);
        rafRef.current = null;
        rec.stop();
      }
    }, 1000 / FPS);
  }, []);

  return (
    <VideoRecordingCtx.Provider value={{ recState, progress, label, startRecording, stop }}>
      <canvas ref={canvasRef} width={720} height={1280} style={{ display: 'none', position: 'fixed' }} />
      {children}
    </VideoRecordingCtx.Provider>
  );
}
