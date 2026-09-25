import mime from "mime";

import { topLevelApp, topLevelPlugin } from "../main";
import { replaceAsync } from "../lib/replace";
import { uploadFile } from "../lib/files";

const getExcalidrawAPI = () => {
  try {
    return (window as any).ExcalidrawAutomate?.getAPI?.() || null;
  } catch (e) {
    return null;
  }
};

const isExcalidrawFile = (ea, file) => {
  if (!file) return false;
  if (ea?.isExcalidrawFile) return ea.isExcalidrawFile(file);
  return (
    file.extension === "excalidraw" || file.name.endsWith(".excalidraw.md")
  );
};

const renderExcalidraw = async (ea, file) => {
  if (!ea) return null;
  try {
    const blob: Blob = await ea.createPNG(file.path, 2);
    return await blob.arrayBuffer();
  } catch (e) {
    console.error("Failed to render Excalidraw drawing", e);
    return null;
  } finally {
    ea.destroy?.();
  }
};

export const replaceImages = async (content, file) => {
  // Images, videos and Excalidraw drawings
  content = await replaceAsync(
    content,
    /!\[\[([^\]]+)\]\]/g,
    async (_, value) => {
      let size;
      [value, size] = value.split("|");
      const linkpath = value.split("#")[0].trim();
      const linkedFile = topLevelApp.metadataCache.getFirstLinkpathDest(
        linkpath,
        file.path
      );
      if (!linkedFile) {
        return `\n\n(missing embed: ${linkpath})\n\n`;
      }

      const attributes = size ? `width="${size.trim()}"` : "";

      const ea = getExcalidrawAPI();
      if (isExcalidrawFile(ea, linkedFile)) {
        const png = await renderExcalidraw(ea, linkedFile);
        if (!png) {
          return "\n\n(missing Excalidraw image)\n\n";
        }
        const publicUrl = await uploadFile(
          topLevelPlugin,
          png,
          `${linkedFile.basename.replace(/\.excalidraw$/, "")}.png`,
          "image/png"
        );
        return `<img alt="Inline Excalidraw drawing" src="${publicUrl}" ${attributes} />`;
      }

      const basename = linkedFile.name || "image.jpg";
      const contentType = mime.getType(basename) || "application/octet-stream";
      const fileContent = await file.vault.readBinary(linkedFile);

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

      return `<img alt="Inline image" src="${publicUrl}" ${attributes} />`;
    }
  );

  return content;
};
