import { BadRequestException, Injectable, NotFoundException, } from '@nestjs/common'
import { PrismaService } from '@/core'
import { StorageService, } from '@/core/storage'
import { getResourceMimeType, getResourceUploadInput } from './utils/resources.lessons'

@Injectable()
export class LessonResourcesService {
    //
    constructor(
        private readonly prisma: PrismaService,
        private readonly storage: StorageService,
    ) { }

    async findAll(lessonId: string) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId },
            select: { id: true },
        })
        if (!lesson) throw new NotFoundException('Lesson not found.');
        //
        const resources = await this.prisma.lessonResource.findMany({
            where: { lessonId },
            orderBy: { createdAt: 'asc' },
        })
        return resources;
    }

    async create(lessonId: string, files: Express.Multer.File[]) {
        //
        if (!files?.length) throw new BadRequestException('No files provided.');
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId },
            select: { id: true },
        });
        if (!lesson) throw new NotFoundException('Lesson not found.');
        //
        const uploads = await Promise.all(
            files.map(async file => {
                const mimeType = getResourceMimeType(file)
                return this.storage.upload(
                    getResourceUploadInput(file, mimeType),
                )
            }),
        )
        await this.prisma.lessonResource.createMany({
            data: uploads.map(result => ({
                lessonId,
                key: result.key,
            })),
        })
        return { message: 'Resources uploaded successfully.', count: uploads.length }
    }


    async remove(id: string) {
        const resource = await this.prisma.lessonResource.findUnique({ where: { id } });
        if (!resource) throw new NotFoundException('Resource not found.');
        //
        this.storage.delete({ key: resource.key }).catch(() => { })
        await this.prisma.lessonResource.delete({
            where: {
                id,
            },
        })
        //
        return {
            message: 'Resource deleted successfully.',
        }
    }
}