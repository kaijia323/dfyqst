export const importImage = (url?: string): string => {
  if (!url) return "";
  return new URL(`../assets/${url.replace(/^\//, "")}`, import.meta.url).href;
};
