import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

// Blob URLs are fetched once and cached — no re-download on subsequent calls.
let blobURLsPromise = null;

function getBlobURLs() {
  if (!blobURLsPromise) {
    const base = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
    blobURLsPromise = Promise.all([
      toBlobURL(`${base}/ffmpeg-core.js`,  'text/javascript'),
      toBlobURL(`${base}/ffmpeg-core.wasm`, 'application/wasm'),
    ]).then(([coreURL, wasmURL]) => ({ coreURL, wasmURL }));
  }
  return blobURLsPromise;
}

export async function convertToMp4(inputBlob, onProgress) {
  const { coreURL, wasmURL } = await getBlobURLs();

  // Fresh instance each call — the singleton worker hangs on second exec() call
  // (known ffmpeg.wasm v0.12 issue). Blob URLs are cached so load() is fast.
  const instance = new FFmpeg();
  await instance.load({ coreURL, wasmURL });

  const onProg = ({ progress }) =>
    onProgress?.(Math.round(Math.min(100, Math.max(0, progress * 100))));
  instance.on('progress', onProg);

  const ext = inputBlob.type.startsWith('video/mp4') ? 'mp4' : 'webm';
  try {
    await instance.writeFile(`in.${ext}`, new Uint8Array(await inputBlob.arrayBuffer()));
    await instance.exec([
      '-ignore_editlist', '1',   // strip Safari fMP4 edit-list PTS offset before remux
      '-fflags', '+genpts',
      '-i', `in.${ext}`,
      '-c', 'copy',
      '-movflags', '+faststart',
      '-avoid_negative_ts', 'make_zero',
      'out.mp4',
    ]);
    const data = await instance.readFile('out.mp4');
    return new Blob([data.buffer], { type: 'video/mp4' });
  } finally {
    instance.off('progress', onProg);
    instance.terminate();
  }
}
