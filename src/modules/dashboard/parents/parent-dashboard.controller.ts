import { Controller, Get } from '@nestjs/common'

import { CurrentUser } from '@/common/decorators'
import { Roles } from '@/common/decorators'
import { UserRole } from 'generated/prisma/enums'
import type { AuthenticatedUser as Caller } from '@/common/interfaces'

import { ParentDashboardService } from './parent-dashboard.service'

@Controller('dashboard/parents')
export class ParentDashboardController {
    //
    constructor(private readonly service: ParentDashboardService) { }

    @Get()
    @Roles(UserRole.PARENT)
    getDashboard(@CurrentUser() user: Caller) {
        return this.service.getDashboard(user.id)
    }
}