type ModelConfig = {
  model: any;
  dateField?: string;
  where?: Record<string, any>;
};

type OverviewConfig = {
  posts?: ModelConfig;
  comments?: ModelConfig;
//   likes?: ModelConfig;

  archivedPosts?: ModelConfig;
  draftPosts?: ModelConfig;
};

const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

export const getYearlyOverview = async (
  year: number,
  config: OverviewConfig,
) => {
  const overview: Record<string, Record<string, number>> = {};


  months.forEach((month) => {
    overview[month] = {
      total_posts: 0,
      total_comments: 0,
    //   total_likes: 0,
      total_archived_posts: 0,
      total_draft_posts: 0,
    };
  });

  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year + 1, 0, 1);

  const getMonthlyCounts = async (config?: ModelConfig) => {
    if (!config) return [];

    const { model, dateField = "createdAt", where = {} } = config;

    const records = await model.findMany({
      where: {
        ...where,
        [dateField]: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: {
        [dateField]: true,
      },
    });

    const counts = Array(12).fill(0);

    records.forEach((record: any) => {
      const date = record[dateField];

      if (date) {
        const month = new Date(date).getMonth();
        counts[month]++;
      }
    });

    return counts;
  };

  const [posts, comments, archivedPosts, draftPosts] = await Promise.all(
    [
      getMonthlyCounts(config.posts),
      getMonthlyCounts(config.comments),
    //   getMonthlyCounts(config.likes),
      getMonthlyCounts(config.archivedPosts),
      getMonthlyCounts(config.draftPosts),
    ],
  );

  months.forEach((month, index) => {
    overview[month] = {
      total_posts: posts[index],
      total_comments: comments[index],
    //   total_likes: likes[index],
      total_archived_posts: archivedPosts[index],
      total_draft_posts: draftPosts[index],
    };
  });

  return {
    year,
    overview,
  };
};
