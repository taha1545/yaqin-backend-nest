import { Module } from '@nestjs/common'

import { SkillsController } from './skills.controller'
import { SkillsRepo } from './skills.repo'
import { SkillsService } from './skills.service'


@Module({
    controllers: [
        SkillsController,
    ],

    providers: [
        SkillsRepo,
        SkillsService,
    ],

    exports: [
        SkillsService,
    ],
})
export class SkillsModule { }