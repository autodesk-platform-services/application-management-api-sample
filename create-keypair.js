import fs from "node:fs/promises";
import { createKey } from "./lib/key-management.js";
import { putSecretValue } from "./lib/secrets-manager.js";

export async function main() {
  try {
    // Generate a keypair.
    const { publicKey, privateKey } = await createKey();

    // Store the JWKS containing your public key. This will be hosted on your server.
    console.log(
      "\nThe public key is below. This is also saved to jwks.json:\n"
    );
    console.log(publicKey);

    await fs.writeFile("./jwks.json", publicKey);

    // Store the private key. This will be used to generate signed clientAssertions.
    console.log("\nThe private key has been saved to your secrets manager.\n");
    await putSecretValue("JWKS_PRIVATE_KEY", privateKey);
    await putSecretValue("JWKS_KID", JSON.parse(publicKey).keys[0].kid);
    return publicKey;
  } catch (error) {
    console.error("An error occurred:", error);
  }
}
