import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import type { AppConfig } from '@/config';
import { LoggerService } from '@/core/logger';
import { STORAGE_MIME_EXTENSIONS, resolveMimeType } from './storage.constants';
import { StorageFilter } from './storage.filter';
import type { DeleteFileInput, SignedUrlOptions, UploadFileInput, UploadFileResult, } from './storage.types';

@Injectable()
export class StorageService {
  //
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly signedUrlExpiresIn: number;

  constructor(config: ConfigService<AppConfig, true>, private readonly filter: StorageFilter, private readonly logger: LoggerService,) {
    //
    const storage = config.get('storage', { infer: true });
    this.bucket = storage.bucket;
    this.signedUrlExpiresIn = storage.signedUrlExpiresIn;
    //
    this.client = new S3Client({
      region: storage.region,
      credentials: {
        accessKeyId: storage.accessKeyId,
        secretAccessKey: storage.secretAccessKey,
      },
      ...(storage.endpoint && {
        endpoint: storage.endpoint,
        forcePathStyle: true,
      }),
    });
  }

  async upload(input: UploadFileInput): Promise<UploadFileResult> {
    //
    const mimeType = resolveMimeType(input.mimeType, input.originalName);
    this.filter.validate({ ...input, mimeType }, input.validation);
    //
    const key = `${input.prefix}/${randomUUID()}${this.getExtension(mimeType)}`;
    //
    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: input.buffer,
          ContentType: mimeType,
          ContentLength: input.size,
        }),
      );
      return {
        key,
        bucket: this.bucket,
        mimeType,
        size: input.size,
      };
    } catch (error) {
      this.logError('Failed to upload file.', error);
      throw new InternalServerErrorException('Unable to upload file.');
    }
  }

  async delete(input: DeleteFileInput): Promise<void> {
    try {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: input.key,
        }),
      );
    } catch (error) {
      this.logError('Failed to delete file.', error);
      throw new InternalServerErrorException('Unable to delete file.');
    }
  }

  async getSignedUrl(key: string, options: SignedUrlOptions = {}): Promise<string> {
    try {
      return await getSignedUrl(
        this.client,
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: key,
          ...(options.downloadName && {
            ResponseContentDisposition: `attachment; filename="${options.downloadName}"`,
          }),
        }),
        {
          expiresIn: options.expiresIn ?? this.signedUrlExpiresIn,
        },
      );
    } catch (error) {
      this.logError('Failed to create signed URL.', error);
      throw new InternalServerErrorException('Unable to create file URL.');
    }
  }


  // helpers

  private getExtension(mimeType: string): string {
    return STORAGE_MIME_EXTENSIONS[mimeType as keyof typeof STORAGE_MIME_EXTENSIONS] ?? '';
  }

  private logError(message: string, error: unknown): void {
    this.logger.error(
      message,
      error instanceof Error ? error.stack : undefined,
      StorageService.name,
    );
  }
}
