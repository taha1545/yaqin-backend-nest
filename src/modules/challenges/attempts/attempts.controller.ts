import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common'
import { CurrentStudent, Public } from '@/common/decorators'
import type { StudentSelf as StudentCaller } from '@/common/interfaces'
import type { ListAttemptsQueryDto, StartAttemptDto, SubmitAttemptDto, } from './dto'
import { StudentAuthGuard } from '@/common/guards/student-auth.guard';
import { AttemptsService } from './attempts.service'


@Controller('attempts')
export class AttemptsController {
    //
    constructor(private readonly service: AttemptsService) { }

    @Post()
    @Public()
    @UseGuards(StudentAuthGuard)
    start(@Body() dto: StartAttemptDto, @CurrentStudent() student: StudentCaller) {
        return this.service.start(
            student.code,
            dto,
        )
    }

    @Post(':attemptId/submit')
    @Public()
    @UseGuards(StudentAuthGuard)
    submit(@Param('attemptId') attemptId: string, @Body() dto: SubmitAttemptDto, @CurrentStudent() student: StudentCaller) {
        return this.service.submit(
            student.code,
            attemptId,
            dto,
        )
    }

    @Get()
    @Public()
    findAll(@Query() query: ListAttemptsQueryDto) {
        return this.service.findAll(query)
    }

    @Get(':attemptId')
    @Public()
    findById(@Param('attemptId') attemptId: string) {
        return this.service.findById(attemptId)
    }

}
