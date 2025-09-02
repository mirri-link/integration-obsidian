import { replaceAsync } from "../lib/replace";

export const replaceLinks = async (content) => {
  return replaceAsync(content, /\[\[([^\]]+)\]\]/g, async (_, value) => {
    const [link, text] = value.split("|");

    const title = `Internal link: ${link}`;
    const val = text || link;

    return `<a href="#internal-link" class="tooltipped" title="${title}">${val}</a>`;
  });
};
