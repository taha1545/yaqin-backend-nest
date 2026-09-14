import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { paginated } from '@/common/utils'
import { LessonStatus, type Prisma } from 'generated/prisma/client'
import type { AddSkillLessonsDto, CreateSkillDto, ListSkillsQueryDto, UpdateSkillDto } from './dto'
import { SkillsRepo } from './skills.repo'
import { buildOrderBy, buildWhere } from './skills.utils'


@Injectable()
export class SkillsService {
    //
    constructor(private readonly repo: SkillsRepo) { }


    async findAll(query: ListSkillsQueryDto) {
        const where: Prisma.SkillWhereInput = { ...buildWhere(query), status: LessonStatus.PUBLISHED };
        const [skills, total] = await Promise.all([
            this.repo.findMany({
                where,
                skip: query.skip,
                take: query.take,
                orderBy: buildOrderBy(query),
            }),
            this.repo.count({ where }),
        ])
        //
        return paginated(skills, total, query);
    }


    async findAllForMember(query: ListSkillsQueryDto) {
        const where = buildWhere(query);
        const [skills, total] = await Promise.all([
            this.repo.findMany({
                where,
                skip: query.skip,
                take: query.take,
                orderBy: buildOrderBy(query),
            }),
            this.repo.count({ where }),
        ])
        return paginated(skills, total, query)
    }


    async findById(id: string) {
        const skill = await this.repo.findByIdWithLessons(id)
        //
        if (!skill) throw new NotFoundException('Skill not found.');
        if (skill.status !== LessonStatus.PUBLISHED) throw new NotFoundException('Skill not found.');
        //
        return skill
    }


    async findByIdForMember(id: string) {
        const skill = await this.repo.findByIdWithLessons(id);
        if (!skill) throw new NotFoundException('Skill not found.');
        //
        return skill
    }


    async create(dto: CreateSkillDto) {
        return this.repo.create({
            name: dto.name,
            description: dto.description,
            target: dto.target,
            status: LessonStatus.DRAFT,
        })
    }


    async update(id: string, dto: UpdateSkillDto) {
        await this.findOrFail(id);
        return this.repo.update(
            { id },
            {
                name: dto.name,
                description: dto.description,
                target: dto.target,
                status: dto.status,
            },
        )
    }

    async remove(id: string) {
        await this.findOrFail(id)
        await this.repo.delete({ id })
        //
        return { message: 'Skill deleted successfully.' }
    }


    async addLessons(id: string, dto: AddSkillLessonsDto) {
        await this.findOrFail(id)
        const lessons = await this.repo.findLessonsByIds(dto.lessonIds)
        //
        if (lessons.length !== dto.lessonIds.length) {
            throw new BadRequestException('One or more lessons were not found.')
        }
        //
        await this.repo.addLessons(id, dto.lessonIds)
        return this.repo.findByIdWithLessons(id)
    }


    private async findOrFail(id: string) {
        const skill = await this.repo.findById(id)
        if (!skill) throw new NotFoundException('Skill not found.')
        //
        return skill
    }
}