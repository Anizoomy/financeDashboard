import prisma from "../utils/prisma";

export async function getAllUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) throw { statusCode: 404, message: "User not found" };
  return user;
}

export async function updateUser(id: string, data: {
  name?: string;
  role?: "VIEWER" | "ANALYST" | "ADMIN";
  status?: "ACTIVE" | "INACTIVE";
}) {
  await getUserById(id);
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function deleteUser(requesterId: string, targetId: string) {
  if (requesterId === targetId) {
    throw { statusCode: 400, message: "You cannot delete your own account" };
  }
  await getUserById(targetId);
  return prisma.user.delete({ where: { id: targetId } });
}