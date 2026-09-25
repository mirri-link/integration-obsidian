import { requestUrl } from "obsidian";

const retry = async (promise, tries = 3) => {
  let attempt = 1;
  while (attempt <= tries) {
    try {
      const res = await promise();
      return res;
    } catch (e) {
      if (attempt === tries) {
        console.log(`Exhausted all ${tries} attempts: ${e.message}`);
        throw e;
      } else {
        console.log(
          `Attempt ${attempt}/${tries} failed: ${e.message}, retrying...`
        );
      }
      attempt++;
    }
  }
};

export const uploadFile = async (
  plugin,
  fileContents,
  fileName,
  contentType
) => {
  const digest = await crypto.subtle.digest("SHA-256", fileContents);
  const hash = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const cacheKey = `upload-cache-${fileName}-${contentType}-${hash}`;

  if (plugin.settings[cacheKey]) {
    return plugin.settings[cacheKey];
  }

  return retry(async () => {
    const res = await requestUrl(
      `https://mirri.link/api/get-url?filename=${encodeURIComponent(
        fileName
      )}&contentType=${encodeURIComponent(contentType)}`
    );
    const { url, publicUrl } = res.json;

    await requestUrl({
      url,
      method: "PUT",
      body: fileContents,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${fileName}"`,
      },
    });

    plugin.settings[cacheKey] = publicUrl;
    plugin.saveSettings();

    return publicUrl;
  });
};
