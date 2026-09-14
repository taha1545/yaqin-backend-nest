
export function calculateAccuracy(correct: number, total: number) {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
}

export function buildPrompt(template: string, context: unknown): string {
    return template.replace(
        '{{CONTEXT}}',
        JSON.stringify(context, null, 2),
    )
}

export function isLessThanOneWeekOld(createdAt: Date,): boolean {
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    return Date.now() - createdAt.getTime() < oneWeek;
}

export function getLatestActivityDate(activity: Array<{ updatedAt: Date }>): Date {
    const first = activity[0]
    if (!first) throw new Error('Activity cannot be empty.');
    //
    return activity.reduce(
        (latest, item) =>
            item.updatedAt > latest
                ? item.updatedAt
                : latest,
        first.updatedAt,
    )
}

export function calculateStats(activity: any[]) {
    let lessonsAttempted = 0
    let lessonsCompleted = 0
    let lessonsFailed = 0
    let questionsAnswered = 0
    let correctAnswers = 0
    //
    const skills = new Map<string, { attempts: number, correct: number }>()
    //
    for (const item of activity) {
        //
        if (item.attempt) lessonsAttempted++;
        if (item.status === 'COMPLETED') lessonsCompleted++;
        if (item.status === 'FAILED') lessonsFailed++;
        //
        for (const answer of item.attempt?.answers ?? []) {
            //
            questionsAnswered++
            if (answer.isCorrect) correctAnswers++;
            for (const skill of item.lesson.skills) {
                const existing = skills.get(skill.skill.name) ?? {
                    attempts: 0,
                    correct: 0,
                }
                existing.attempts++
                if (answer.isCorrect) {
                    existing.correct++
                }
                skills.set(skill.skill.name, existing)
            }
        }
    }
    //
    return {
        lessonsAttempted,
        lessonsCompleted,
        lessonsFailed,
        questionsAnswered,
        correctAnswers,
        incorrectAnswers: questionsAnswered - correctAnswers,
        accuracy: calculateAccuracy(correctAnswers, questionsAnswered),
        skills: [...skills.entries()].map(([name, value]) => ({
            name,
            attempts: value.attempts,
            correct: value.correct,
            accuracy: calculateAccuracy(
                value.correct,
                value.attempts,
            ),
        })),
    }
}

export function buildReportContext(student: any, previousReport: any, activity: any[]) {
    //
    const stats = calculateStats(activity)
    //
    return {
        student: {
            code: student.code,
            name: student.fullName,
            grade: student.grade.name,
            semester: student.semester,
            xp: student.xp,
        },
        previousReport,
        activity: activity.map(item => ({
            lesson: {
                id: item.lesson.id,
                title: item.lesson.title,
                difficulty: item.lesson.difficulty,
                xp: item.lesson.xp,
            },
            unit: {
                id: item.lesson.unit.id,
                title: item.lesson.unit.title,
            },
            module: {
                code: item.lesson.unit.module.code,
                name: item.lesson.unit.module.name,
            },
            skills: item.lesson.skills.map(
                ({ skill }: any) => ({
                    name: skill.name,
                    description: skill.description,
                    target: skill.target,
                }),
            ),
            progress: {
                progress: item.progress,
                status: item.status,
                completedAt: item.completedAt,
            },
            attempt: item.attempt
                ? {
                    status: item.attempt.status,
                    completedAt: item.attempt.completedAt,
                }
                : null,
            answers: item.attempt?.answers.map(
                (answer: any) => ({
                    question: answer.question.question,
                    type: answer.question.type,
                    selectedAnswer:
                        answer.option?.text ??
                        answer.answer ??
                        null,
                    correctAnswer:
                        answer.question.correctAnswer,
                    isCorrect: answer.isCorrect,
                }),
            ) ?? [],
        })),
        stats,
    }
}

