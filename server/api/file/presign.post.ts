import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "~/server/utils/minio";

export default defineEventHandler(async (event) => {
  const { filename, type } = await readBody(event);
  console.log("presign", filename, type);
  const command = new PutObjectCommand({
    Bucket: "sala-bucket",
    Key: filename,
    ContentType: type,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });

  return { url };
});
