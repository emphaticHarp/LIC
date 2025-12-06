import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'lic-documents';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

export async function uploadFile(
  file: Buffer,
  fileName: string,
  fileType: string,
  folder: string = 'documents'
): Promise<UploadResult> {
  try {
    // Validate file
    if (file.length > MAX_FILE_SIZE) {
      return { success: false, error: 'File size exceeds 10MB limit' };
    }

    if (!ALLOWED_TYPES.includes(fileType)) {
      return { success: false, error: 'File type not allowed' };
    }

    // Generate unique key
    const fileExtension = fileName.split('.').pop();
    const key = `${folder}/${uuidv4()}.${fileExtension}`;

    // Upload to S3
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: fileType,
      ACL: 'private' as const,
    };

    const result = await s3.upload(params).promise();

    return {
      success: true,
      url: result.Location,
      key: result.Key,
    };
  } catch (error: any) {
    console.error('File upload error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteFile(key: string): Promise<boolean> {
  try {
    await s3
      .deleteObject({
        Bucket: BUCKET_NAME,
        Key: key,
      })
      .promise();
    return true;
  } catch (error) {
    console.error('File delete error:', error);
    return false;
  }
}

export async function getSignedUrl(key: string, expiresIn: number = 3600): Promise<string | null> {
  try {
    const url = s3.getSignedUrl('getObject', {
      Bucket: BUCKET_NAME,
      Key: key,
      Expires: expiresIn,
    });
    return url;
  } catch (error) {
    console.error('Signed URL error:', error);
    return null;
  }
}

export async function listFiles(folder: string): Promise<string[]> {
  try {
    const result = await s3
      .listObjectsV2({
        Bucket: BUCKET_NAME,
        Prefix: folder,
      })
      .promise();

    return (result.Contents || []).map(item => item.Key || '');
  } catch (error) {
    console.error('List files error:', error);
    return [];
  }
}
