import { Injectable } from '@nestjs/common'

import { AdminStatsRepo } from './admin-stats.repo'

@Injectable()
export class AdminStatsService {
    //
    constructor(private readonly repo: AdminStatsRepo) { }

    getStats() {
        return this.repo.getStats()
    }

}