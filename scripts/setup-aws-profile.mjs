#!/usr/bin/env zx

import chalk from "chalk";
import config from "./config.js";

try {
  await $`aws --profile ${config.AwsProfile} configure set aws_access_key_id ${config.AwsAccessKeyId}`;
  await $`aws --profile ${config.AwsProfile} configure set aws_secret_access_key ${config.AwsSecretAccessKey}`;
  await $`aws --profile ${config.AwsProfile} configure set region ${config.AwsRegion}`;

  console.log(chalk.green(`AWS PROFILE ${config.AwsProfile} created. `));
} catch (error) {
  console.error(error);
}
