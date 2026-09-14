import { Injectable, NotFoundException } from '@nestjs/common'

import { StatsRepo } from './stats.repo'
import { getMonthRange } from './stats.utils'

@Injectable()
export class StatsService {
    //
    constructor(private readonly repo: StatsRepo) { }

    async getProfile(studentCode: string) {
        //
        const student = await this.repo.findStudentProfile(studentCode);
        if (!student) throw new NotFoundException('Student not found.');
        //
        const { start, end } = getMonthRange();
        const xpTransactions = await this.repo.findXpTransactions(student.code, start, end);
        //
        return {
            student: {
                code: student.code,
                fullName: student.fullName,
                dateOfBirth: student.dateOfBirth,
                schoolName: student.schoolName,
                wilaya: student.wilaya,
                semester: student.semester,
                xp: student.xp,
                imagePath: student.imagePath,
                grade: student.grade,
                createdAt: student.createdAt,
            },
            badges: student.badges,
            skills: student.skills,
            progress: student.progress,
            reports: student.reports,
            xpTransactions,
        }
    }

    async getDashboard(studentCode: string) {
        //
        const student = await this.repo.findStudentStats(studentCode)
        if (!student) throw new NotFoundException('Student not found.');
        //
        const { start, end } = getMonthRange()
        const [totalLessons, completedLessons, skillsTotal, skillsThisMonth,
            badgesTotal, badgesThisMonth, xpThisMonth]
            = await Promise.all([
                this.repo.countSemesterLessons(student.gradeCode, student.semester),
                this.repo.countCompletedSemesterLessons(
                    student.code,
                    student.gradeCode,
                    student.semester,
                ),
                this.repo.countSkills(student.code),
                this.repo.countSkills(student.code, start, end),
                this.repo.countBadges(student.code),
                this.repo.countBadges(student.code, start, end),
                this.repo.sumXp(student.code, start, end),
            ])
        //
        return {
            semester: student.semester,
            gradeCode: student.gradeCode,
            lessons: {
                total: totalLessons,
                completed: completedLessons,
                remaining: Math.max(totalLessons - completedLessons, 0),
            },
            skills: {
                total: skillsTotal,
                thisMonth: skillsThisMonth,
            },
            badges: {
                total: badgesTotal,
                thisMonth: badgesThisMonth,
            },
            xp: {
                total: student.xp,
                thisMonth: xpThisMonth._sum.amount ?? 0,
            },
        }
    }
}