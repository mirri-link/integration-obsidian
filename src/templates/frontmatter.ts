import { App, TFile } from "obsidian";

export const getFrontmatterTemplate = async (app: App | null, file: TFile) => {
  if (!app) return;

  let frontMatterTable = "";
  let frontMatterLength = 0;

  await app.fileManager.processFrontMatter(file, (fm) => {
    if (!fm) return;
    frontMatterTable += '<div class="frontmatter"><table>';
    for (const key in fm) {
      if (key === "publicLink") continue;
      frontMatterTable += `<tr><th>${key}</th><td>`;
      frontMatterLength++;
      if (key === "tags") {
        frontMatterTable += fm[key]
          .map(
            (tag) =>
              `<span class="tag tooltipped" title="Internal link: ${tag}">${tag}</span>`
          )
          .join(" ");
      } else {
        frontMatterTable += fm[key].toString();
      }
      frontMatterTable += `</td></tr>`;
    }
    frontMatterTable += "</table></div>\n";
  });

  if (!frontMatterLength) return "";
  return frontMatterTable;
};
