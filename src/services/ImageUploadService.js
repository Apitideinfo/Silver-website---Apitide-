import { uploadApi } from '../api/upload.api';
import { compressImage } from '../utils/imageCompressor';

// Helper to convert File/Blob to base64 DataURL
const fileToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

export const ImageUploadService = {
  // Upload media (Image or Video) with automatic client-side compression and Cloudinary hosting
  async uploadImage(file, timeoutMs = 90000) {
    const cloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'pndcvmmv';
    const cloudinaryPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const isVideo = file.type?.startsWith('video/') || /\.(mp4|webm|mov|mkv|avi|m4v)$/i.test(file.name || '');
    const resourceType = isVideo ? 'video' : 'image';

    // Compress image before uploading (reduces 5MB-10MB photos to ~80KB-120KB)
    let uploadPayload = file;
    if (!isVideo) {
      try {
        uploadPayload = await compressImage(file, {
          maxWidth: 1280,
          maxHeight: 1280,
          quality: 0.82,
          outputType: 'image/webp'
        });
      } catch (compErr) {
        console.warn('Pre-upload image compression skipped:', compErr);
      }
    }

    // 1. Attempt server-side authenticated Cloudinary upload via /api/upload-image
    try {
      const fileData = await fileToBase64(uploadPayload);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const serverRes = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileData,
          folder: isVideo ? 'manish_and_co/videos' : 'manish_and_co/products'
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (serverRes.ok) {
        const data = await serverRes.json();
        if (data.url || data.downloadURL) {
          return {
            name: file.name,
            url: data.url || data.downloadURL,
            publicId: data.publicId || '',
            resourceType: data.resourceType || resourceType,
            isVideo
          };
        }
      }
    } catch (serverErr) {
      console.warn('Serverless Cloudinary upload failed, attempting direct upload:', serverErr.message);
    }

    // 2. Direct Cloudinary unsigned upload fallback (if preset is configured)
    if (cloudinaryCloudName && cloudinaryPreset) {
      try {
        const formData = new FormData();
        formData.append('file', uploadPayload);
        formData.append('upload_preset', cloudinaryPreset);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/${resourceType}/upload`,
          {
            method: 'POST',
            body: formData,
            signal: controller.signal
          }
        );

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          return {
            name: file.name,
            url: data.secure_url || data.url,
            publicId: data.public_id,
            resourceType: data.resource_type || resourceType,
            isVideo
          };
        }
      } catch (err) {
        console.warn(`Direct Cloudinary ${resourceType} upload failed:`, err);
      }
    }

    // 3. Fallback to Firebase Storage if available
    return await uploadApi.uploadFile(file, isVideo ? 'videos' : 'products');
  }
};
