type NodeEnv = 'development' | 'production' | 'test';
type CookieSameSite = 'lax' | 'strict' | 'none';

export const configuration = () => ({
  app: {
    name: process.env.APP_NAME,
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
    env: (process.env.NODE_ENV ?? 'development') as NodeEnv,
    apiPrefix: process.env.API_PREFIX,
  },

  database: {
    url: process.env.DATABASE_URL,
  },

  auth: {
    jwt: {
      accessSecret: process.env.JWT_ACCESS_SECRET,
      accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '1d',
      refreshSecret: process.env.JWT_REFRESH_SECRET,
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '60d',
    },
    bcryptRounds: Number(process.env.BCRYPT_ROUNDS ?? 10),
  },

  cookie: {
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: (process.env.COOKIE_SAME_SITE ?? 'lax') as CookieSameSite,
    domain: process.env.COOKIE_DOMAIN,
  },

  cors: {
    origins: process.env.CORS_ORIGINS?.split(',').map((x) => x.trim()) ?? [],
  },

  throttle: {
    ttl: Number(process.env.THROTTLE_TTL ?? 60_000),
    limit: Number(process.env.THROTTLE_LIMIT ?? 100),
    authTtl: Number(process.env.THROTTLE_AUTH_TTL ?? 60_000),
    authLimit: Number(process.env.THROTTLE_AUTH_LIMIT ?? 5),
  },

  otp: {
    expiresInMinutes: Number(process.env.OTP_EXPIRES_IN_MINUTES ?? 10),
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL,
  },

  redis: {
    url: process.env.REDIS_URL,
  },

  mail: {
    apiKey: process.env.RESEND_API_KEY ?? '',
    from: process.env.MAIL_FROM ?? 'Yaqin <no-reply@yaqin.axedz.com>',
  },

  storage: {
    bucket: process.env.S3_BUCKET ?? '',
    region: process.env.S3_REGION ?? 'eu-north-1',
    accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? '',
    endpoint: process.env.S3_ENDPOINT,
    publicUrl: process.env.S3_PUBLIC_URL,
    signedUrlExpiresIn: Number(process.env.S3_SIGNED_URL_EXPIRES_IN ?? 3600),
  },

  logging: {
    level: process.env.LOG_LEVEL,
    dir: process.env.LOG_DIR,
  },

  ai: {
    openRouter: {
      apiKey: process.env.OPENROUTER_API_KEY ?? "",
      model: process.env.OPENROUTER_MODEL ?? "",
      baseUrl: process.env.OPENROUTER_BASE_URL ?? "",
    },
  },
});

export type AppConfig = ReturnType<typeof configuration>;
