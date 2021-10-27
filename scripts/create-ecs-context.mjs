#!/usr/bin/env zx

import config from "./config.js";

try {
  await $`docker context create ecs locust --profile ${config.AwsProfile}`;
} catch (error) {
  console.error(error);
}
