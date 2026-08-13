const checkRestrictedContent = (content: string): string | null => {
  const restrictedCategories = [
    {
      name: "sexual or explicit content",
      words: [
        "porn",
        "pornography",
        "xxx",
        "sexual",
        "nudity",
        "nude",
        "erotic",
        "prostitution",
      ],
    },
    {
      name: "alcohol-related content",
      words: [
        "alcohol",
        "beer",
        "wine",
        "vodka",
        "whiskey",
        "whisky",
        "liquor",
      ],
    },
    {
      name: "drug-related content",
      words: [
        "cocaine",
        "heroin",
        "meth",
        "fentanyl",
        "marijuana",
        "weed",
        "cannabis",
        "drug dealing",
      ],
    },
    {
      name: "weapons or explosives",
      words: [
        "gun",
        "firearm",
        "rifle",
        "pistol",
        "bomb",
        "explosive",
        "grenade",
      ],
    },
    {
      name: "violent content",
      words: [
        "murder",
        "kill",
        "assassination",
        "torture",
        "violent attack",
      ],
    },
    {
      name: "self-harm content",
      words: [
        "suicide",
        "self harm",
        "self-harm",
      ],
    },
    {
      name: "criminal activity",
      words: [
        "human trafficking",
        "money laundering",
        "drug trafficking",
        "fraud",
        "scam",
      ],
    },
    {
      name: "terrorist or extremist content",
      words: [
        "terrorist",
        "terrorism",
        "extremist",
        "extremism",
      ],
    },
  ];

  const normalizedContent = content
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ");

  const detectedCategories = restrictedCategories
    .filter((category) =>
      category.words.some((word) =>
        normalizedContent.includes(word.toLowerCase())
      )
    )
    .map((category) => category.name);

  if (detectedCategories.length === 0) {
    return null;
  }

  console.log(detectedCategories);

  return   detectedCategories.join(", ");

};


export default checkRestrictedContent