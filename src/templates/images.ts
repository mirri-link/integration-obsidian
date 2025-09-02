import mime from "mime";

import { topLevelApp, topLevelPlugin } from "../main";
import { replaceAsync } from "../lib/replace";
import { uploadFile } from "../lib/files";

export const replaceImages = async (content, file) => {
  // Excalidraw images
  content = await replaceAsync(
    content,
    /!\[\[([^\]]+)\.excalidraw\.md\]\]/g,
    async (_, value) => {
      const filename = `${value}.excalidraw.md`;
      const preview = document.querySelector(
        `.excalidraw-svg[src="${filename}"] img`
      );
      const src = preview && (preview as HTMLImageElement).src;

      // TODO
      if (!src) {
        return "\n\n(missing Excalidraw image)\n\n";
      }

      return `<img alt="Inline Excalidraw drawing" data-filename="${filename}" src="${src}"/>`;
    }
  );

  // Images and videos
  content = await replaceAsync(
    content,
    /!\[\[([^\]]+)\]\]/g,
    async (_, value) => {
      let size;
      [value, size] = value.split("|");
      const filePath = await topLevelApp.metadataCache.getFirstLinkpathDest(
        value.trim(),
        file.path
      );
      const basename = value?.split("/")?.pop()?.trim() || "image.jpg";
      const contentType = mime.getType(basename) || "application/octet-stream";
      const fileContent = await file.vault.readBinary(filePath);

      const publicUrl = await uploadFile(
        topLevelPlugin,
        fileContent,
        basename,
        contentType
      );

      if (contentType.startsWith("video/mp4")) {
        return `<video controls><source src="${publicUrl}" type="${contentType}"></video>`;
      }
      if (contentType === "video/quicktime") {
        // Not supported by most browsers
        return `<a href="${publicUrl}">Video: ${basename}</a>`;
      }

      const attributes = size ? `width="${size}"` : "";
      return `<img alt="Inline image" src="${publicUrl}" ${attributes} />`;
    }
  );

  return content;
};
