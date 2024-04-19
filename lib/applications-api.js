import axios from "axios";
import qs from "qs";
import { getSecretValue } from "./secrets-manager.js";
import { sign } from "./key-management.js";

const CLIENT_ID = await getSecretValue("CLIENT_ID");

/**
 * Prepare a new client secret.
 * @see https://aps.autodesk.com/en/docs/applications/v1/reference/specification/application-api-preparesecret-POST/
 * @returns {Promise<string>} The new secret.
 */
export async function prepareSecret() {
  const accessToken = await getAccessToken();
  var url = `https://developer-stg.api.autodesk.com/applications/v1/clients/${CLIENT_ID}/secret:prepare`;
  var clientAssertion = await sign({
    iss: CLIENT_ID,
    sub: CLIENT_ID,
    aud: url,
  });

  var response = await axios.post(
    url,
    {
      clientAssertion: clientAssertion,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data.newSecret;
}

/**
 * Commit the new client secret. The new secret will become active, and the old secret will stop working immediately.
 * @see https://aps.autodesk.com/en/docs/applications/v1/reference/quick_reference/application-api-commitsecret-POST/
 * @param {string} newSecret
 * @returns {Promise<void>}
 */
export async function commitSecret(newSecret) {
  const accessToken = await getAccessToken();
  const url = `https://developer-stg.api.autodesk.com/applications/v1/clients/${CLIENT_ID}/secret:commit`;
  const clientAssertion = await sign({
    iss: CLIENT_ID,
    sub: CLIENT_ID,
    aud: url,
  });

  await axios.post(
    url,
    {
      clientAssertion: clientAssertion,
      newSecret: newSecret,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

/**
 * Cancel the new client secret. The prepared secret will be discarded.
 * @see https://aps.autodesk.com/en/docs/applications/v1/reference/quick_reference/application-api-cancelsecretrotation-POST/
 * @returns {Promise<void>}
 */
export async function cancelSecret() {
  const accessToken = await getAccessToken();
  const url = `https://developer-stg.api.autodesk.com/applications/v1/clients/${CLIENT_ID}/secret:cancel`;
  const clientAssertion = await sign({
    iss: CLIENT_ID,
    sub: CLIENT_ID,
    aud: url,
  });

  await axios.post(
    url,
    {
      clientAssertion: clientAssertion,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

/**
 * Gets an access token from the Autodesk authentication service.
 * @see https://aps.autodesk.com/en/docs/oauth/v2/reference/http/gettoken-POST/
 * @returns {Promise<string>} The access token.
 */
async function getAccessToken() {
  const CLIENT_SECRET = await getSecretValue("CLIENT_SECRET");

  const response = await axios({
    method: "POST",
    url: "https://developer-stg.api.autodesk.com/authentication/v2/token",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    auth: {
      username: CLIENT_ID,
      password: CLIENT_SECRET,
    },
    data: qs.stringify({
      grant_type: "client_credentials",
      scope: "application:client:rotate_secret",
    }),
  });
  return response.data.access_token;
}
