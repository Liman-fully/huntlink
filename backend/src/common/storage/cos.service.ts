import { Injectable, Inject } from '@nestjs/common';
import COS from 'cos-nodejs-sdk-v5';
import { ConfigService } from '@nestjs/config';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

@Injectable()
export class CosService {
  private cos: COS;
  private bucket: string;
  private region: string;

  constructor(private configService: ConfigService) {
    this.bucket = this.configService.get<string>('COS_BUCKET') || 'huntlink-1306109984';
    this.region = this.configService.get<string>('COS_REGION') || 'ap-guangzhou';

    this.cos = new COS({
      SecretId: this.configService.get<string>('COS_SECRET_ID') || '',
      SecretKey: this.configService.get<string>('COS_SECRET_KEY') || '',
    });
  }

  /**
   * 上传简历文件到 COS
   * @param file Express.Multer.File 对象
   * @param userId 用户 ID
   * @returns 文件 URL
   */
  async uploadResume(file: Express.Multer.File, userId: string): Promise<UploadResult> {
    try {
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const key = `resumes/${userId}/${timestamp}_${randomStr}_${file.originalname}`;

      await this.cos.putObject({
        Bucket: this.bucket,
        Region: this.region,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }).promise();

      const url = `https://${this.bucket}.cos.${this.region}.myqcloud.com/${key}`;
      
      console.log(`[COS] Upload success: ${url}`);
      
      return {
        success: true,
        url,
      };
    } catch (error) {
      console.error('[COS] Upload failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * 从 COS 下载文件
   * @param url COS 文件 URL
   * @returns 文件 Buffer
   */
  async downloadFile(url: string): Promise<Buffer> {
    try {
      // 从 URL 提取 Key
      const key = url.replace(`https://${this.bucket}.cos.${this.region}.myqcloud.com/`, '');

      const result = await this.cos.getObject({
        Bucket: this.bucket,
        Region: this.region,
        Key: key,
      }).promise();

      return result.Body as Buffer;
    } catch (error) {
      console.error('[COS] Download failed:', error);
      throw error;
    }
  }

  /**
   * 删除 COS 文件
   * @param url COS 文件 URL
   */
  async deleteFile(url: string): Promise<void> {
    try {
      const key = url.replace(`https://${this.bucket}.cos.${this.region}.myqcloud.com/`, '');

      await this.cos.deleteObject({
        Bucket: this.bucket,
        Region: this.region,
        Key: key,
      }).promise();

      console.log(`[COS] Delete success: ${url}`);
    } catch (error) {
      console.error('[COS] Delete failed:', error);
      throw error;
    }
  }

  /**
   * 获取文件临时访问 URL（私有桶使用）
   * @param key 文件 Key
   * @param expires 过期时间（秒），默认 3600 秒（1 小时）
   * @returns 签名 URL
   */
  async getSignedUrl(key: string, expires: number = 3600): Promise<string> {
    try {
      const result = await this.cos.getObjectUrl({
        Bucket: this.bucket,
        Region: this.region,
        Key: key,
        Expires: expires,
      }).promise();

      return result.Url;
    } catch (error) {
      console.error('[COS] Get signed URL failed:', error);
      throw error;
    }
  }

  /**
   * 测试 COS 连接
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.cos.headBucket({
        Bucket: this.bucket,
        Region: this.region,
      }).promise();

      console.log('[COS] Connection test success');
      return true;
    } catch (error) {
      console.error('[COS] Connection test failed:', error);
      return false;
    }
  }
}
