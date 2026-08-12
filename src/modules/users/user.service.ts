import { prisma } from "../../../lib/prisma";
import { getUserFromToken } from "../../utils/getUserFromToken";

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
      profile: true,
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

const getMe = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { profile: true },
  });
  return user;
};

// .......................... Create or update profile ...............................

const upsertProfile = async (
  userId: string,
  data: {
    bio?: string;
    address?: string;
    bloodGroup?: string;
    phone?: string;
  },
) => {
  const result = await prisma.profile.upsert({
    where: { userId },
    update: {
      bio: data.bio,
      address: data.address,
      bloodGroup: data.bloodGroup as any, 
      phone: data.phone,
    },
    create: {
      userId,
      bio: data.bio,
      address: data.address,
      bloodGroup: data.bloodGroup as any,
      phone: data.phone,
    },
  });

  return result;
};

export const userService = {
  getAllUsers,
  getUserById,
  getMe,
  upsertProfile,
};
