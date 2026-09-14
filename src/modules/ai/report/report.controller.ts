import { Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common'
import { Roles, Public } from '@/common'
import { UserRole } from 'generated/prisma/client'
import { ReportService } from './report.service'

@Controller('ai/report')
export class ReportController {
    //
    constructor(private readonly reportService: ReportService) { }

    @Get(':studentCode')
    @Public()
    async findAll(
        @Param('studentCode') studentCode: string,
        @Query('page', ParseIntPipe) page = 1,
        @Query('limit', ParseIntPipe) limit = 20,
    ) {
        return this.reportService.findAll(studentCode, page, limit)
    }

    @Post(':studentCode')
    @Roles(
        UserRole.ADMIN,
        UserRole.PARENT,
    )
    async generate(
        @Param('studentCode') studentCode: string,
    ) {
        return this.reportService.generate(studentCode)
    }
}