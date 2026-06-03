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
    mimeType,
  }) => {
    const canvas = canvasRef.current;
    if (!canvas || typeof MediaRecorder === 'undefined') return;

    setRecState('recording');
    setProgress(0);
    setLabel(lbl);
    chunksRef.current = [];

    const ctx  = canvas.getContext('2d');
    // Dessiner le frame t=0 avant de démarrer le recorder pour effacer le contenu de la vidéo précédente
    if (drawFnRef.current) drawFnRef.current(ctx, 0);
    const stream = canvas.captureStream(30);

    const mime = mimeType
      || (MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm');
    const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 5_000_000 });
    recRef.current = rec;

    rec.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    rec.onstop = () => {
      setRecState('processing');
      const blob = new Blob(chunksRef.current, { type: mime });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = filename; a.click();
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
      <canvas ref={canvasRef} width={720} height={1280} style={{ display: 'none', position: 'fixed' }} />
      {children}
    </VideoRecordingCtx.Provider>
  );
}
