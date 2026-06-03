import { createContext, useContext, useRef, useState, useCallback } from 'react';
import { Muxer, ArrayBufferTarget } from 'mp4-muxer';

const VideoRecordingCtx = createContext(null);

export function useVideoRecording() {
  return useContext(VideoRecordingCtx);
}

function canUseWebCodecs() {
  return typeof VideoEncoder !== 'undefined' && typeof VideoFrame !== 'undefined';
}

export function VideoRecordingProvider({ children }) {
  const canvasRef   = useRef(null);
  const recRef      = useRef(null);  // MediaRecorder fallback
  const rafRef      = useRef(null);  // interval id
  const chunksRef   = useRef([]);
  const cancelRef   = useRef(false);

  const [recState, setRecState] = useState('idle'); // idle | recording | processing
  const [progress, setProgress] = useState(0);
  const [label,    setLabel]    = useState('');

  const stop = useCallback(() => {
    cancelRef.current = true;
    if (rafRef.current) { clearInterval(rafRef.current); rafRef.current = null; }
    if (recRef.current && recRef.current.state !== 'inactive') recRef.current.stop();
  }, []);

  const startRecording = useCallback(async ({
    drawFnRef,
    duration = 70_000,
    filename = 'video.mp4',
    label: lbl = '',
  }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setRecState('recording');
    setProgress(0);
    setLabel(lbl);
    cancelRef.current = false;
    chunksRef.current = [];

    const ctx = canvas.getContext('2d');
    const FPS = 30;
    const finalFilename = filename.replace(/\.(webm|mp4)$/i, '') + '.mp4';

    // ── WebCodecs path (Safari 15.4+, Chrome 94+) ──────────────────────────
    // Produces a true non-fragmented MP4 with moov-at-start (fastStart).
    // TikTok Creator needs a seekable traditional MP4; the fragmented fMP4 that
    // MediaRecorder emits causes TikTok's AVAssetExportSession to stall.
    if (canUseWebCodecs()) {
      const target = new ArrayBufferTarget();
      const muxer  = new Muxer({
        target,
        video: { codec: 'avc', width: canvas.width, height: canvas.height },
        fastStart: 'in-memory',
      });

      const encoder = new VideoEncoder({
        output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
        error:  (e) => console.error('VideoEncoder', e),
      });

      encoder.configure({
        codec:                  'avc1.4D0029', // H.264 Main Profile Level 4.1
        width:                  canvas.width,
        height:                 canvas.height,
        bitrate:                5_000_000,
        framerate:              FPS,
        hardwareAcceleration:   'prefer-hardware',
      });

      const totalFrames = Math.round((duration / 1000) * FPS);

      // Draw + encode one frame per tick at a fixed interval.
      // VideoFrame reads directly from the canvas 2D buffer (works with display:none).
      await new Promise((resolve) => {
        let frameIdx = 0;
        rafRef.current = setInterval(async () => {
          if (cancelRef.current) {
            clearInterval(rafRef.current);
            rafRef.current = null;
            encoder.close();
            resolve();
            return;
          }

          const tt = Math.min(frameIdx / totalFrames, 1);
          if (drawFnRef.current) drawFnRef.current(ctx, tt);
          setProgress(Math.round(tt * 100));

          const timestamp = Math.round((frameIdx / FPS) * 1_000_000); // µs
          const keyFrame  = frameIdx % (FPS * 2) === 0;
          const vf = new VideoFrame(canvas, { timestamp });
          encoder.encode(vf, { keyFrame });
          vf.close();

          frameIdx++;
          if (tt >= 1) {
            clearInterval(rafRef.current);
            rafRef.current = null;
            await encoder.flush();
            resolve();
          }
        }, 1000 / FPS);
      });

      if (cancelRef.current) { setRecState('idle'); setProgress(0); return; }

      setRecState('processing');
      muxer.finalize();
      const blob = new Blob([target.buffer], { type: 'video/mp4' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = finalFilename; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 3000);
      setRecState('idle');
      setProgress(0);
      return;
    }

    // ── MediaRecorder fallback (older browsers) ─────────────────────────────
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
    } catch (_) { /* video-only fallback */ }

    const MIME_CANDIDATES = [
      'video/mp4;codecs=avc1', 'video/mp4;codecs=h264', 'video/mp4',
      'video/webm;codecs=h264', 'video/webm;codecs=vp9', 'video/webm',
    ];
    const mime = MIME_CANDIDATES.find(m => MediaRecorder.isTypeSupported(m)) ?? 'video/mp4';
    const ext  = mime.startsWith('video/mp4') ? 'mp4' : 'webm';
    const fbFilename = filename.replace(/\.(webm|mp4)$/i, '') + '.' + ext;

    const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 5_000_000 });
    recRef.current = rec;
    rec.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    rec.onstop = () => {
      setRecState('processing');
      const blob = new Blob(chunksRef.current, { type: mime });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = fbFilename; a.click();
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
