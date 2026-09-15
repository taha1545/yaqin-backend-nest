import crypto from 'node:crypto';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateRandomCode(length: number): string {
    const bytes = crypto.randomBytes(length);
    let result = '';
    for (const byte of bytes) {
        result += ALPHABET[byte % ALPHABET.length];
    }
    return result;
}

function formatDate(date: Date): string {
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    //
    return `${day}${month}${year}`;
}

export function generateStudentCode(dateOfBirth?: Date | null): string {
    const random = generateRandomCode(8);
    const date = dateOfBirth
        ? formatDate(dateOfBirth)
        : '';
    //
    return date
        ? `STU-${random}-${date}`
        : `STU-${random}`;
}