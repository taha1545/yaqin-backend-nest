export type ProgressRecord = {
    studentCode: string
    progress: number
    status: string
    completedAt: Date | null
    updatedAt: Date
    lesson: {
        id: string
        title: string
        difficulty: string
        xp: number
        unit: {
            id: string
            title: string
            gradeCode: string
            semester: number
            module: {
                code: string
                name: string
            }
        }
    }
}

export type Curriculum = {
    gradeCode: string
    semester: number
    modules: Array<{
        code: string
        name: string
        units: Array<{
            id: string
            title: string
            order: number
            lessons: Array<{
                id: string
                title: string
                order: number
            }>
        }>
    }>
}

export type Student = {
    code: string
    fullName: string
    gradeCode: string
    semester: number
    xp: number
    imagePath: string | null
    schoolName: string | null
    wilaya: string
}

export type XpTransaction = {
    id: string
    studentCode: string
    amount: number
    source: string | null
    referenceId: string | null
    createdAt: Date
}