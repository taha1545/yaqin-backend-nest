import { Module } from '@nestjs/common'

import { CommentsController } from './comments.controller'
import { CommentsRepo } from './comments.repo'
import { CommentsService } from './comments.service'

@Module({
    controllers: [
        CommentsController,
    ],
    providers: [
        CommentsService,
        CommentsRepo,
    ],
    exports: [
        CommentsService,
    ],
})
export class CommentsModule { }