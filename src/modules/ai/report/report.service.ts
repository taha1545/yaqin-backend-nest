import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { ReportRepo } from './report.repo'
import { buildPrompt, buildReportContext, getLatestActivityDate, isLessThanOneWeekOld } from './utils/report.utils'
import { REPORT_PROMPT } from './utils/report.prompt'
import type { StudentReport } from './utils/report.types'
import { OpenRouterService } from '../openrouter/openrouter.service'

@Injectable()
export class ReportService {
    //
    constructor(
        private readonly repo: ReportRepo,
        private readonly openRouter: OpenRouterService,
    ) { }

    async findAll(studentCode: string, page: number, limit: number) {
        //
        const student = await this.repo.findStudent(studentCode);
        if (!student) throw new NotFoundException('Student not found.');
        //
        const skip = (page - 1) * limit
        const result = await this.repo.findReports(studentCode, skip, limit)
        //
        return {
            items: result.items,
            meta: {
                page,
                limit,
                total: result.total,
                totalPages: Math.ceil(
                    result.total / limit,
                ),
            },
        }
    }

    async generate(studentCode: string) {
        //
        const student = await this.repo.findStudent(studentCode);
        if (!student) throw new NotFoundException('Student not found.');
        //
        const latestReport = await this.repo.findLatestReport(studentCode)
        if (latestReport && isLessThanOneWeekOld(latestReport.createdAt)) {
            return {
                report: latestReport.report,
                createdAt: latestReport.createdAt,
                coveredUntil: latestReport.coveredUntil,
                cached: true,
            }
        }
        //
        const activity = await this.repo.findActivity(studentCode, latestReport?.coveredUntil ?? null, 20)
        if (!activity.length) {
            if (latestReport) {
                return {
                    report: latestReport.report,
                    createdAt: latestReport.createdAt,
                    coveredUntil: latestReport.coveredUntil,
                    cached: true,
                }
            }
            throw new BadRequestException('Not enough student activity to generate a report.')
        }
        //
        const context = buildReportContext(student, latestReport?.report ?? null, activity)
        const prompt = buildPrompt(REPORT_PROMPT, context)
        //
        const report = await this.openRouter.generateJson<StudentReport>(prompt)
        //
        const coveredUntil = getLatestActivityDate(activity)
        const saved = await this.repo.createReport(studentCode, report, coveredUntil,)
        //
        return {
            report: saved.report,
            createdAt: saved.createdAt,
            coveredUntil: saved.coveredUntil,
            cached: false,
        }
    }
}