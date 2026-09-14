import { Injectable, InternalServerErrorException, Logger, BadGatewayException, } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { firstValueFrom } from 'rxjs'
import type { AppConfig } from '@/config'
import type { OpenRouterMessage, OpenRouterRequest, OpenRouterResponse } from './openrouter.types'

@Injectable()
export class OpenRouterService {
    //
    private readonly logger = new Logger(OpenRouterService.name)

    constructor(
        private readonly http: HttpService,
        private readonly config: ConfigService<AppConfig, true>,
    ) { }

    async chat(messages: OpenRouterMessage[], options?: { temperature?: number, maxTokens?: number }): Promise<string> {
        //
        const apiKey = this.config.get('ai.openRouter.apiKey', { infer: true })
        const model = this.config.get('ai.openRouter.model', { infer: true })
        const baseUrl = this.config.get('ai.openRouter.baseUrl', { infer: true })
        //
        if (!apiKey) throw new InternalServerErrorException('OpenRouter API key is not configured.');
        const payload: OpenRouterRequest = {
            model,
            messages,
            temperature: options?.temperature,
            max_tokens: options?.maxTokens,
        }
        //
        try {
            const { data } = await firstValueFrom(
                this.http.post<OpenRouterResponse>(
                    `${baseUrl}/chat/completions`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${apiKey}`,
                            'Content-Type': 'application/json',
                        },
                        timeout: 30_000,
                    },
                ),
            )
            const content = data.choices?.[0]?.message?.content;
            if (!content) {
                throw new Error('OpenRouter returned an empty response.');
            }
            return content
            //
        } catch (error) {
            this.logger.error('OpenRouter request failed.', error instanceof Error ? error.stack : undefined)
            throw new InternalServerErrorException('AI service is currently unavailable.')
        }
    }

    async generateJson<T>(prompt: string): Promise<T> {
        const content = await this.chat(
            [{ role: 'user', content: prompt }],
            { temperature: 0.3, maxTokens: 4000 },
        )
        //
        try {
            return JSON.parse(content) as T
            //
        } catch {
            this.logger.error('OpenRouter returned invalid JSON.');
            throw new BadGatewayException('AI service returned an invalid response.');
        }
    }
}