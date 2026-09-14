import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'

import { OpenRouterService } from './openrouter.service'

@Module({
    imports: [
        HttpModule,
    ],
    providers: [
        OpenRouterService,
    ],
    exports: [
        OpenRouterService,
    ],
})
export class OpenRouterModule { }