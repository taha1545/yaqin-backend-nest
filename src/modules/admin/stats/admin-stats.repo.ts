import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/core'

@Injectable()
export class AdminStatsRepo {
    //
    constructor(private readonly prisma: PrismaService) { }

    async getStats() {
        const [publishedLessons, archivedLessons, parents, students]
            = await this.prisma.$transaction([
                this.prisma.lesson.count({
                    where: {
                        status: 'PUBLISHED',
                    },
                }),
                this.prisma.lesson.count({
                    where: {
                        status: 'ARCHIVED',
                    },
                }),
                this.prisma.parent.count(),
                this.prisma.student.count(),
            ]);
        //
        return {
            publishedLessons,
            archivedLessons,
            parents,
            students,
        }
    }
}