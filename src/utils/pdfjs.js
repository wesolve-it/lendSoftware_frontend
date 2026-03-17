export const ensurePdfWorker = async () => {
  if (typeof window === 'undefined') return;

  try {
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
    if (pdfjsLib && pdfjsLib.GlobalWorkerOptions) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
    }
    return pdfjsLib;
  } catch (error) {
    // Ignore in test environments or if the module isn't available.
    return null;
  }
};
