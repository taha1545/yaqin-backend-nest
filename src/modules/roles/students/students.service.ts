import { BadRequestException, ForbiddenException, Injectable, NotFoundException, } from '@nestjs/common';
import { paginated } from '@/common/utils';
import { PrismaService } from '@/core';
import { StorageService, resolveMimeType } from '@/core/storage';
import type { CreateStudentDto, ListStudentsQueryDto, LoginByCodeDto, UpdateStudentDto, } from './dto';
import { StudentsRepo } from './students.repo';
import { buildOrderBy, buildRankingWhere, buildWhere } from './utils/helpers.students';
import { generateStudentCode } from './utils/codeGenerate'
import { STUDENT_IMAGE_VALIDATION } from './utils/storage.students';
import type { Caller, StudentCaller, } from './utils/helpers.students';


@Injectable()
export class StudentsService {
  //
  constructor(private readonly prisma: PrismaService, private readonly repo: StudentsRepo,
    private readonly storage: StorageService) { }

  async findAll(query: ListStudentsQueryDto) {
    const where = buildWhere(query);
    const [students, total] = await Promise.all([
      this.repo.findMany({
        where,
        skip: query.skip,
        take: query.take,
        orderBy: buildOrderBy(query),
      }),
      this.repo.count({ where }),
    ]);
    return paginated(students, total, query);
  }

  async rankings(query: ListStudentsQueryDto) {
    const where = buildRankingWhere(query);
    const [students, total] = await Promise.all([
      this.repo.findMany({
        where,
        skip: query.skip,
        take: query.take,
        orderBy: { xp: 'desc' },
      }),
      this.repo.count({ where }),
    ]);
    return paginated(students, total, query);
  }

  async login(dto: LoginByCodeDto) {
    const student = await this.repo.findByCode(dto.code);
    if (!student) throw new NotFoundException('Invalid student code.');
    //
    if (dto.deviceName) await this.repo.update({ code: student.code }, { deviceName: dto.deviceName });
    //
    return { student };
  }

  async findMe(student: StudentCaller) {
    const result = await this.repo.findByCode(student.code);
    //
    if (!result) throw new NotFoundException('Student not found.');
    //
    return result;
  }

  async updateMe(dto: UpdateStudentDto, student: StudentCaller) {
    return this.repo.update(
      { code: student.code },
      {
        grade: dto.gradeCode ? { connect: { code: dto.gradeCode } } : undefined,
        semester: dto.semester,
        fullName: dto.fullName,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        schoolName: dto.schoolName,
        wilaya: dto.wilaya,
        deviceName: dto.deviceName,
      },
    );
  }

  async create(dto: CreateStudentDto, caller?: Caller) {
    //
    let parentId: string | null = null;
    if (caller?.role === 'PARENT') {
      const parent = await this.prisma.parent.findUnique({ where: { userId: caller.id } });
      if (!parent) throw new NotFoundException('Parent profile not found.');
      parentId = parent.id;
    }
    //
    return this.repo.create({
      code: generateStudentCode(dto.fullName, dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined),
      parent: parentId ? { connect: { id: parentId } } : undefined,
      grade: { connect: { code: dto.gradeCode }, },
      semester: dto.semester,
      fullName: dto.fullName,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      schoolName: dto.schoolName,
      wilaya: dto.wilaya,
    });
  }

  async remove(code: string, caller: Caller) {
    const student = await this.repo.findByCode(code);
    if (!student) throw new NotFoundException('Student not found.');
    //
    const parent = await this.prisma.parent.findUnique({ where: { userId: caller.id }, select: { id: true }, });
    if (!parent || student.parentId !== parent.id) throw new ForbiddenException('You do not have permission to delete this student.',);
    //
    if (student.imagePath) await this.storage.delete({ key: student.imagePath }).catch(() => undefined);
    //
    await this.repo.delete({ code: student.code });
    //
    return { message: 'Student deleted successfully.' };
  }

  async addImage(file: Express.Multer.File, student: StudentCaller) {
    if (!file) throw new BadRequestException('No file provided.');
    //
    const mimeType = resolveMimeType(file.mimetype, file.originalname);
    const uploaded = await this.storage.upload({
      buffer: file.buffer,
      mimeType,
      size: file.size,
      originalName: file.originalname,
      prefix: 'students',
      validation: STUDENT_IMAGE_VALIDATION,
    });
    //
    return this.repo.update({ code: student.code }, { imagePath: uploaded.key });
  }

  async removeImage(student: StudentCaller) {
    const current = await this.repo.findByCode(student.code);
    if (!current) throw new NotFoundException('Student not found.');
    //
    if (current.imagePath) await this.storage.delete({ key: current.imagePath }).catch(() => undefined);
    //
    return this.repo.update(
      { code: student.code },
      { imagePath: null },
    );
  }
}