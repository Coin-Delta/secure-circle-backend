import {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Upload } from "@aws-sdk/lib-storage";
import fs from "fs";
import path from "path";
import { BUCKET_URL } from "../constants/common.js";
import { sanitizeFilename } from "./helpers.js";
import awsConfig from "../config/aws.config.js";

const s3Client = new S3Client({
  region: awsConfig.region,
  credentials: {
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey,
  },
});

export const uploadToS3 = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }

    const fileStream = fs.createReadStream(localFilePath);
    const fileName = sanitizeFilename(path.basename(localFilePath));

    const uploadParams = {
      Bucket: awsConfig.bucket,
      Key: `${Date.now()}_${fileName}`,
      Body: fileStream,
    };

    const parallelUploads3 = new Upload({
      client: s3Client,
      params: uploadParams,
    });

    const response = await parallelUploads3.done();

    fs.unlinkSync(localFilePath); // Remove the locally saved temporary file
    return response.Key;
  } catch (error) {
    fs.unlinkSync(localFilePath); // Remove the locally saved temporary file if upload fails
    throw new Error(`Error uploading file to S3: ${error.message}`);
  }
};

export const getSignedUrlFromS3 = async (Key) => {
  let url = BUCKET_URL + Key;
  const objectKey = new URL(url).pathname.substring(1);

  const command = new GetObjectCommand({
    Bucket: awsConfig.bucket,
    Key: objectKey,
  });

  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 60 * awsConfig.signedUrlExpire, // Time in seconds until the signed URL expires
  });

  return signedUrl;
};

export const getKeyFromSignedUrl = async (signedUrl) => {
  const urlParts = new URL(signedUrl).pathname.split("/");
  const Key = urlParts[urlParts.length - 1];
  return Key;
};

export const deleteFromS3 = async (Key) => {
  const deleteObjectCommand = new DeleteObjectCommand({
    Bucket: awsConfig.bucket,
    Key,
  });
  await s3Client.send(deleteObjectCommand);

  return Key;
};
