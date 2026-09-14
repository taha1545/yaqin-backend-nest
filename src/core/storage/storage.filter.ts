import { BadRequestException, Injectable } from '@nestjs/common';
import { DEFAULT_MAX_FILE_SIZE_BYTES, STORAGE_MIME_GROUPS } from './storage.constants';

import type { StorageFile, StorageValidationRules } from './storage.types';

@Injectable()
export class StorageFilter {

  validate(file: StorageFile, rules: StorageValidationRules = {}): void {
    const maxSizeBytes = rules.maxSizeBytes ?? DEFAULT_MAX_FILE_SIZE_BYTES;
    const allowedMimeTypes = this.resolveAllowedMimeTypes(rules);
    //
    if (file.size <= 0) throw new BadRequestException('File is empty.');
    if (file.size > maxSizeBytes) {
      throw new BadRequestException(`File exceeds the maximum size of ${Math.floor(maxSizeBytes / (1024 * 1024))} MB.`,);
    }
    if (!allowedMimeTypes.includes(file.mimeType)) throw new BadRequestException('File type is not allowed.');
  }

  private resolveAllowedMimeTypes(rules: StorageValidationRules): string[] {
    const groups = rules.allowedGroups?.flatMap((group) => STORAGE_MIME_GROUPS[group]) ?? [];
    //
    const explicit = rules.allowedMimeTypes ?? [];
    //
    const allowed = [...new Set([...groups, ...explicit])];
    if (allowed.length > 0) return allowed;
    //
    return Object.values(STORAGE_MIME_GROUPS).flat();
  }
}
