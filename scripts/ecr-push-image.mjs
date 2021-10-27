#!/usr/bin/env zx

import chalk from "chalk";
import config from "./config.js";

const log = (msg, ...args) => {
  console.log(chalk.yellow(msg, args));
};

if (!config.ImageTag || !config.EcrRepositoryUrl) {
  throw new Error("The Image Tag and ECR URI are required.");
}

const imageName = "locust";

try {
  const tagVersion = `${new Date().toISOString().slice(0, 10)}.${
    config.ImageTag
  }`;

  log("Tag Version", tagVersion);

  await $`echo Building API Image`;
  await $`docker build -t ${imageName}:${tagVersion} -f ./Dockerfile .`;

  await $`aws ecr get-login-password \
  --region ${config.AwsRegion} \
  --profile ${config.AwsProfile} \
  | docker login \
  --username AWS \
  --password-stdin ${config.EcrRepositoryUrl}`;

  await $`docker tag ${imageName}:${tagVersion} ${config.EcrRepositoryUrl}:${tagVersion}`;

  await $`docker push  ${config.EcrRepositoryUrl}:${tagVersion}`;

  console.log(chalk.green("Image Sucessfuly pushed to ECR"));
} catch (err) {
  console.log(chalk.red("Error executing build"));
  console.log(chalk.red(err));
}
