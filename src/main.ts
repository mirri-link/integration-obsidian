import { Notice, Plugin, TFile } from "obsidian";

import { LinkMenu } from "./ui/LinkMenu";
import { getNoteTemplate } from "./templates/note";

export let topLevelApp;
export let topLevelPlugin;

function getActiveMarkdownFile(app) {
  const activeFile = app.workspace.getActiveFile();
  const activeMarkdownFile = abstractFileToMarkdownTFile(activeFile);
  if (!activeMarkdownFile) {
    this.logError("could not get current file.");
    return null;
  }
  return activeMarkdownFile;
}

function abstractFileToMarkdownTFile(file) {
  if (file instanceof TFile && file.extension === "md") return file;
  return null;
}

const shareMirriLink = async (file, app) => {
  const notice = new Notice("Uploading to Mirri.link...");

  let content = await getNoteTemplate(app, file);

  const res = await fetch("https://mirri.link/api/md", {
    method: "POST",
    body: JSON.stringify({ content }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const { publicUrl } = await res.json();

  notice && notice.hide();

  console.log(publicUrl);
  window.open(publicUrl);

  await app?.fileManager.processFrontMatter(file, (fm) => {
    fm["publicLink"] = publicUrl;
  });
};

class MirriLink extends Plugin {
  linkMenu: LinkMenu;
  settings: Record<string, any>;

  async onload() {
    topLevelApp = this.app;
    topLevelPlugin = this;
    this.linkMenu = new LinkMenu(this, shareMirriLink);
    this.linkMenu.registerEvent();
    this.addCommand({
      id: "MirriLinkshare",
      name: "Share on Mirri.link",
      callback: async () => {
        const file = getActiveMarkdownFile(this.app);
        if (!file) return;
        await shareMirriLink(file, topLevelApp);
      },
    });
    this.loadSettings();
  }

  async loadSettings() {
    this.settings = Object.assign({}, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  onunload() {
    this.linkMenu.unregisterEvent();
  }
}

export default MirriLink;
