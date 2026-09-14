import bcrypt from 'bcrypt';

export async function seedAdmin(prisma: any) {
  const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL;
  const ADMIN_NAME = process.env.SEED_ADMIN_NAME;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!password || !ADMIN_EMAIL || !ADMIN_NAME)  throw new Error('ERROR: All seed admin fields are required to create the initial admin.');
  const passwordHash = await bcrypt.hash(password, 12);

  //
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      name: ADMIN_NAME,
      role: 'ADMIN',
      isVerified: true,
    },
    create: {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: passwordHash,
      role: 'ADMIN',
      isVerified: true,
    },
  });
}
