import type { PrismaClient } from 'generated/prisma/client';

const schoolGrades = [
  ...[1, 2, 3, 4, 5].map((year) => ({
    code: `${year}AP`,
    name: `السنة ${year} ابتدائي`,
    level: 'PRIMARY',
    year: String(year),
  })),

  ...[1, 2, 3, 4].map((year) => ({
    code: `${year}AM`,
    name: `السنة ${year} متوسط`,
    level: 'MIDDLE',
    year: String(year),
  })),

  ...[1, 2, 3].map((year) => ({
    code: `${year}AS`,
    name: `السنة ${year} ثانوي`,
    level: 'SECONDARY',
    year: String(year),
  })),
];

export async function seedSchoolGrades(prisma: PrismaClient) {
  await prisma.$transaction(
    schoolGrades.map((grade) =>
      prisma.schoolGrade.upsert({
        where: {
          code: grade.code,
        },
        update: {
          name: grade.name,
          level: grade.level,
          year: grade.year,
        },
        create: grade,
      }),
    ),
  );
}