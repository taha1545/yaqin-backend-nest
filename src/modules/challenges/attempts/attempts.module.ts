import { Module } from '@nestjs/common'
import { AttemptsController } from './attempts.controller'
import { AttemptsService } from './attempts.service'
import { AttemptsRepo } from './attempts.repo'

@Module({
    controllers: [AttemptsController],
    providers: [
        AttemptsService,
        AttemptsRepo,
    ],
    exports: [
        AttemptsService,
    ],
})
export class AttemptsModule { }