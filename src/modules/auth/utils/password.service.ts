import { Injectable } from '@nestjs/common'
import bcrypt from 'bcrypt'

import type { AppConfig } from '@/config'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class PasswordService {

    constructor(private readonly config: ConfigService<AppConfig, true>) { }

    async hash(password: string): Promise<string> {
        return bcrypt.hash(password, this.bcryptRounds())
    }

    async compare(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash)
    }

    private bcryptRounds(): number {
        return this.config.get('auth.bcryptRounds', { infer: true })
    }
}