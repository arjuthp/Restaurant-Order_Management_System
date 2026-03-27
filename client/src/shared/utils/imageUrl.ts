/**
 * Get the full URL for an image path
 * Handles both relative paths and full URLs
 */
export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) {
    return '';
  }

  // If it's already a full URL (Kaha S3), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // For local images, construct backend URL
  const backendBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';

  // Ensure path starts with /
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

  return `${backendBaseUrl}${path}`;
}

/**
 * Get full URLs for an array of image paths
 */
export function getImageUrls(imagePaths: string[] | undefined): string[] {
  if (!imagePaths || imagePaths.length === 0) {
    return [];
  }

  return imagePaths.map(getImageUrl);
}
