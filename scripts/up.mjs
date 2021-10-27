#!/usr/bin/env zx

try {
  await $`docker compose up`;
} catch (error) {
  console.error(error);
}
