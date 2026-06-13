import validateEnv from "utils/env.utils";
import { Env } from "./types/environment";
import createDatabaseFromSchema from "./lib/db/schema";
import seedDatabase from "./lib/db/seed";

export default function startup(env: Env) {
  // Check environement variable
  validateEnv(env);
  // Create database
  createDatabaseFromSchema(env);
  // Seed database
  if (process.env.SEED_ON_STARTUP === "true") seedDatabase(env);
}
