import type { Express } from 'express'

import { resolveMimeType, type StorageValidationRules } from '@/core/storage'

export const LESSON_RESOURCE_VALIDATION: StorageValidationRules = {
    allowedGroups: [
        'images',
        'documents',
        'video',
    ],
    maxSizeBytes: 25 * 1024 * 1024,
}

export function getResourceMimeType(file: Express.Multer.File): string {
    return resolveMimeType(
        file.mimetype,
        file.originalname,
    )
}

export function getResourceUploadInput(file: Express.Multer.File, mimeType: string) {
    return {
        buffer: file.buffer,
        mimeType,
        size: file.size,
        originalName: file.originalname,
        prefix: 'lessons',
        validation: LESSON_RESOURCE_VALIDATION,
    }
}