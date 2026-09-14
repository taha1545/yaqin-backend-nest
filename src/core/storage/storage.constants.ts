export const STORAGE_MIME_GROUPS = {
  images: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],

  documents: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],


  video: ['video/mp4', 'video/webm'],
} as const;

export const STORAGE_MIME_EXTENSIONS = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',

  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',

  'video/mp4': '.mp4',
  'video/webm': '.webm',
} as const;

export const DEFAULT_MAX_FILE_SIZE_BYTES = 12 * 1024 * 1024;

const EXTENSION_TO_MIME = Object.entries(STORAGE_MIME_EXTENSIONS).reduce<Record<string, string>>(
  (acc, [mime, extension]) => {
    acc[extension.replace(/^\./, '').toLowerCase()] = mime;
    return acc;
  },
  {},
);

export function resolveMimeType(mimeType: string, originalName?: string): string {
  const trimmed = mimeType.trim().toLowerCase();
  const generic = !trimmed || trimmed === 'application/octet-stream';
  const fallback = trimmed || 'application/octet-stream';

  if (!generic) return trimmed;
  if (!originalName) return fallback;

  const extension = originalName.split('.').pop()?.toLowerCase() ?? '';
  if (!extension) return fallback;

  return EXTENSION_TO_MIME[extension] ?? fallback;
}

export type StorageMimeGroup = keyof typeof STORAGE_MIME_GROUPS;

export type StorageMimeType = keyof typeof STORAGE_MIME_EXTENSIONS;
