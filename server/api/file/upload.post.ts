import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "~/server/utils/minio";
import formidable from "formidable";
import fs from "fs";

export const config = {
    api: {
        bodyParser: false, // needed for formidable
    },
};

export default defineEventHandler(async (event) => {
    console.log("file upload", event);
    const form = formidable({ multiples: false });

    const { files } = await new Promise<{
        fields: formidable.Fields;
        files: formidable.Files;
    }>((resolve, reject) => {
        form.parse(event.req, (err, fields, files) => {
            if (err) reject(err);
            else resolve({ fields, files });
        });
    });

    const file = files.file as unknown as formidable.File;
    const stream = fs.createReadStream(file.filepath);

    const uploadParams = {
        Bucket: "sala-bucket",
        Key: file.originalFilename || "upload.dat",
        Body: stream,
        ContentType: file.mimetype || "application/octet-stream",
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    return {
        message: "File uploaded successfully",
        key: uploadParams.Key,
    };
});
