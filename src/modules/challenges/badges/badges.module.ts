import { Module } from '@nestjs/common'

import { BadgesController } from './badges.controller'
import { BadgesService } from './badges.service'
import { BadgesRepo } from './badges.repo'

@Module({
    controllers: [
        BadgesController,
    ],

    providers: [
        BadgesService,
        BadgesRepo,
    ],

    exports: [
        BadgesService,
    ],
})
export class BadgesModule { }