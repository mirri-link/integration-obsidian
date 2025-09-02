import { EventRef, Plugin, TFile } from "obsidian";

type FileMenuCallback = (file: TFile | null, app: any) => Promise<void>;

export class LinkMenu {
  private plugin: Plugin;
  private eventRef: EventRef | null = null;
  private targetFile: TFile | null = null;
  private callback: FileMenuCallback;

  constructor(plugin: Plugin, callback: FileMenuCallback) {
    this.plugin = plugin;
    this.callback = callback;
  }

  registerEvent() {
    this.eventRef = this.plugin.app.workspace.on("file-menu", (menu, file) =>
      this.onMenuOpenCallback(menu, file)
    );
    this.plugin.registerEvent(this.eventRef);
  }

  unregisterEvent() {
    if (this.eventRef) {
      this.plugin.app.workspace.offref(this.eventRef);
    }
  }

  onMenuOpenCallback(menu, file) {
    if (!(file && file instanceof TFile && file.extension === "md")) {
      return;
    }

    this.targetFile = file;
    this.addFileOptions(menu);
  }

  addFileOptions(menu) {
    const topLevelApp = this.plugin.app;
    menu.addItem((item) => {
      item.setIcon("link");
      item.setTitle("Share on Mirri");
      item.onClick(async () => {
        await this.callback(this.targetFile, topLevelApp);
      });
    });
  }
}
