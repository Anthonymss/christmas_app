import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UploadsService {
  private s3: S3;

  constructor(private configService: ConfigService) {
    this.s3 = new S3({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY') || '',
      },
    });
  }

  async getPresignedUrl(mimeType: string) {
    const bucket = this.configService.get<string>('AWS_S3_BUCKET') || '';
    const ext = mimeType.split('/')[1];
    const key = `drawings/${uuid()}.${ext}`;

    const params = {
      Bucket: bucket,
      Key: key,
      ContentType: mimeType,
      Expires: 60, // segundos
    };

    const uploadUrl = await this.s3.getSignedUrlPromise('putObject', params);

    return {
      uploadUrl,
      fileUrl: `https://${bucket}.s3.amazonaws.com/${key}`,
    };
  }

  async uploadFile(buffer: Buffer, originalName: string, mimeType: string): Promise<string> {
    const bucket = this.configService.get<string>('AWS_S3_BUCKET') || '';
    const ext = originalName.split('.').pop();
    const key = `drawings/${uuid()}.${ext}`;

    const params = {
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    };

    const { Location } = await this.s3.upload(params).promise();
    return Location;
  }
}