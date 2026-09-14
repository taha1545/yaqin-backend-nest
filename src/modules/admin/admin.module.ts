import { Module } from '@nestjs/common'

import { AdminAuthModule } from './auth/auth.module';
import { AdminStatsModule } from './stats/admin-stats.module';

@Module({
    imports: [
        AdminAuthModule,
        AdminStatsModule
    ],
})
export class AdminModule { }