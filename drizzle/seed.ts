import { db } from "@/lib/db";
import { adminUsers } from "@drizzle/schema";
import { hashPassword } from "@/lib/auth";
import { sql } from "drizzle-orm";

async function seed() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@retech.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  const existingAdmin = await db.select().from(adminUsers).where(sql`${adminUsers.email} = ${adminEmail}`).limit(1);

  if (existingAdmin.length > 0) {
    console.log("Admin user already exists");
    process.exit(0);
  }

  const hashedPassword = await hashPassword(adminPassword);

  await db.insert(adminUsers).values({
    email: adminEmail,
    name: "Admin User",
    password: hashedPassword,
    role: "superadmin",
  });

  console.log("Default admin created:");
  console.log(`  Email: ${adminEmail}`);
  console.log(`  Password: ${adminPassword}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
