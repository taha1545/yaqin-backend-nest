import { QUESTION_PROMPT } from './question.prompt'
import type { QuestionLessonContext } from './question.types'


export function buildQuestionPrompt( lesson: QuestionLessonContext, count: number, extraPrompt?: string): string {
    return QUESTION_PROMPT
        .replace(
            '{{LESSON}}',
            JSON.stringify(lesson, null, 2),
        )
        .replace(
            '{{COUNT}}',
            String(count),
        )
        .replace(
            '{{EXTRA_PROMPT}}',
            extraPrompt?.trim() || 'لا توجد تعليمات إضافية.',
        )
}