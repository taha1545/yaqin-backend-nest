import type { StorageValidationRules } from '@/core/storage'

export const STUDENT_IMAGE_VALIDATION: StorageValidationRules = {
    allowedGroups: ['images'],
    maxSizeBytes: 5 * 1024 * 1024,
}