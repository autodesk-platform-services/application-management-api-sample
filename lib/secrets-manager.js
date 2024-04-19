/**
 * @module secrets-manager
 * @description This module provides a mock implementation of a secrets manager using
 * a simple JSON file.
 *
 * In a real-world deployment, you would replace these functions with calls to a
 * secure service or device, such as AWS Secrets Manager, Azure Key Vault, or a
 * comparable device.
 */

import fs from "node:fs/promises";
import { resolve } from "node:path";

/**
 * Retrieves the secret value from the secrets manager.
 * @param {string} secretId
 * @returns {Promise<string>} The secret value.
 */
export async function getSecretValue(secretId) {
  const data = fs.readFile(resolve("./secrets.json"));
  const secrets = JSON.parse(await data);
  return secrets[secretId];
}

/**
 * Stores the secret value in the secrets manager.
 * @param {string} secretId
 * @param {string} secretValue
 * @returns {Promise<void>}
 */
export async function putSecretValue(secretId, secretValue) {
  const data = fs.readFile(resolve("./secrets.json"));
  const secrets = JSON.parse(await data);
  secrets[secretId] = secretValue;
  await fs.writeFile(
    resolve("./secrets.json"),
    JSON.stringify(secrets, null, 2)
  );
}
