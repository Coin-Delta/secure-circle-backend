import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import logger from "../src/logger/winston.logger.js";

async function checkEnvVariables() {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const exampleEnvPath = path.join(__dirname, "../.env.example");
    const envFilePath = path.join(__dirname, "../.env");

    const exampleEnv = dotenv.parse(await fs.promises.readFile(exampleEnvPath));
    const envFile = dotenv.parse(await fs.promises.readFile(envFilePath));

    // Check for extra variables in .env.example
    const extraVars = Object.keys(exampleEnv).filter((key) => !envFile[key]);

    if (extraVars.length > 0) {
      logger.error(
        `Extra variables in .env.example (not present in .env): ${extraVars.join(", ")}`
      );
      process.exit(1);
    }

    // Check for missing variables in .env
    const missingVars = Object.keys(envFile).filter((key) => !exampleEnv[key]);

    if (missingVars.length > 0) {
      console.error(
        `Missing environment variables in .env.example : ${missingVars.join(", ")}`
      );
      process.exit(1);
    }
  } catch (err) {
    logger.error("Error reading environment files:", err.message);
    process.exit(1);
  }
}

checkEnvVariables();
