import crypto from 'node:crypto'

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function generateRandomCode(length: number): string {
    const bytes = crypto.randomBytes(length)
    let result = ''
    for (const byte of bytes) {
        result += ALPHABET[byte % ALPHABET.length]
    }
    //
    return result
}

function normalizeName(name: string): string {
    return name
        .normalize('NFKC')
        .replace(/[\s_-]+/g, '')
        .replace(/[^\p{L}]/gu, '')
        .slice(0, 5)
        .toUpperCase()
}

function formatDate(date: Date): string {
    const day = String(date.getUTCDate()).padStart(2, '0')
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const year = date.getUTCFullYear()
    //
    return `${day}${month}${year}`
}

function generateRandomDate(): string {
    const start = Date.UTC(1990, 0, 1)
    const end = Date.UTC(2020, 11, 31)
    const timestamp = crypto.randomInt(start, end + 1)
    //
    return formatDate(new Date(timestamp))
}

export function generateStudentCode(fullName: string, dateOfBirth?: Date | null): string {
    const name = normalizeName(fullName)
    const random = generateRandomCode(6);

    const date = dateOfBirth
        ? formatDate(dateOfBirth)
        : generateRandomDate()

    return `${name}-${random}-${date}`
}