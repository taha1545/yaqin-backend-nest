
import type { QuestionType } from 'generated/prisma/client'

export type QuestionOption = {
    id: string
    isCorrect: boolean
}

export type Question = {
    id: string
    type: QuestionType
    correctAnswer: string | null
    options: QuestionOption[]
}

export type SubmittedAnswer = {
    questionId: string
    optionId?: string
    answer?: string
}

export type GradeAttemptInput = {
    questions: Question[]
    submittedAnswers: SubmittedAnswer[]
    minPresent: number
    lessonXp: number
}