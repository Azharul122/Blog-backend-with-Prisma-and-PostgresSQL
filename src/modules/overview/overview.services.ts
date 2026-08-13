import { prisma } from "../../../lib/prisma";
import { getYearlyOverview } from "../../utils/getYearlyOverview";

const getAllOverview = async (year: number) => {

    const totalPosts = await prisma.post.count();
    const totalComments = await prisma.comment.count();
    const totalArchivedPosts = await prisma.post.count({
      where: {
        status: "ARCHIVED",
      },
    })
    const totalDraftPosts = await prisma.post.count({
      where: {
        status: "DRAFT",
      },
    })

    const overview={
        totalPosts,
        totalComments,
        totalArchivedPosts,
        totalDraftPosts
    }

    const monthlyData = await getYearlyOverview(year, {
    posts: {
      model: prisma.post,
    },

    comments: {
      model: prisma.comment,
    },

    // likes: {
    //   model: prisma.like,
    // },

    archivedPosts: {
      model: prisma.post,
      where: {
        status: "ARCHIVED",
      },
    },

    draftPosts: {
      model: prisma.post,
      where: {
        status: "DRAFT",
      },
    },
  })

  return {
    overview,
    monthlyData
  }
};

export const overviewService = {
  getAllOverview,
};
