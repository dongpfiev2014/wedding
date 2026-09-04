/**
 * Compresses an image File using canvas before uploading.
 * Strategy:
 * 1. Resize to maxWidth x maxHeight (keeping aspect ratio)
 * 2. Start at maxQuality, reduce by `qualityStep` each attempt
 * 3. Stop as soon as the output is below `targetBytes`, or quality hits `minQuality`
 *
 * This preserves maximum visual quality while guaranteeing the file fits
 * within the given size constraint.
 */
export async function compressImage(
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    /** Target output size in bytes. Default 8 MB (leaves headroom under 10 MB) */
    targetBytes?: number;
    maxQuality?: number;
    minQuality?: number;
    qualityStep?: number;
    outputType?: string;
  } = {}
): Promise<File> {
  const {
    maxWidth = 3840,
    maxHeight = 3840,
    targetBytes = 8 * 1024 * 1024, // 8 MB
    maxQuality = 0.95,
    minQuality = 0.5,
    qualityStep = 0.05,
    outputType = "image/jpeg",
  } = options;

  // Skip compression for small files
  if (file.size <= targetBytes) return file;

  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      // Downscale only if larger than max dimensions
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(file); return; }
      ctx.drawImage(img, 0, 0, width, height);

      // Progressively try lower quality until file fits
      const tryQuality = (quality: number) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) { resolve(file); return; }

            if (blob.size <= targetBytes || quality - qualityStep < minQuality) {
              const ext = outputType === "image/png" ? "png" : "jpg";
              const compressed = new File(
                [blob],
                file.name.replace(/\.[^.]+$/, `.${ext}`),
                { type: outputType }
              );
              resolve(compressed);
            } else {
              tryQuality(Math.round((quality - qualityStep) * 100) / 100);
            }
          },
          outputType,
          quality
        );
      };

      tryQuality(maxQuality);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}
