type LessonProgress = {
    progress: Array<{
        progress: number
        status: string
        completedAt?: Date | null
    }>
}

export function getProgress(lessons: LessonProgress[]) {
    if (!lessons.length) return 0
    const total = lessons.reduce(
        (sum, lesson) => sum + (lesson.progress[0]?.progress ?? 0),
        0,
    )
    //
    return Math.round(total / lessons.length)
}

export function getLessonsProgress<T extends LessonProgress>(lessons: T[]) {
    return lessons.map(lesson => ({
        ...lesson,
        progress: lesson.progress[0]?.progress ?? 0,
        status: lesson.progress[0]?.status ?? 'NOT_STARTED',
        completedAt: lesson.progress[0]?.completedAt ?? null,
    }))
}

export function getUnitsProgress<
    T extends { lessons: LessonProgress[] }
>(units: T[]) {
    return units.map(unit => ({
        ...unit,
        progress: getProgress(unit.lessons),
        lessons: getLessonsProgress(unit.lessons),
    }))
}

export function getGlobalProgress<
    T extends {
        units: Array<{
            lessons: LessonProgress[]
        }>
    }
>(modules: T[]) {
    const lessons = modules.flatMap(module =>
        module.units.flatMap(unit => unit.lessons),
    )
    //
    return getProgress(lessons)
}