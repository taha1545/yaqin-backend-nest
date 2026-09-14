import { fakerAR as faker } from '@faker-js/faker';
import type { PrismaClient } from 'generated/prisma/client';

export async function seedTestData(prisma: PrismaClient) {
    console.log('Seeding test data with faker...');

    //  Member

    const memberUser = await prisma.user.upsert({
        where: { email: 'author@test.com' },
        update: {},
        create: {
            name: 'Static Content Author',
            email: 'author@test.com',
            role: 'MEMBER',
            isVerified: true,
            member: { create: { target: 'General Education' } },
        },
    });
    const member = await prisma.member.findUniqueOrThrow({ where: { userId: memberUser.id } });

    // Parent

    const parentUser = await prisma.user.upsert({
        where: { email: 'ahed.mansouri@test.com' },
        update: {},
        create: {
            name: 'Ahmed Mansouri',
            email: 'ahed.mansouri@test.com',
            role: 'PARENT',
            isVerified: true,
            parent: { create: {} },
        },
    });
    const parent = await prisma.parent.findUniqueOrThrow({ where: { userId: parentUser.id } });

    //  Students

    const studentNames = ['فاتح', 'محمد', 'طه', 'اسماعيل', 'عبد الصمد'];
    const assignedGrades = ['4AP', '5AP', '1AM', '2AM', '3AM'];

    const students: Array<{ code: string; gradeCode: string }> = [];

    for (let i = 0; i < studentNames.length; i++) {
        const name = studentNames[i] ?? "";
        const gradeCode = assignedGrades[i] as string;
        const formattedName = name.split(' ').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ');
        const code = `STU-${name.replace(/\s+/g, '').toUpperCase()}`;
        //
        const student = await prisma.student.upsert({
            where: { code },
            update: { gradeCode },
            create: {
                code,
                parentId: parent.id,
                gradeCode,
                semester: 1,
                fullName: `${formattedName} Mansouri`,
                wilaya: faker.location.state(),
                xp: 0,
                imagePath: faker.image.avatar(),
                dateOfBirth: faker.date.birthdate({ min: 10, max: 18, mode: 'age' }),
                schoolName: `مدرسة ${faker.company.name()}`
            },
        });
        students.push({ code: student.code, gradeCode: student.gradeCode });
    }

    // Skills

    const skills: Array<{ id: string }> = [];
    for (let i = 1; i <= 8; i++) {
        const skillName = `Skill-${i}-${faker.word.noun()}`;
        const skill = await prisma.skill.upsert({
            where: { name_target: { name: skillName, target: 'general' } },
            update: {},
            create: {
                name: skillName,
                target: 'general',
                description: faker.lorem.sentence(),
                status: 'PUBLISHED',
            },
        });
        skills.push({ id: skill.id });
    }

    // UNITS , LESSONS , QUESTIONS

    const targetModules = ['arab', 'fr', 'en', 'math', 'physic'];

    const lessonsMap: Record<string, Array<{ id: string; xp: number }>> = {};

    for (const grade of assignedGrades) {
        lessonsMap[grade] = [];
        for (const moduleCode of targetModules) {
            const unit = await prisma.unit.upsert({
                where: { gradeCode_moduleCode_semester_order: { gradeCode: grade, moduleCode, semester: 1, order: 1 } },
                update: {},
                create: {
                    gradeCode: grade,
                    moduleCode: moduleCode,
                    semester: 1,
                    order: 1,
                    title: faker.helpers.fake(`وحدة ${moduleCode.toUpperCase()}: {{lorem.words(2)}}`),
                    description: faker.lorem.paragraph(),
                },
            });

            // Create 3 Lessons per Unit
            for (let l = 1; l <= 3; l++) {
                const randomSkill = faker.helpers.arrayElement(skills);

                const lesson = await prisma.lesson.upsert({
                    where: { unitId_order: { unitId: unit.id, order: l } },
                    update: {},
                    create: {
                        unitId: unit.id,
                        memberId: member.id,
                        title: faker.lorem.words(3),
                        description: faker.lorem.sentence(),
                        content: faker.lorem.paragraphs(2),
                        difficulty: faker.helpers.arrayElement(['EASY', 'MEDIUM', 'HARD']),
                        xp: faker.number.int({ min: 100, max: 300 }),
                        status: 'PUBLISHED',
                        order: l,
                        skills: {
                            create: [{ skillId: randomSkill.id }]
                        }
                    },
                });

                lessonsMap[grade]?.push({ id: lesson.id, xp: lesson.xp });

                // Create 2 Questions per Lesson
                for (let q = 1; q <= 2; q++) {
                    const question = await prisma.question.upsert({
                        where: { lessonId_order: { lessonId: lesson.id, order: q } },
                        update: {},
                        create: {
                            lessonId: lesson.id,
                            type: 'SINGLE_CHOICE',
                            question: faker.lorem.sentence() + '?',
                            explanation: faker.lorem.sentence(),
                            order: q,
                        },
                    });

                    // Add 3 Options to the Question (1 Correct, 2 False)
                    const optionsData = [
                        { text: faker.lorem.word(), isCorrect: true, order: 1 },
                        { text: faker.lorem.word(), isCorrect: false, order: 2 },
                        { text: faker.lorem.word(), isCorrect: false, order: 3 },
                    ];

                    for (const opt of optionsData) {
                        await prisma.questionOption.upsert({
                            where: { questionId_order: { questionId: question.id, order: opt.order } },
                            update: {},
                            create: {
                                questionId: question.id,
                                text: opt.text,
                                isCorrect: opt.isCorrect,
                                order: opt.order,
                            },
                        });
                    }
                }
            }
        }
    }

    // (Attempts, Answers, Progress, and XP)
    for (const student of students) {
        const studentLessons = lessonsMap[student.gradeCode] || [];
        if (studentLessons.length === 0) continue;

        let totalXpEarned = 0;

        for (const lesson of studentLessons) {
            // 70% chance the student attempted this lesson
            if (faker.datatype.boolean({ probability: 0.7 })) {

                // Create Quiz Attempt
                const attempt = await prisma.quizAttempt.upsert({
                    where: { studentCode_lessonId: { studentCode: student.code, lessonId: lesson.id } },
                    update: {},
                    create: {
                        studentCode: student.code,
                        lessonId: lesson.id,
                        status: 'COMPLETED',
                        completedAt: faker.date.recent(),
                    },
                });

                // Get questions for this lesson to simulate answers
                const questions = await prisma.question.findMany({
                    where: { lessonId: lesson.id },
                    include: { options: true }
                });

                for (const q of questions) {
                    // 80% chance to pick the correct answer
                    const isCorrect = faker.number.int({ min: 1, max: 100 }) <= 80;
                    const chosenOption = q.options.find(o => o.isCorrect === isCorrect) || q.options[0];

                    if (chosenOption) {
                        await prisma.quizAnswer.upsert({
                            where: { attemptId_questionId: { attemptId: attempt.id, questionId: q.id } },
                            update: {},
                            create: {
                                attemptId: attempt.id,
                                questionId: q.id,
                                optionId: chosenOption.id,
                                isCorrect: chosenOption.isCorrect,
                            },
                        });
                    }
                }

                // Add Student Progress
                await prisma.studentProgress.upsert({
                    where: { studentCode_lessonId: { studentCode: student.code, lessonId: lesson.id } },
                    update: {},
                    create: {
                        studentCode: student.code,
                        lessonId: lesson.id,
                        attemptId: attempt.id,
                        status: 'COMPLETED',
                        progress: 100,
                        completedAt: faker.date.recent(),
                    },
                });

                // Add XP Transaction
                await prisma.xpTransaction.create({
                    data: {
                        studentCode: student.code,
                        amount: lesson.xp,
                        source: 'LESSON_COMPLETED',
                        referenceId: lesson.id,
                    },
                });

                totalXpEarned += lesson.xp;
            }
        }

        if (totalXpEarned > 0) {
            await prisma.student.update({
                where: { code: student.code },
                data: { xp: { increment: totalXpEarned } },
            });
        }
    }

    console.log('Faker test data seeding complete.');
}