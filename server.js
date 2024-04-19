import express from "express";
import { PORT } from "./config.js";
import { main } from "./create-keypair.js";
import { rotateSecret } from "./rotate-secret.js";

const app = express();
app.use(express.static("wwwroot"));

app.get("/jwkskey", async (req, res, next) => {
  try {
    res.json(await main());
  } catch (err) {
    next(err);
  }
});

app.get("/rotatesecret", async (req, res, next) => {
  try {
    res.json(await rotateSecret());
  } catch (err) {
    next(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
