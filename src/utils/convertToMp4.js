import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

let ff = null;

/**
 * Converts any MediaRecorder blob (WebM VP9 or fragmented MP4) to a
 * traditional H.264-compatible MP4 with moov-at-start (faststart).
 * Uses a stream copy (no re-encode) so it runs in ~2-10 s on mobile.
 *
 * @param {Blob} inputBlob   - WebM or fMP4 blob from MediaRecorder
 * @param {function} onProgress - called with 0-100 during conversion
 * @returns {Promise<Blob>}  - traditional MP4 blob
 */
export async function convertToMp4(inputBlob, onProgress) {
  if (!ff) {
    ff = new FFmpeg();
    const base = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
    await ff.load({
      coreURL: await toBlobURL(`${base}/ffmpeg-core.js`,  'text/javascript'),
      wasmURL: await toBlobURL(`${base}/ffmpeg-core.wasm`, 'application/wasm'),
    });
  }

  const onProg = ({ progress }) =>
    onProgress?.(Math.round(Math.min(100, Math.max(0, progress * 100))));
  ff.on('progress', onProg);

  const ext = inputBlob.type.startsWith('video/mp4') ? 'mp4' : 'webm';
  try {
    await ff.writeFile(`in.${ext}`, new Uint8Array(await inputBlob.arrayBuffer()));
    await ff.exec([
      '-i', `in.${ext}`,
      '-c', 'copy',
      '-movflags', '+faststart',
      'out.mp4',
    ]);
    const data = await ff.readFile('out.mp4');
    return new Blob([data.buffer], { type: 'video/mp4' });
  } finally {
    ff.off('progress', onProg);
    try { await ff.deleteFile(`in.${ext}`); } catch (_) {}
    try { await ff.deleteFile('out.mp4');   } catch (_) {}
  }
}
