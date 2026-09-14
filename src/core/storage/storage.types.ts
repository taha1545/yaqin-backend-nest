import type { StorageMimeGroup } from './storage.constants';

export interface StorageFile {
  buffer: Buffer;
  mimeType: string;
  size: number;
  originalName?: string;
}

export interface StorageValidationRules {
  maxSizeBytes?: number;
  allowedMimeTypes?: readonly string[];
  allowedGroups?: readonly StorageMimeGroup[];
}

export interface UploadFileInput extends StorageFile {
  prefix: string;
  key?: string;
  validation?: StorageValidationRules;
}

export interface UploadFileResult {
  key: string;
  bucket: string;
  mimeType: string;
  size: number;
}

export interface SignedUrlOptions {
  expiresIn?: number;
  downloadName?: string;
}

export interface DeleteFileInput {
  key: string;
}

export interface FileExistsInput {
  key: string;
}
