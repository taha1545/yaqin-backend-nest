import type { LessonDifficulty, ProgressStatus, QuestionType, QuizAttemptStatus, } from 'generated/prisma/client'

export interface ReportStudent {
    code: string
    name: string
    grade: string
    semester: number
    xp: number
}

export interface ReportSkill {
    name: string
    description: string | null
    target: string | null
}

export interface ReportAnswer {
    question: string
    type: QuestionType
    selectedAnswer: string | null
    correctAnswer: string | null
    isCorrect: boolean
}

export interface ReportActivity {
    lesson: {
        id: string
        title: string
        difficulty: LessonDifficulty
        xp: number
    }

    unit: {
        id: string
        title: string
    }

    module: {
        code: string
        name: string
    }

    skills: ReportSkill[]

    progress: {
        progress: number
        status: ProgressStatus
        completedAt: Date | null
    }

    attempt: {
        status: QuizAttemptStatus
        completedAt: Date | null
    } | null

    answers: ReportAnswer[]
}

export interface ReportSkillStat {
    name: string
    attempts: number
    correct: number
    accuracy: number
}

export interface ReportStats {
    lessonsAttempted: number
    lessonsCompleted: number
    lessonsFailed: number
    questionsAnswered: number
    correctAnswers: number
    incorrectAnswers: number
    accuracy: number
    skills: ReportSkillStat[]
}

export interface StudentReportContext {
    student: ReportStudent
    previousReport: StudentReport | null
    activity: ReportActivity[]
    stats: ReportStats
}

export interface StudentReport {
    summary: string
    strengths: string[]
    weaknesses: string[]
    progress: string
    recommendations: string[]
}