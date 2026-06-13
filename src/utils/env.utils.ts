import { Env } from "@/types/environment";

// Check that the required .env variables are set before running the application
export default function validateEnv(env: Env) {
  if (env !== "development" && env !== "production") {
    console.error("Environmenet should be development or production!");
    console.warn("Did you forget to set process.env.NODE_ENV?");
    process.exit(1);
  }

  const requiredEnvVars: string[] = ["PORT", "BASE_URL", "DB_URL"];
  const missingEnv: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missingEnv.push(envVar);
    }
  }

  if (missingEnv.length > 0) {
    console.error(`-- Missing the following environment variables --`);
    console.error(missingEnv.join(", "));
    process.exit(1);
  }
}
