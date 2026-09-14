import { Controller, Get, UseGuards } from '@nestjs/common'
import { CurrentStudent, Public } from '@/common/decorators'
import { StudentAuthGuard } from '@/common/guards/student-auth.guard'
import type { StudentSelf as StudentCaller } from '@/common/interfaces'
import { StatsService } from './stats.service'

@Controller('dashboard/students/stats')
export class StatsController {
    //
    constructor(private readonly service: StatsService) { }

    @Get()
    @Public()
    @UseGuards(StudentAuthGuard)
    getDashboard(@CurrentStudent() student: StudentCaller) {
        return this.service.getDashboard(student.code)
    }

    @Get('profile')
    @Public()
    @UseGuards(StudentAuthGuard)
    getProfile(@CurrentStudent() student: StudentCaller) {
        return this.service.getProfile(student.code)
    }
}