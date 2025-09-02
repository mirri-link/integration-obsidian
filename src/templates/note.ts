import { App, TFile } from "obsidian";

import { stylesTemplate } from "./styles";
import { getFrontmatterTemplate } from "./frontmatter";
import { replaceImages } from "./images";
import { replaceLinks } from "./links";

export const getNoteTemplate = async (app: App | null, file: TFile) => {
  const frontMatterTable = await getFrontmatterTemplate(app, file);

  let content = await file.vault.cachedRead(file);
  content = content.replace(/^\s*?---\n.*?\n---/s, "");
  content = await replaceImages(content, file);
  content = await replaceLinks(content);

  content = `# ${file.basename}\n\n${frontMatterTable}\n\n${content}`;
  content += stylesTemplate;

  return content;
};
