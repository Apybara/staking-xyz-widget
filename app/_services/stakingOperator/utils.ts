export const getLastOffset = ({ totalEntries, limit }: { totalEntries: number; limit: number }) => {
  const numberOfPages = Math.ceil(totalEntries / limit);
  return numberOfPages - 1;
};
