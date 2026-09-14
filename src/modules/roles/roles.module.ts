import { Module } from '@nestjs/common'

import { UsersModule } from './users/users.module'
import { TeachersModule } from './teachers/teachers.module'
import { StudentsModule } from './students/students.module'

@Module({
    imports: [
        UsersModule,
        TeachersModule,
        StudentsModule
    ],
    exports: [
        UsersModule,
        TeachersModule,
        StudentsModule
    ],
})
export class RolesModule { }