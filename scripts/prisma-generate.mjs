import { execSync } from "node:child_process";
import { resolve } from "node:path";

const DEFAULT_SCHEMA = "prisma/schema.prisma";
const POSTGRES_SCHEMA = "prisma/schema.postgres.prisma";

const isVercel = process.env.VERCEL === "1";
const vercelEnv = process.env.VERCEL_ENV;
const preferPostgres =
  process.env.PRISMA_SCHEMA_PATH ? false :
  process.env.USE_POSTGRES_PRISMA_SCHEMA === "1" ||
  (isVercel && (vercelEnv === "production" || vercelEnv === "preview"));

const schemaCandidate = process.env.PRISMA_SCHEMA_PATH || (preferPostgres ? POSTGRES_SCHEMA : DEFAULT_SCHEMA);

const schemaPath = resolve(schemaCandidate);

console.log(`Using Prisma schema: ${schemaPath}`);

execSync(`npx prisma generate --schema "${schemaPath}"`, {
  stdio: "inherit",
  shell: true,
});
