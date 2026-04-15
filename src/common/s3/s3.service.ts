import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
    private readonly bucket = process.env.S3_BUCKET_NAME;
    private readonly endpoint = process.env.S3_URL;

    private readonly client = new S3Client({
        region: process.env.S3_REGION_NAME,
        endpoint: process.env.S3_URL,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY!,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
        },
        forcePathStyle: true, // нужно для S3-совместимых хранилищ
    });

    async uploadFile(fileBytes: Buffer, filename: string): Promise<string> {
        await this.client.send(
            new PutObjectCommand({
                Bucket: this.bucket,
                Key: filename,
                Body: fileBytes,
                ACL: 'public-read',
            }),
        );

        return `${this.endpoint}/${this.bucket}/${filename}`;
    }

    async deleteFileByKey(key: string): Promise<void> {
        await this.client.send(
            new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: key,
            }),
        );
    }

    async deleteFileByUrl(url: string): Promise<void> {
        const parsed = new URL(url);
        const key = parsed.pathname.replace(`/${this.bucket}/`, '');

        await this.deleteFileByKey(key);
    }

    generateFilename(originalName: string): string {
        return `${Date.now()}_${originalName}`;
    }
}