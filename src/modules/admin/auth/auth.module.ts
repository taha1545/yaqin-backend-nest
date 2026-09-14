import { Module } from '@nestjs/common'

import { AdminAuthController } from './auth.controller'
import { AdminAuthService } from './auth.service'
import { AuthModule } from '@/modules/auth'

@Module({
    imports: [
        AuthModule,
    ],
    controllers: [
        AdminAuthController,
    ],
    providers: [
        AdminAuthService,
    ],
})
export class AdminAuthModule { }