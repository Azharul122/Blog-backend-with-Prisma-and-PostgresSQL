import { prisma } from "../../../lib/prisma";

const createCategory = async (category: any) => {
  const result = await prisma.category.create({ data: category });
  return result;
};

const getAllCategories = async () => {
  const result = await prisma.category.findMany();
  return result;
};

const updateCategory = async (id: string, data: any) => {
  const result = await prisma.category.update({ where: { id }, data: data });
  return result;
};

const deleteCategory = async (id: string) => {
  const result = await prisma.category.update({
    where: { id },
    data: { deletedAt: new Date() as any },
  });
  return result;
};

export const categoryService = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
