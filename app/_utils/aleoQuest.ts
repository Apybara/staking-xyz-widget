export const getIsUserIdValid = (userId?: string) => {
  if (!userId) return false;
  return userId.length === 72 && userId.endsWith("t7kgaqlm");
};
