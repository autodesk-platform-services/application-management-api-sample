import dotenv from "dotenv";
dotenv.config();

let { PORT } = process.env;

PORT = PORT || 8080;

export { PORT };
