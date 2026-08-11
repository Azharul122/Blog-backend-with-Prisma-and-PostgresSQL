import { prisma } from "../../../lib/prisma";

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    where: { deletedAt: null },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return users;
};

const getUserById = async (id: string) => {
    console.log(id);
  const user = await prisma.user.findUnique({ where: { id } });
  return user;
};

export const userService = {
  getAllUsers,
  getUserById
};
