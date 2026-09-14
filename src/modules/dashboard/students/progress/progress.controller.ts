import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { CurrentStudent, Public } from '@/common/decorators'
import { StudentAuthGuard } from '@/common/guards/student-auth.guard'
import type { StudentSelf as StudentCaller } from '@/common/interfaces'
import { ProgressService } from './progress.service'

@Controller('dashboard/students/progress')
export class ProgressController {
    //
    constructor(private readonly service: ProgressService) { }

    @Get()
    @Public()
    @UseGuards(StudentAuthGuard)
    getGlobal(@CurrentStudent() student: StudentCaller) {
        return this.service.getGlobal(student.code)
    }

    @Get('modules/:moduleCode')
    @Public()
    @UseGuards(StudentAuthGuard)
    getModule(
        @Param('moduleCode') moduleCode: string,
        @CurrentStudent() student: StudentCaller,
    ) {
        return this.service.getModule(
            student.code,
            moduleCode,
        )
    }

    @Get('lessons/:lessonId')
    @Public()
    @UseGuards(StudentAuthGuard)
    getLesson(
        @Param('lessonId') lessonId: string,
        @CurrentStudent() student: StudentCaller,
    ) {
        return this.service.getLesson(
            student.code,
            lessonId,
        )
    }
}