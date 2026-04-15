export const configuration = () => ({
  port: Number(process.env.PORT ?? 3000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  corsOrigin: process.env.CORS_ORIGIN ?? '*',

  jwt: {
    // Исправлено: process.env вместо require
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessTtl: process.env.JWT_ACCESS_TTL ?? '15m',
    refreshTtl: process.env.JWT_REFRESH_TTL ?? '30d',
  },

  s3: {
    // Исправлено: process.env вместо require
    bucket: process.env.S3_BUCKET_NAME,
    region: process.env.S3_REGION_NAME,
    accessKey: process.env.S3_ACCESS_KEY,
    secretKey: process.env.S3_SECRET_ACCESS_KEY,
    url: process.env.S3_URL,
  },
});