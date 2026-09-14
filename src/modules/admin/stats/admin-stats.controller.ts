import { Controller, Get } from '@nestjs/common'
import { Roles } from '@/common/decorators'
import { UserRole } from 'generated/prisma/enums'
import { AdminStatsService } from './admin-stats.service'

@Controller('admin/stats')
export class AdminStatsController {
    //
    constructor(private readonly service: AdminStatsService) { }

    @Get()
    @Roles(UserRole.ADMIN)
    getStats() {
        return this.service.getStats()
    }
}