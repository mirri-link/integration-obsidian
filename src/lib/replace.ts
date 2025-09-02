export const replaceAsync = async (
  str: string,
  regex: RegExp,
  asyncFn: (...args: string[]) => Promise<string>
) => {
  const promises: Promise<any>[] = [];
  str.replace(regex, (match, ...args) => {
    const promise = asyncFn(match, ...args);
    promises.push(promise);
  });
  const data = await Promise.all(promises);
  return str.replace(regex, () => data.shift());
};
