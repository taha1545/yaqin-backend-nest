import { Module } from '@nestjs/common'

import { LessonsController } from './lessons.controller'
import { LessonsRepo } from './lessons.repo'
import { LessonsService } from './lessons.service'

@Module({
    controllers: [LessonsController],
    providers: [
        LessonsService,
        LessonsRepo,
    ],
    exports: [
        LessonsService,
    ],
})
export class LessonsModule { }