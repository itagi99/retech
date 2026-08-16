import { createClient } from "@libsql/client";
import { hash } from "bcryptjs";
import crypto from "crypto";
import fs from "fs";

const envContent = fs.readFileSync(".env", "utf-8");
const envVars: Record<string, string> = {};
envContent.split("\n").forEach((line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return;
  const idx = trimmed.indexOf("=");
  if (idx > 0) envVars[trimmed.slice(0, idx)] = trimmed.slice(idx + 1);
});

async function main() {
  const db = createClient({
    url: envVars.TURSO_DATABASE_URL!,
    authToken: envVars.TURSO_AUTH_TOKEN,
  });

  const passwordHash = await hash("customer123", 10);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await db.execute({
    sql: `INSERT INTO users (id, email, name, password, phone, email_verified, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [id, "customer@retech.com", "Test Customer", passwordHash, "+91 98765 43210", now, now, now],
  });

  console.log("Customer seeded: customer@retech.com / customer123");
  console.log("ID:", id);
}

main().catch(console.error);
