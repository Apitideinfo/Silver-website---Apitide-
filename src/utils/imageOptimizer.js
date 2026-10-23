/**
 * Optimizes Cloudinary and other image URLs for maximum performance and minimal bandwidth.
 * Injects automatic format selection (WebP/AVIF) and quality optimization (f_auto,q_auto,c_limit).
 */
export function getOptimizedImageUrl(url, options = {}) {
  if (!url || typeof url !== 'string') return url;

  // Check if it is a Cloudinary URL
  if (url.includes('res.cloudinary.com')) {
    // Avoid double transformation
    if (url.includes('/f_auto') || url.includes('/q_auto')) {
      return url;
    }

    const { width = 800, quality = 'auto:good', format = 'auto', crop = 'limit' } = options;
    const transformStr = `f_${format},q_${quality}${width ? `,w_${width},c_${crop}` : ''}`;

    // Insert transformation after /upload/
    return url.replace('/image/upload/', `/image/upload/${transformStr}/`);
  }

  return url;
}

export default getOptimizedImageUrl;
