import { Module } from '@nestjs/common'

import { UsersModule } from './users/users.module'
import { TeachersModule } from './teachers/teachers.module'
import { StudentsModule } from './students/students.module'
import { MemberModule } from './members/member.module'

@Module({
    imports: [
        UsersModule,
        TeachersModule,
        StudentsModule,
        MemberModule
    ],
    exports: [
        UsersModule,
        TeachersModule,
        StudentsModule,
        MemberModule
    ],
})
export class RolesModule { }