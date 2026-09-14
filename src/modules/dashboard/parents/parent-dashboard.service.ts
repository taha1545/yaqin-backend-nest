import {
    Injectable,
    NotFoundException,
} from '@nestjs/common'

import { ParentDashboardRepo } from './parent-dashboard.repo'
import { buildParentDashboard } from './parent-dahboard.utils'

@Injectable()
export class ParentDashboardService {
    //
    constructor(private readonly repo: ParentDashboardRepo) { }

    async getDashboard(userId: string) {
        //
        const parent = await this.repo.findParentByUserId(userId)
        if (!parent) throw new NotFoundException('Parent not found.')
        //
        const { start, end } = this.getCurrentMonthRange()
        const data = await this.repo.findDashboard(parent.id, start, end,)
        //
        return buildParentDashboard(
            data.students,
            data.curriculum,
            data.progress,
            data.xpTransactions,
        )
    }


    private getCurrentMonthRange() {
        const now = new Date()
        const start = new Date(now.getFullYear(), now.getMonth(), 1,)
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 1,)
        //
        return { start, end };
    }
}