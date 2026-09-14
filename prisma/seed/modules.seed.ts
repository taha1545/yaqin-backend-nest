import type { PrismaClient } from 'generated/prisma/client';

export const modules = [
  { code: 'arab', name: 'اللغة العربية' },
  { code: 'fr', name: 'اللغة الفرنسية' },
  { code: 'en', name: 'اللغة الإنجليزية' },
  { code: 'math', name: 'الرياضيات' },
  { code: 'islam', name: 'التربية الإسلامية' },
  { code: 'civic', name: 'التربية المدنية' },
  { code: 'history', name: 'التاريخ والجغرافيا' },
  { code: 'science', name: 'علوم الطبيعة والحياة' },
  { code: 'physic', name: 'الفيزياء' },
  { code: 'computer', name: 'الإعلام الآلي' },
  { code: 'art', name: 'التربية الفنية' },
];

export async function seedModules(prisma: PrismaClient) {
  await prisma.$transaction(
    modules.map(({ code, name }) =>
      prisma.module.upsert({
        where: { code },
        update: {
          name,
        },
        create: {
          code,
          name,
        },
      }),
    ),
  );
}