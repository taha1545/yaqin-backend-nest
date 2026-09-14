import { Injectable, NotFoundException } from '@nestjs/common'
import { StudentDashboardRepo } from './progress.repo'
import {
    getGlobalProgress,
    getProgress,
    getUnitsProgress,
} from './progress.utils'

@Injectable()
export class ProgressService {
    //
    constructor(private readonly repo: StudentDashboardRepo) { }

    async getGlobal(studentCode: string) {
        const student = await this.getStudent(studentCode);
        const modules = await this.repo.findModulesProgress(
            student.code,
            student.gradeCode,
            student.semester,
        );
        //
        return {
            gradeCode: student.gradeCode,
            semester: student.semester,
            progress: getGlobalProgress(modules),
            modules: modules.map(module => ({
                code: module.code,
                name: module.name,
                progress: getProgress(
                    module.units.flatMap(unit => unit.lessons),
                ),
            })),
        }
    }

    async getModule(studentCode: string, moduleCode: string) {
        const student = await this.getStudent(studentCode);
        const module = await this.repo.findModuleProgress(
            student.code,
            moduleCode,
            student.gradeCode,
            student.semester,
        );
        if (!module) throw new NotFoundException('Module not found.');
        //
        return {
            code: module.code,
            name: module.name,
            progress: getProgress(
                module.units.flatMap(unit => unit.lessons),
            ),
            units: getUnitsProgress(module.units),
        }
    }

    async getLesson(studentCode: string, lessonId: string) {
        const lesson = await this.repo.findLessonProgress(studentCode, lessonId)
        if (!lesson) throw new NotFoundException('Lesson not found.')
        //
        const progress = lesson.progress[0]
        return {
            ...lesson,
            progress: progress?.progress ?? 0,
            status: progress?.status ?? 'NOT_STARTED',
            completedAt: progress?.completedAt ?? null,
        }
    }


    private async getStudent(studentCode: string) {
        const student = await this.repo.findStudent(studentCode)
        if (!student) {
            throw new NotFoundException('Student not found.')
        }
        //
        return student
    }
}