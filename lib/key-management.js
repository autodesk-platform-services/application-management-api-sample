/**
 * @module key-management
 * @description This module provides a sample implementation for managing keys using the "jose" library
 * and your secrets manager.
 *
 * For even stronger security, consider replacing these functions with calls to a cloud-based
 * service such as AWS KMS or Azure Key Vault, or a hardware security module (HSM).
 */

import * as crypto from "crypto";
import * as jose from "jose";
import { getSecretValue } from "./secrets-manager.js";

/**
 * Generate a keypair.
 * For convenience, the public key is returned as a JWKS string, and the private key is returned
 * in PEM format.
 *
 * @returns {Promise<{publicKey: string, privateKey: string}>}
 */
export async function createKey() {
  const keyPair = await jose.generateKeyPair("ES256");
  const kid = crypto.randomUUID();

  const publicKey = JSON.stringify(
    {
      keys: [
        {
          kid,
          use: "sig",
          ...(await jose.exportJWK(keyPair.publicKey)),
        },
      ],
    },
    null,
    2
  );

  const privateKey = await jose.exportPKCS8(keyPair.privateKey);

  return { publicKey, privateKey };
}

/**
 * Generates a signed clientAssertion.
 * @param {object} An object containing the claims to be signed.
 * @returns {Promise<string>} The signed clientAssertion.
 */
export async function sign(claims) {
  const JWKS_PRIVATE_KEY = await getSecretValue("JWKS_PRIVATE_KEY");
  const KID = await getSecretValue("JWKS_KID");

  if (!JWKS_PRIVATE_KEY || !KID) {
    throw new Error(
      "JWKS_PRIVATE_KEY and JWKS_KID are empty, perhaps you need to generate a keypair first?"
    );
  }

  const key = await jose.importPKCS8(JWKS_PRIVATE_KEY, "EC256");
  const jwt = await new jose.SignJWT(claims)
    .setProtectedHeader({ alg: "ES256", kid: KID })
    .setIssuedAt()
    .setExpirationTime("5m")
    .setJti(crypto.randomUUID())
    .sign(key);
  return jwt;
}
