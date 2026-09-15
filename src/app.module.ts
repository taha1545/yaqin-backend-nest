import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { configuration, validateEnv } from './config';

import { CoreModule } from './core';
import { CommonModule } from './common';

import { AuthModule } from './modules/auth';
import { OtpModule } from './modules/otp';
import { AdminModule } from './modules/admin/admin.module'
import { StorageApiModule } from './modules/storage';
import { RolesModule } from './modules/roles/roles.module';
import { ContentModule } from './modules/content/content.module';
import { ChallengesModule } from './modules/challenges/challenge.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [

    ConfigModule.forRoot({ isGlobal: true, load: [configuration], validate: validateEnv }),
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 60_000, limit: 100 }] }),

    // Infrastructure
    CoreModule,
    CommonModule,

    // Supporting modules
    AuthModule,
    OtpModule,
    StorageApiModule,
    RolesModule,
    ContentModule,
    ChallengesModule,
    DashboardModule,
    AiModule,
    AdminModule
  ],
})
export class AppModule { }