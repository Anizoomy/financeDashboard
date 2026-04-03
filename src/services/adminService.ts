import prisma from "../utils/prisma";

export async function getSystemStats() {
  const [
    totalUsers,
    activeUsers,
    inactiveUsers,
    totalRecords,
    totalIncome,
    totalExpenses,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: "ACTIVE" } }),
    prisma.user.count({ where: { status: "INACTIVE" } }),
    prisma.transaction.count({ where: { deletedAt: null } }),
    prisma.transaction.aggregate({
      where: { deletedAt: null, type: "INCOME" },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { deletedAt: null, type: "EXPENSE" },
      _sum: { amount: true },
    }),
  ]);

  return {
    users: {
      total: totalUsers,
      active: activeUsers,
      inactive: inactiveUsers,
    },
    transactions: {
      total: totalRecords,
      totalIncome: totalIncome._sum.amount || 0,
      totalExpenses: totalExpenses._sum.amount || 0,
      netBalance: (totalIncome._sum.amount || 0) - (totalExpenses._sum.amount || 0),
    },
  };
}

export async function getUsersByRole() {
  const records = await prisma.user.groupBy({
    by: ["role"],
    _count: true,
  });

  return records.map((r) => ({
    role: r.role,
    count: r._count,
  }));
}