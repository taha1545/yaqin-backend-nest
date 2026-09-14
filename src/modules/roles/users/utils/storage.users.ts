import type { Express } from 'express'

import { resolveMimeType, type StorageValidationRules, } from '@/core/storage'

export const USER_IMAGE_VALIDATION: StorageValidationRules = {
    allowedGroups: ['images'],
    maxSizeBytes: 5 * 1024 * 1024,
}

export function getUserImageMimeType(file: Express.Multer.File,): string {
    return resolveMimeType(
        file.mimetype,
        file.originalname,
    )
}

export function getUserImageUploadInput(file: Express.Multer.File, mimeType: string) {
    return {
        buffer: file.buffer,
        mimeType,
        size: file.size,
        originalName: file.originalname,
        prefix: 'pfp',
        validation: USER_IMAGE_VALIDATION,
    }
}