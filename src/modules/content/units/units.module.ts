import { Module } from '@nestjs/common'

import { UnitsController } from './units.controller'
import { UnitsRepo } from './units.repo'
import { UnitsService } from './units.service'

@Module({
    controllers: [
        UnitsController,
    ],
    providers: [
        UnitsService,
        UnitsRepo,
    ],
    exports: [
        UnitsService,
    ],
})
export class UnitsModule { }