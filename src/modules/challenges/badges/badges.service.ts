import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import type { AssignBadgeDto, CreateBadgeDto, ListBadgesQueryDto, UpdateBadgeDto } from './dto'
import { BadgesRepo } from './badges.repo'
import { buildOrderBy, buildWhere } from './utils/badges.utils'
import { StorageService } from '@/core'
import { paginated } from '@/common/utils';

@Injectable()
export class BadgesService {
    //
    constructor(private readonly repo: BadgesRepo, private readonly storage: StorageService) { }


    async findAll(query: ListBadgesQueryDto) {
        const where = buildWhere(query);
        const [data, total] = await Promise.all([
            this.repo.findMany({
                where,
                orderBy: buildOrderBy(),
                skip: query.skip,
                take: query.limit,
            }),
            this.repo.count({ where }),
        ])
        // 
        return paginated(data, total, query);
    }


    async findById(id: string) {
        const badge = await this.repo.findById(id);
        if (!badge) throw new NotFoundException('Badge not found.');
        //
        return badge
    }

    async create(dto: CreateBadgeDto, file?: Express.Multer.File) {
        //
        let imagePath: string | undefined
        if (file) {
            const result = await this.storage.upload({
                buffer: file.buffer,
                mimeType: file.mimetype,
                size: file.size,
                originalName: file.originalname,
                prefix: 'badges',
            })
            imagePath = result.key;
        }
        return await this.repo.create({
            name: dto.name,
            description: dto.description,
            xpReward: dto.xpReward ?? 0,
            imagePath,
        })
    }


    async update(id: string, dto: UpdateBadgeDto) {
        //
        const badge = await this.repo.findById(id)
        if (!badge) throw new NotFoundException('Badge not found.');
        //
        return this.repo.update(id,
            {
                ...(dto.name !== undefined && {
                    name: dto.name,
                }),
                ...(dto.description !== undefined && {
                    description: dto.description,
                }),
                ...(dto.xpReward !== undefined && {
                    xpReward: dto.xpReward,
                }),
            },
        );
    }



    async remove(id: string) {
        const badge = await this.repo.findById(id)
        if (!badge) throw new NotFoundException('Badge not found.');
        //
        await this.repo.delete(id)
        if (badge.imagePath) await this.storage.delete({
            key: badge.imagePath
        })
        //
        return { message: 'Badge deleted successfully.' }
    }



    async assignToStudents(badgeId: string, dto: AssignBadgeDto) {
        const badge = await this.repo.findById(badgeId)
        if (!badge) throw new NotFoundException('Badge not found.');
        // Remove duplicate student codes
        const studentCodes = [...new Set(dto.studentCodes)]
        if (!studentCodes.length) throw new BadRequestException('At least one student is required.');
        // Make sure all students exist
        const students = await this.repo.findStudents(studentCodes)
        if (students.length !== studentCodes.length) {
            const existingCodes = new Set(students.map(student => student.code))
            const missingCodes = studentCodes.filter(
                code => !existingCodes.has(code),
            )
            throw new NotFoundException(`Students not found: ${missingCodes.join(', ')}`)
        }
        // assignment
        return this.repo.assignToStudents(badgeId, studentCodes, badge.xpReward)
    }
}