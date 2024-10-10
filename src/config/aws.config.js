const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  userPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
  clientId: process.env.AWS_COGNITO_CLIENT_ID,
  bucket: process.env.AWS_S3_BUCKET,
  signedUrlExpire: process.env.EXPIRE_SIGNED_URL_IN_MINUTES,
};

export default awsConfig;
