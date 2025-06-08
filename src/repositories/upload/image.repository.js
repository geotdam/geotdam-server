import { Storage } from '@google-cloud/storage';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname 대체 코드 (ESM용)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GCP Storage 설정
const storage = new Storage({
  keyFilename: path.join(__dirname, '../../../gcp-key.json'),
});
const bucketName = 'geotdam-photo-server-bucket';
const bucket = storage.bucket(bucketName);

// 이미지 업로드 함수
const uploadToBucket = async (file) => {
  const gcsFileName = Date.now() + '-' + file.originalname;
  const blob = bucket.file(gcsFileName);

  const stream = blob.createWriteStream({
    resumable: false,
    contentType: file.mimetype,
  });

  return new Promise((resolve, reject) => {
    stream.on('error', reject);
    stream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      resolve(publicUrl);
    });
    stream.end(file.buffer);
  });
};

export default {
  uploadToBucket,
};
