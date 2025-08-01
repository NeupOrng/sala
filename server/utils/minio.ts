import { S3Client } from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
  region: 'us-east-1',
  endpoint: process.env.MINIO_ENDPOINT ?? 'http://localhost:9000', 
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY_ID ?? 'minioadmin',
    secretAccessKey: process.env.MINIO_SECRET_ACCESS_KEY ?? 'minioadmin',
  },
  forcePathStyle: true,
});