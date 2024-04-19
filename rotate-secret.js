import { prepareSecret, commitSecret } from "./lib/applications-api.js";
import { getSecretValue, putSecretValue } from "./lib/secrets-manager.js";

export async function rotateSecret() {
  try {
    // Prepare the new secret. The API will provide a new value, but it's not yet active.
    const newSecret = await prepareSecret();
    await putSecretValue("TEMP_CLIENT_SECRET", newSecret);

    /**
     * *************************************************************************************
     * Prior to the next step (commit), this script needs to wait for the application to
     * become aware of the new secret.
     * This could be done by sending a webhook, or a simple time delay if the application
     * is regularly polling the secrets manager.
     * *************************************************************************************
     */

    // Commit the new secret, and store it in your secrets manager.
    // The old secret will stop working immediately.
    await commitSecret(await getSecretValue("TEMP_CLIENT_SECRET"));
    await putSecretValue("CLIENT_SECRET", newSecret);
    await putSecretValue("TEMP_CLIENT_SECRET", "");
    console.log("Secret rotation was successful.");
    return "Secret rotation was successful.";
  } catch (error) {
    console.error(error);
    return "Secret rotation was not successful.";
  }
}
