import { Module } from '@nestjs/common'

import { UnitsModule } from './units/units.module'
import { SkillsModule } from './skills/skills.module'
import { LessonsModule } from './lessons/lessons.module'
import { CommentsModule } from './lessons-comment/comments.module'
import { LessonResourcesModule } from './lessons-resource/lesson-resources.module'
import { QuestionsModule } from './questions/questions.module'

@Module({
    imports: [
        UnitsModule,
        SkillsModule,
        LessonsModule,
        CommentsModule,
        LessonResourcesModule,
        QuestionsModule,
    ],
})
export class ContentModule { }