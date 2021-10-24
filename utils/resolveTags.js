/**
 *
 * @param {Array} newTags
 * @param {Array} currentTags
 * @returns
 */
const resolveTags = (newTags, currentTags) => {
  const randomColor = (
    arr = [
      "gray",
      "brown",
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "purple",
      "pink",
    ]
  ) => {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  const tagsToAdd = [];
  const tagsToMap = [];

  newTags.forEach((newTag) => {
    newTag = newTag.replace(/,/g, "-");
    const ans = currentTags.find((currentTag) => currentTag.name === newTag);
    ans ? tagsToAdd.push(ans) : tagsToMap.push(newTag);
  });

  return [
    ...tagsToAdd,
    ...tagsToMap.map((tag) => ({
      name: tag,
      color: randomColor(),
    })),
  ];
};

module.exports = resolveTags;
