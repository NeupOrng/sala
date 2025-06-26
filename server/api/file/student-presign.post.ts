import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "~/server/utils/minio";

export default defineEventHandler(async (event) => {
  const { studentId } = await readBody(event);
  const key = `students/${studentId}/photo.jpg`;
  const command = new PutObjectCommand({
    Bucket: "my-bucket",
    Key: key,
    ContentType: 'image/jpeg',
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

  return { url: signedUrl };
});
