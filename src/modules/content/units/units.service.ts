import { Injectable, NotFoundException } from '@nestjs/common'
import { paginated } from '@/common/utils'
import type { CreateUnitDto, ListUnitsQueryDto, UpdateUnitDto } from './dto'
import { UnitsRepo } from './units.repo'
import { buildOrderBy, buildWhere } from './units.utils'

@Injectable()
export class UnitsService {
    //
    constructor(private readonly repo: UnitsRepo) { }


    async findAll(query: ListUnitsQueryDto) {
        const where = buildWhere(query);
        const [units, total] = await Promise.all([
            this.repo.findMany({
                where,
                skip: query.skip,
                take: query.take,
                orderBy: buildOrderBy(query),
            }),
            this.repo.count({ where }),
        ])
        return paginated(units, total, query);
    }

    async findById(id: string) {
        const unit = await this.repo.findByIdWithLessons(id);
        if (!unit) throw new NotFoundException('Unit not found.');
        //
        return unit;
    }


    async create(dto: CreateUnitDto) {
        return this.repo.create({
            grade: { connect: { code: dto.gradeCode } },
            module: { connect: { code: dto.moduleCode } },
            semester: dto.semester,
            title: dto.title,
            description: dto.description,
            order: dto.order,
        })
    }

    async update(id: string, dto: UpdateUnitDto) {
        await this.findOrFail(id);
        return this.repo.update(
            { id },
            {
                grade: dto.gradeCode ? { connect: { code: dto.gradeCode } } : undefined,
                module: dto.moduleCode ? { connect: { code: dto.moduleCode } } : undefined,
                semester: dto.semester,
                title: dto.title,
                description: dto.description,
                order: dto.order,
            },
        )
    }

    async remove(id: string) {
        await this.findOrFail(id)
        await this.repo.delete({ id })
        return { message: 'Unit deleted successfully.' }
    }


    private async findOrFail(id: string) {
        const unit = await this.repo.findById(id);
        if (!unit) throw new NotFoundException('Unit not found.');
        //
        return unit
    }
}