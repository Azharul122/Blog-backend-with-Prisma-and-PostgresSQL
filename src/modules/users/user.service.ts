import { prisma } from "../../../lib/prisma";
import { userEditableFields } from "../../../types/auth";
import { getUserFromToken } from "../../utils/getUserFromToken";
import { buildPaginationMeta, getPaginationParams } from "../../utils/pagination";

interface GetUsersFilters {
  page?: number;
  limit?: number;
}

const getAllUsers = async (filters: GetUsersFilters) => {
  const { page, limit, skip } = getPaginationParams({
    page: filters.page,
    limit: filters.limit,
  });

  const where = { deletedAt: null };

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
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
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  const meta = buildPaginationMeta(total, page, limit);

  return { users, meta };
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

const upsertProfile = async (userId: string, body: userEditableFields) => {
  const { name, ...profileFields } = body;

  const result = await prisma.$transaction(async (tx) => {
    let updatedUser = null;
    let updatedProfile = null;

    if (name !== undefined) {
      updatedUser = await tx.user.update({
        where: { id: userId },
        data: { name },
      });
    }

    if (Object.keys(profileFields).length > 0) {
      updatedProfile = await tx.profile.upsert({
        where: { userId },
        update: profileFields,
        create: { userId, ...profileFields },
      });
    }

    return { user: updatedUser, profile: updatedProfile };
  });

  return result;
};

export const userService = {
  getAllUsers,
  getUserById,
  getMe,
  upsertProfile,
};
