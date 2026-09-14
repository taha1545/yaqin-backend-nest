import type { QuestionType } from 'generated/prisma/client'

export interface QuestionOption {
    text: string
    isCorrect: boolean
}

export interface GeneratedQuestion {
    type: QuestionType
    question: string
    explanation: string | null
    correctAnswer: string | null
    options: QuestionOption[]
}

export interface GeneratedQuestions {
    questions: GeneratedQuestion[]
}

export interface QuestionLessonSkill {
    name: string
    description: string | null
    target: string | null
}

export interface QuestionLessonContext {
    id: string
    title: string
    description: string | null
    content: string
    difficulty: string
    module: {
        code: string
        name: string
    }
    unit: {
        id: string
        title: string
    }
    grade: {
        code: string
        name: string
    }
    skills: QuestionLessonSkill[]
}