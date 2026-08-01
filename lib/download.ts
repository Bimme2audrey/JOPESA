export async function downloadFile(url: string, filename?: string) {
  if (!url) return;

  const fallbackName = filename || url.split('/').pop()?.split('?')[0] || 'download';

  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) {
      throw new Error('Download failed');
    }
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = fallbackName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
  } catch {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.download = fallbackName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
