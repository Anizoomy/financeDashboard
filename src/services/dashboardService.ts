import prisma from "../utils/prisma";

function buildDateFilter(startDate?: string, endDate?: string) {
  const where: any = { deletedAt: null };
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }
  return where;
}

export async function getSummary(query: {
  startDate?: string;
  endDate?: string;
}) {
  const where = buildDateFilter(query.startDate, query.endDate);

  const [incomeResult, expenseResult] = await Promise.all([
    prisma.transaction.aggregate({
      where: { ...where, type: "INCOME" },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.transaction.aggregate({
      where: { ...where, type: "EXPENSE" },
      _sum: { amount: true },
      _count: true,
    }),
  ]);

  const totalIncome = incomeResult._sum.amount || 0;
  const totalExpenses = expenseResult._sum.amount || 0;

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    incomeCount: incomeResult._count,
    expenseCount: expenseResult._count,
  };
}

export async function getCategoryTotals(query: {
  startDate?: string;
  endDate?: string;
}) {
  const where = buildDateFilter(query.startDate, query.endDate);

  const records = await prisma.transaction.groupBy({
    by: ["category", "type"],
    where,
    _sum: { amount: true },
    _count: true,
  });

  const map: Record<string, any> = {};
  for (const row of records) {
    if (!map[row.category]) {
      map[row.category] = {
        category: row.category,
        income: 0,
        expense: 0,
        net: 0,
        count: 0,
      };
    }
    const amount = row._sum.amount || 0;
    if (row.type === "INCOME") map[row.category].income += amount;
    else map[row.category].expense += amount;
    map[row.category].count += row._count;
  }

  return Object.values(map).map((c) => ({
    ...c,
    net: c.income - c.expense,
  }));
}

export async function getMonthlyTrends(months: number = 12) {
  const since = new Date();
  since.setMonth(since.getMonth() - months);

  const records = await prisma.transaction.findMany({
    where: { deletedAt: null, date: { gte: since } },
    select: { amount: true, type: true, date: true },
  });

  const map: Record<string, any> = {};
  for (const r of records) {
    const key = `${r.date.getFullYear()}-${String(r.date.getMonth() + 1).padStart(2, "0")}`;
    if (!map[key]) map[key] = { month: key, income: 0, expense: 0, net: 0 };
    if (r.type === "INCOME") map[key].income += r.amount;
    else map[key].expense += r.amount;
    map[key].net = map[key].income - map[key].expense;
  }

  return Object.values(map).sort((a, b) => a.month.localeCompare(b.month));
}

export async function getWeeklyComparison() {
  const now = new Date();
  const startOfThisWeek = new Date(now);
  startOfThisWeek.setDate(now.getDate() - now.getDay());
  startOfThisWeek.setHours(0, 0, 0, 0);

  const startOfLastWeek = new Date(startOfThisWeek);
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

  const [thisWeek, lastWeek] = await Promise.all([
    aggregateWeek(startOfThisWeek, now),
    aggregateWeek(startOfLastWeek, startOfThisWeek),
  ]);

  return { thisWeek, lastWeek };
}

async function aggregateWeek(from: Date, to: Date) {
  const [income, expense] = await Promise.all([
    prisma.transaction.aggregate({
      where: { deletedAt: null, type: "INCOME", date: { gte: from, lt: to } },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { deletedAt: null, type: "EXPENSE", date: { gte: from, lt: to } },
      _sum: { amount: true },
    }),
  ]);
  const inc = income._sum.amount || 0;
  const exp = expense._sum.amount || 0;
  return { income: inc, expense: exp, net: inc - exp };
}

export async function getRecentActivity(limit: number = 10) {
  return prisma.transaction.findMany({
    where: { deletedAt: null },
    orderBy: { date: "desc" },
    take: limit,
    include: {
      createdBy: {
        select: { id: true, name: true },
      },
    },
  });
}