const generateFileButton = document.getElementById("generateFile");
const rotatesecretButton = document.getElementById("rotateSecretId");

// Add event listener for button click
generateFileButton.addEventListener("click", async () => {
  try {
    const keyPair = await fetch("/jwkskey").then((resp) => resp.json());
    document.getElementById("jwks_key").value = keyPair;
    console.log(keyPair);
  } catch (error) {
    console.error("An error occurred:", error);
  }
});

rotatesecretButton.addEventListener("click", async () => {
  try {
    const result = await fetch("/rotatesecret").then((resp) => resp.json());
    document.getElementById("rotate_secret").value = result;
    console.log(result);
  } catch (error) {
    console.error("An error occurred:", error);
  }
});
