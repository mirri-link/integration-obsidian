import { replaceAsync } from "../lib/replace";

export const replaceHighlights = async (content) => {
  return replaceAsync(content, /\=\=([^\=]+)\=\=/g, async (_, value) => {
    return `<mark>${value}</mark>`;
  });
};
