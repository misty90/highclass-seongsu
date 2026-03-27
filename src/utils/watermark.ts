export const resizeImage = (
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    forceJpeg?: boolean;
  } = {}
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        const MAX_WIDTH = options.maxWidth || 1920;
        const MAX_HEIGHT = options.maxHeight || 1920;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        
        // Fill with white background in case of transparent PNG converted to JPEG
        if (options.forceJpeg || file.type !== 'image/png') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
        }
        
        ctx.drawImage(img, 0, 0, width, height);

        const type = options.forceJpeg ? 'image/jpeg' : (file.type === 'image/png' ? 'image/png' : 'image/jpeg');
        const quality = options.quality ?? (type === 'image/jpeg' ? 0.8 : 0.9);
        
        try {
          const dataUrl = canvas.toDataURL(type, quality);
          if (dataUrl === 'data:,') {
            reject(new Error('Canvas toDataURL failed'));
          } else {
            resolve(dataUrl);
          }
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const addWatermark = (
  file: File,
  text: string = 'HIGHCLASS',
  opacity: number = 0.5,
  color: string = '#FFFFFF'
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // Max dimensions to prevent memory issues on mobile/prod
        const MAX_WIDTH = 1600;
        const MAX_HEIGHT = 1600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        // Set canvas dimensions to scaled dimensions
        canvas.width = width;
        canvas.height = height;

        // Fill with white background in case of transparent PNG converted to JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        // Draw original image
        ctx.drawImage(img, 0, 0, width, height);

        // Calculate font size to make text width ~35% of image width
        const targetWidth = canvas.width * 0.35;
        let fontSize = 20;
        ctx.font = `bold ${fontSize}px "Pretendard", "Noto Sans", sans-serif`;
        let textWidth = ctx.measureText(text.toUpperCase()).width;
        
        while (textWidth < targetWidth && fontSize < canvas.height / 2) {
          fontSize += 4;
          ctx.font = `bold ${fontSize}px "Pretendard", "Noto Sans", sans-serif`;
          textWidth = ctx.measureText(text.toUpperCase()).width;
        }

        ctx.fillStyle = color;
        ctx.globalAlpha = opacity;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Add shadow for better visibility
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = Math.max(5, fontSize * 0.1);
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        // Draw text in the center
        ctx.fillText(text.toUpperCase(), canvas.width / 2, canvas.height / 2);

        // Convert to data URL (force jpeg for compression)
        const type = 'image/jpeg';
        const quality = 0.8;
        
        try {
          const dataUrl = canvas.toDataURL(type, quality);
          if (dataUrl === 'data:,') {
            reject(new Error('Canvas toDataURL failed (likely memory limit)'));
          } else {
            resolve(dataUrl);
          }
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
