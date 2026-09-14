import type { User } from '../../../generated/prisma/client';

export type SafeUser = Omit<User, 'password' | 'googleId'>;

export function toSafeUser<T extends User>(user: T): Omit<T, 'password' | 'googleId'> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, googleId, ...safe } = user;
  return safe;
}
