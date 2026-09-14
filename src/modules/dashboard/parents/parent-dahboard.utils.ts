import type { ProgressRecord, XpTransaction, Curriculum, Student } from "./parent-dashboard.types"

export function groupProgressByStudent(progress: ProgressRecord[]) {
    const map = new Map<string, ProgressRecord[]>()
    //
    for (const item of progress) {
        const current = map.get(item.studentCode)
        if (current) {
            current.push(item)
        } else {
            map.set(item.studentCode, [item])
        }
    }
    return map
}

export function groupXpByStudent(transactions: XpTransaction[]) {
    const map = new Map<string, XpTransaction[]>()
    //
    for (const transaction of transactions) {
        const current = map.get(transaction.studentCode)
        if (current) {
            current.push(transaction)
        } else {
            map.set(transaction.studentCode, [transaction])
        }
    }
    //
    return map
}

export function getModuleProgress(modules: Curriculum['modules'], studentProgress: ProgressRecord[]) {
    //
    const progressMap = new Map(
        studentProgress.map(item => [
            item.lesson.id,
            item.progress,
        ]),
    )
    //
    return modules.map(module => {
        const lessons = module.units.flatMap(unit => unit.lessons)
        const total = lessons.length
        //
        if (!total) {
            return {
                code: module.code,
                name: module.name,
                progress: 0,
                lessons: 0,
            }
        }
        //
        const completedProgress = lessons.reduce((sum, lesson) => sum + (progressMap.get(lesson.id) ?? 0), 0)
        //
        return {
            code: module.code,
            name: module.name,
            progress: Math.round(completedProgress / total),
            lessons: total,
        }
    })
}

export function getSemesterStats(curriculum: Curriculum['modules'], studentProgress: ProgressRecord[]) {
    const lessons = curriculum.flatMap(module => module.units.flatMap(unit => unit.lessons))
    //
    const progressMap = new Map(
        studentProgress.map(item => [
            item.lesson.id,
            item,
        ]),
    )
    const total = lessons.length
    const completed = lessons.filter(lesson => progressMap.get(lesson.id)?.status === 'COMPLETED').length
    //
    return {
        total,
        completed,
        remaining: Math.max(total - completed, 0),
    }
}

export function getRecentProgress(studentProgress: ProgressRecord[]) {
    return studentProgress
        .slice(0, 10)
        .map(item => ({
            lesson: {
                id: item.lesson.id,
                title: item.lesson.title,
                difficulty: item.lesson.difficulty,
                xp: item.lesson.xp,
            },
            module: item.lesson.unit.module,
            unit: {
                id: item.lesson.unit.id,
                title: item.lesson.unit.title,
            },
            progress: item.progress,
            status: item.status,
            completedAt: item.completedAt,
            updatedAt: item.updatedAt,
        }))
}

export function buildStudentDashboard(
    student: Student, curriculum: Curriculum | undefined,
    studentProgress: ProgressRecord[], xpTransactions: XpTransaction[],
) {
    const modules = curriculum?.modules ?? []
    //
    return {
        student: {
            code: student.code,
            fullName: student.fullName,
            imagePath: student.imagePath,
            schoolName: student.schoolName,
            wilaya: student.wilaya,
            semester: student.semester,
            xp: student.xp,
        },
        semester: getSemesterStats(
            modules,
            studentProgress,
        ),
        modules: getModuleProgress(
            modules,
            studentProgress,
        ),
        recentProgress: getRecentProgress(
            studentProgress,
        ),
        xpTransactions,
    }
}

export function buildParentDashboard(
    students: Student[], curriculum: Curriculum[],
    progress: ProgressRecord[], xpTransactions: XpTransaction[],
) {
    const progressByStudent = groupProgressByStudent(progress)
    const xpByStudent = groupXpByStudent(xpTransactions)
    const curriculumMap = new Map(
        curriculum.map(item => [
            `${item.gradeCode}:${item.semester}`,
            item,
        ]),
    )
    //
    return students.map(student => {
        const key = `${student.gradeCode}:${student.semester}`;
        return buildStudentDashboard(
            student,
            curriculumMap.get(key),
            progressByStudent.get(student.code) ?? [],
            xpByStudent.get(student.code) ?? [],
        )
    })
}