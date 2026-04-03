import bcrypt from "bcryptjs";
import prisma from "./prisma";

async function main() {
  await prisma.transaction.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("Admin@123", 10);

  // Create Admin
  const admin = await prisma.user.create({
    data: { name: "Admin", email: "admin@example.com", password, role: "ADMIN" },
  });


  // Create transactions
  await prisma.transaction.createMany({
    data: [
      { amount: 5000, type: "INCOME", category: "Salary", date: new Date("2026-04-01"), userId: admin.id },
      { amount: 1200, type: "EXPENSE", category: "Rent", date: new Date("2026-01-05"), userId: admin.id },
      { amount: 200, type: "EXPENSE", category: "Food", date: new Date("2026-03-10"), userId: admin.id }
    ],
  });


  console.log("Seed complete!");
  console.log("admin@example.com / Admin@123 (ADMIN)");
  console.log("Transactions created");
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());