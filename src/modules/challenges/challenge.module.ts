import { Module } from '@nestjs/common'

import { AttemptsModule } from './attempts/attempts.module';
import { BadgesModule } from './badges/badges.module'

@Module({
    imports: [
        AttemptsModule,
        BadgesModule,
    ],
})
export class ChallengesModule { }