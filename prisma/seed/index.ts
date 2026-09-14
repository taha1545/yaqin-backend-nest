import { prisma } from './client';
import { seedAdmin } from './admin.seed';
import { seedModules } from './modules.seed';
import { seedSchoolGrades } from './school-grades.seed';
import { seedTestData } from './test-data.seed';

async function main() {
  // run all seeds
  await seedAdmin(prisma);
  await seedModules(prisma);
  await seedSchoolGrades(prisma);

  //test
  await seedTestData(prisma);
}

main()
  .then(() => {
    console.info('Database seeding completed.');
  })
  .catch((error: unknown) => {
    console.error('Database seeding failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
