export type OpenRouterMessage = {
    role: 'system' | 'user' | 'assistant'
    content: string
}

export type OpenRouterRequest = {
    model: string
    messages: OpenRouterMessage[]
    temperature?: number
    max_tokens?: number
    response_format?: {
        type: 'json_object'
    }
}

export type OpenRouterResponse = {
    choices: Array<{
        message: {
            role: string
            content: string
        }
    }>
}