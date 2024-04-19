# Sample application for rotating secrets with Autodesk APS

Using the [Application API](https://aps.autodesk.com/en/docs/applications/v1/developers_guide/overview/), you can rotate your APS applications' secrets automatically.

Typically, code you adapt from this sample would be deployed to an environment that can run jobs on a regular schedule, such as AWS Lambda, Azure Functions, or a server with cron.

## Installation

```sh
npm install
```

## Configuration

1. Click on create keypair.js button to create a new key pair.
1. The previous step will create a `jwks.json` file. Upload this file to your server (for testing purposes, a simple way to host a text file is on [gist.github.com](https://gist.github.com)). How you choose to host your public keyset is up to you, but the keyset must be publicly accessible on the internet and your server must respond with raw JSON.
1. Visit the app settings page in the [Developer Portal](https://aps.autodesk.com) and enter the URL of your public keyset in the "JWKS URI" field.
1. Add your application's `client_id` and `client_secret` to the secret manager (if you have not yet customized the mock secrets manager, you will do this by editing `secrets.json`).

## Run the rotation script

```sh
Click on rotate secret button
```

This will rotate the secret and store the new value.

## Customization

This code is intended as a simplified example; it will need modification to integrate smoothly with your deployments and avoid downtime.

### Secrets manager

In a production environment, it's **_strongly_** recommended that you do not use the mock secrets manager provided in this sample.

You can customize the file `lib/secrets-manager.js` to make calls to a real secrets manager, such as AWS Secrets Manager, Azure Key Vault, or comparable device.

### Zero-downtime rotation

In order to avoid downtime during rotation, your application will need several additional features:

1. Logic to handle _two_ client_secret values during the switchover. When requesting access_tokens, the app should try one value, and if that fails, try the second.
1. Prior to committing the rotation, the rotation script needs to wait for the application to become aware of the new secret. This could be done by sending a webhook, or a simple time delay if the application is regularly polling the secrets manager.

### Key Management

The sample includes code to generate keypairs and signatures using the node.js `jose` library. This is sufficient for many uses, however The file `lib/key-management.js` can be customized to use an external key management service if desired. Products such as AWS KMS, Azure Key Vault, or a hardware security module (HSM) have the additional advantage that private keys cannot be exported.
