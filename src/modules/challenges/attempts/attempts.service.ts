import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { LessonStatus, QuizAttemptStatus } from 'generated/prisma/client'
import type { StartAttemptDto, SubmitAttemptDto } from './dto'
import { AttemptsRepo } from './attempts.repo'
import { gradeAttempt } from './utils/grade-attempt.utils'
import { ListAttemptsQueryDto } from './dto'

@Injectable()
export class AttemptsService {
    //
    constructor(private readonly repo: AttemptsRepo) { }

    async start(studentCode: string, dto: StartAttemptDto) {
        // lessons check 
        const lesson = await this.repo.findLesson(dto.lessonId);
        if (!lesson) throw new NotFoundException('Lesson not found.');
        if (lesson.status !== LessonStatus.PUBLISHED) throw new BadRequestException('This lesson is not available.');
        if (!lesson.questions.length) throw new BadRequestException('This lesson has no questions.');
        //
        const existing = await this.repo.findByStudentAndLesson(studentCode, dto.lessonId);
        if (existing) throw new BadRequestException('You have already attempted this lesson.');
        // Create attempt
        return this.repo.create({
            student: { connect: { code: studentCode } },
            lesson: { connect: { id: dto.lessonId } },
        });
    }

    async submit(studentCode: string, attemptId: string, dto: SubmitAttemptDto) {
        //get attempt
        const attempt = await this.repo.findById(attemptId);
        if (!attempt) throw new NotFoundException('Attempt not found.');
        if (attempt.status !== QuizAttemptStatus.IN_PROGRESS) {
            throw new BadRequestException('This attempt has already been completed.')
        }
        //  lesson and theire details
        const lesson = await this.repo.findLessonForGrading(attempt.lessonId)
        if (!lesson) throw new NotFoundException('Lesson not found.',);
        if (!lesson.questions.length) throw new BadRequestException('This lesson has no questions.');
        //  calculate 
        const result = gradeAttempt({
            questions: lesson.questions,
            submittedAnswers: dto.answers,
            minPresent: lesson.minPresent ?? 85,
            lessonXp: lesson.xp,
        })
        const answers = result.answers.map(answer => ({
            attemptId,
            questionId: answer.questionId,
            optionId: answer.optionId,
            answer: answer.answer,
            isCorrect: answer.isCorrect,
        }))
        // save in db
        return this.repo.submit({
            attemptId,
            studentCode,
            answers,
            progress: {
                lessonId: attempt.lessonId,
                status: result.status,
                progress: result.progress,
                completedAt: new Date(),
            },
            xpEarned: result.xpEarned,
        })
    }

    async findAll(query: ListAttemptsQueryDto) {
        return this.repo.findMany({
            where: {
                studentCode: query.studentCode,
                ...(query.lessonId
                    ? {
                        lessonId: query.lessonId,
                    }
                    : {}),
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
    }

    async findById(attemptId: string) {
        const attempt = await this.repo.findById(attemptId)
        if (!attempt) throw new NotFoundException('Attempt not found.')
        //
        return attempt
    }

}