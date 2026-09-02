/**
 * Utility to convert various cloud storage URLs (Google Drive, Dropbox, etc.)
 * into direct embeddable image URLs.
 */
export function formatDirectImageUrl(rawUrl: string): string {
  if (!rawUrl) return rawUrl;
  const trimmed = rawUrl.trim();

  // 1. Google Drive file link transformation
  // Format: https://drive.google.com/file/d/FILE_ID/view... or https://drive.google.com/open?id=FILE_ID
  const driveFileRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const driveIdRegex = /drive\.google\.com\/(?:open|uc)\?(?:.*&)?id=([a-zA-Z0-9_-]+)/;
  
  const fileMatch = trimmed.match(driveFileRegex);
  if (fileMatch && fileMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${fileMatch[1]}`;
  }

  const idMatch = trimmed.match(driveIdRegex);
  if (idMatch && idMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
  }

  // 2. Dropbox link transformation (dl=0 -> raw=1)
  if (trimmed.includes('dropbox.com')) {
    return trimmed.replace(/\?dl=[01]/, '?raw=1').replace(/&dl=[01]/, '&raw=1');
  }

  return trimmed;
}
