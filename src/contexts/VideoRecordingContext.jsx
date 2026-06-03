import { createContext, useContext, useRef, useState, useCallback } from 'react';
import { Muxer, ArrayBufferTarget } from 'mp4-muxer';

const VideoRecordingCtx = createContext(null);

export function useVideoRecording() {
  return useContext(VideoRecordingCtx);
}

// AVC codec strings in preference order (most → least compatible)
const AVC_CODECS = ['avc1.42E01F', 'avc1.4D0028', 'avc1.640028'];

async function pickAvcCodec(width, height, framerate, bitrate) {
  if (typeof VideoEncoder === 'undefined') return null;
  for (const codec of AVC_CODECS) {
    try {
      const { supported } = await VideoEncoder.isConfigSupported({
        codec, width, height, framerate, bitrate,
        hardwareAcceleration: 'prefer-hardware',
      });
      if (supported) return codec;
    } catch (_) { /* try next */ }
  }
  return null;
}

export function VideoRecordingProvider({ children }) {
  const canvasRef  = useRef(null);
  const recRef     = useRef(null);
  const rafRef     = useRef(null);
  const chunksRef  = useRef([]);
  const cancelRef  = useRef(false);

  const [recState, setRecState] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [label,    setLabel]    = useState('');

  const stop = useCallback(() => {
    cancelRef.current = true;
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); clearInterval(rafRef.current); rafRef.current = null; }
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

    // ── WebCodecs path ──────────────────────────────────────────────────────
    // Encodes directly to a traditional MP4 (moov-at-start) that TikTok
    // Creator can seek and re-encode. MediaRecorder on Safari produces fMP4
    // whose moov has duration=0, causing AVAssetExportSession to stall.
    const avcCodec = await pickAvcCodec(canvas.width, canvas.height, FPS, 5_000_000);

    if (avcCodec && typeof VideoFrame !== 'undefined') {
      const target = new ArrayBufferTarget();
      const muxer  = new Muxer({
        target,
        video: { codec: 'avc', width: canvas.width, height: canvas.height },
        fastStart: 'in-memory',
      });

      let encoderError = null;
      const encoder = new VideoEncoder({
        output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
        error:  (e) => { encoderError = e; },
      });

      encoder.configure({
        codec:                avcCodec,
        width:                canvas.width,
        height:               canvas.height,
        bitrate:              5_000_000,
        framerate:            FPS,
        hardwareAcceleration: 'prefer-hardware',
      });

      const totalFrames = Math.round((duration / 1000) * FPS);

      try {
        for (let i = 0; i <= totalFrames; i++) {
          if (cancelRef.current || encoderError) break;

          const tt = Math.min(i / totalFrames, 1);
          if (drawFnRef.current) drawFnRef.current(ctx, tt);
          setProgress(Math.round(tt * 100));

          const vf = new VideoFrame(canvas, {
            timestamp: Math.round((i / FPS) * 1_000_000), // µs
          });
          encoder.encode(vf, { keyFrame: i % (FPS * 2) === 0 });
          vf.close();

          // Backpressure: keep queue small to avoid OOM / stall
          while (encoder.encodeQueueSize > 5) {
            await new Promise(r => setTimeout(r, 16));
          }
          // Yield to event loop each frame so UI stays responsive
          await new Promise(r => setTimeout(r, 0));
        }

        if (encoderError) throw encoderError;

        if (!cancelRef.current) {
          await encoder.flush();
          setRecState('processing');
          muxer.finalize();
          const blob = new Blob([target.buffer], { type: 'video/mp4' });
          const url  = URL.createObjectURL(blob);
          const a    = document.createElement('a');
          a.href = url; a.download = finalFilename; a.click();
          setTimeout(() => URL.revokeObjectURL(url), 3000);
        }
      } catch (err) {
        console.warn('WebCodecs encoding failed, falling back to MediaRecorder:', err);
        encoder.close?.();
        // fall through to MediaRecorder below
        await startMediaRecorder({ canvas, ctx, drawFnRef, duration, finalFilename, FPS, recRef, chunksRef, cancelRef, rafRef, setRecState, setProgress });
        return;
      }

      setRecState('idle');
      setProgress(0);
      return;
    }

    // ── MediaRecorder fallback ──────────────────────────────────────────────
    await startMediaRecorder({ canvas, ctx, drawFnRef, duration, finalFilename, FPS, recRef, chunksRef, cancelRef, rafRef, setRecState, setProgress });
  }, []);

  return (
    <VideoRecordingCtx.Provider value={{ recState, progress, label, startRecording, stop }}>
      <canvas ref={canvasRef} width={720} height={1280} style={{ display: 'none', position: 'fixed' }} />
      {children}
    </VideoRecordingCtx.Provider>
  );
}

function startMediaRecorder({ canvas, ctx, drawFnRef, duration, finalFilename, FPS, recRef, chunksRef, cancelRef, rafRef, setRecState, setProgress }) {
  return new Promise((resolve) => {
    const videoStream = canvas.captureStream(30);
    let stream = videoStream;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const gain = audioCtx.createGain(); gain.gain.value = 0;
      const osc = audioCtx.createOscillator(); osc.connect(gain);
      const dest = audioCtx.createMediaStreamDestination(); gain.connect(dest); osc.start();
      stream = new MediaStream([...videoStream.getVideoTracks(), ...dest.stream.getAudioTracks()]);
    } catch (_) { /* video-only */ }

    const MIME_CANDIDATES = [
      'video/mp4;codecs=avc1', 'video/mp4;codecs=h264', 'video/mp4',
      'video/webm;codecs=h264', 'video/webm;codecs=vp9', 'video/webm',
    ];
    const mime = MIME_CANDIDATES.find(m => MediaRecorder.isTypeSupported(m)) ?? 'video/mp4';
    const ext  = mime.startsWith('video/mp4') ? 'mp4' : 'webm';
    const fbFile = finalFilename.replace(/\.mp4$/i, '.' + ext);

    const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 5_000_000 });
    recRef.current = rec;
    rec.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    rec.onstop = () => {
      setRecState('processing');
      const blob = new Blob(chunksRef.current, { type: mime });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = fbFile; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 3000);
      setRecState('idle'); setProgress(0);
      resolve();
    };

    rec.start();
    const t0 = performance.now();
    function frame(now) {
      if (cancelRef.current) { rec.stop(); return; }
      const tt = Math.min((now - t0) / duration, 1);
      if (drawFnRef.current) drawFnRef.current(ctx, tt);
      setProgress(Math.round(tt * 100));
      if (tt < 1) { rafRef.current = requestAnimationFrame(frame); }
      else { rafRef.current = null; rec.stop(); }
    }
    rafRef.current = requestAnimationFrame(frame);
  });
}
