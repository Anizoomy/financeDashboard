import prisma from "../utils/prisma";

export async function getRecords(query: {
  type?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) {
  const { type, category, startDate, endDate, page = 1, limit = 20 } = query;
  const skip = (page - 1) * limit;

  const where: any = { deletedAt: null };

  if (type) where.type = type;
  if (category) where.category = { contains: category };
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }

  const [records, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      skip,
      take: limit,
      orderBy: { date: "desc" },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    records,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getRecordById(id: string) {
  const record = await prisma.transaction.findFirst({
    where: { id, deletedAt: null },
    include: {
      createdBy: {
        select: { id: true, name: true, email: true },
      },
    },
  });
  if (!record) throw { statusCode: 404, message: "Record not found" };
  return record;
}

export async function createRecord(
  data: {
    amount: number;
    type: "INCOME" | "EXPENSE";
    category: string;
    date: string;
    description?: string;
  },
  userId: string
) {
  return prisma.transaction.create({
    data: {
      amount: data.amount,
      type: data.type,
      category: data.category,
      date: new Date(data.date),
      description: data.description,
      userId,
    },
    include: {
      createdBy: {
        select: { id: true, name: true, email: true },
      },
    },
  });
}

export async function updateRecord(
  id: string,
  data: {
    amount?: number;
    type?: "INCOME" | "EXPENSE";
    category?: string;
    date?: string;
    description?: string;
  }
) {
  await getRecordById(id);
  return prisma.transaction.update({
    where: { id },
    data: {
      ...data,
      ...(data.date && { date: new Date(data.date) }),
    },
    include: {
      createdBy: {
        select: { id: true, name: true, email: true },
      },
    },
  });
}

export async function deleteRecord(id: string) {
  await getRecordById(id);
  return prisma.transaction.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}