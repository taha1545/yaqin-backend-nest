import { Injectable, NotFoundException } from '@nestjs/common';
import { paginated } from '@/common/utils';
import { LessonStatus, UserRole } from 'generated/prisma/client';
import type { CreateLessonDto, ListLessonsQueryDto, UpdateLessonDto } from './dto';
import { LessonsRepo } from './lessons.repo';
import { buildOrderBy, buildWhere } from './utils/lessons.utils';
import type { Caller } from './utils/helpers.lessons';

@Injectable()
export class LessonsService {
    //
    constructor(private readonly repo: LessonsRepo) { }


    async findAll(query: ListLessonsQueryDto) {
        const where = { ...buildWhere(query), status: LessonStatus.PUBLISHED };
        const [lessons, total] = await Promise.all([
            this.repo.findMany({
                where,
                skip: query.skip,
                take: query.take,
                orderBy: buildOrderBy(query),
            }),
            this.repo.count({ where }),
        ]);
        return paginated(lessons, total, query);
    }

    async findAllForMember(caller: Caller, query: ListLessonsQueryDto) {
        const where = buildWhere(query);
        const memberId = caller.role === UserRole.MEMBER ? caller.id : undefined;
        //
        const [lessons, total] = await Promise.all([
            memberId
                ? this.repo.findManyForMember(memberId, {
                    where,
                    skip: query.skip,
                    take: query.take,
                    orderBy: buildOrderBy(query),
                })
                : this.repo.findMany({
                    where,
                    skip: query.skip,
                    take: query.take,
                    orderBy: buildOrderBy(query),
                }),
            this.repo.count(memberId ? { where: { ...where, memberId } } : { where },
            ),
        ]);
        return paginated(lessons, total, query);
    }


    async findById(id: string) {
        const lesson = await this.repo.findById(id);
        if (!lesson) throw new NotFoundException('Lesson not found.');
        //
        return lesson;
    }

    async create(dto: CreateLessonDto, caller: Caller) {
        const memberId = caller.id;
        //
        return this.repo.create({
            unit: { connect: { id: dto.unitId } },
            member: { connect: { id: memberId } },
            title: dto.title,
            description: dto.description,
            content: dto.content,
            difficulty: dto.difficulty,
            xp: dto.xp,
            order: dto.order,
            minPresent: dto.minPresent,
            status: LessonStatus.DRAFT,
        });
    }

    async update(id: string, dto: UpdateLessonDto) {
        return this.repo.update(
            { id },
            {
                unit: dto.unitId ? { connect: { id: dto.unitId } } : undefined,
                title: dto.title,
                description: dto.description,
                content: dto.content,
                difficulty: dto.difficulty,
                xp: dto.xp,
                order: dto.order,
                minPresent: dto.minPresent,
                status: dto.status,
            },
        );
    }

    async remove(id: string) {
        await this.repo.delete({ id });
        return {
            message: 'Lesson deleted successfully.',
        };
    }


}