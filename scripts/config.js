import "dotenv/config";

const config = {
  AwsProfile: process.env.AWS_PROFILE,
  AwsRegion: process.env.AWS_REGION,
  AwsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  AwsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  AwsAccountId: process.env.AWS_ACCOUNT_ID,
  EcrRepositoryUrl: process.env.AWS_ECR_URI,
  ImageTag: process.env.IMAGE_TAG, //this should be replaced by a random number e.g CI pipeline commit id.
};

if (
  !config.AwsAccessKeyId ||
  !config.AwsRegion ||
  !config.AwsProfile ||
  !config.AwsSecretAccessKey ||
  !config.AwsAccountId
) {
  throw new Error(
    `Configuration missing.  AWS_REGION , AWS_REGION, AWS_SECRET_ACCESS_KEY, AWS_ACCESS_KEY_ID are required  `
  );
}

export default config;
