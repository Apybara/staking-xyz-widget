/**
 * Aleo uses funky serialization for its JSON objects. This function takes that funky representation
 * and makes it a valid json object
 * @param aleoString Invalid aleo json string
 * @returns A valid, JSON.parse-able string
 */
export const getFormattedAleoString = (aleoString: string) => {
  const keyValueRegex = /([a-zA-Z0-9_]+)(\s*):(\s*)([a-zA-Z0-9_.]+)/g;
  const objectArrayRegex = /([a-zA-Z0-9_]+)(\s*):(\s*)(\{|\[)/g;
  const arrayElementRegex = /(\[|,)(\s*)([a-zA-Z0-9_.]+)/g;

  let replacedString = aleoString.replace(objectArrayRegex, (_: any, key: any, space1: any, space2: any, open: any) => {
    return `"${key}"${space1}:${space2}${open}`;
  });

  replacedString = replacedString.replace(keyValueRegex, (_: any, key: any, space1: any, space2: any, value: any) => {
    return `"${key}"${space1}:${space2}"${value}"`;
  });

  replacedString = replacedString.replace(arrayElementRegex, (_: any, separator: any, space: any, element: any) => {
    return `${separator}${space}"${element}"`;
  });

  const nestedMatch = replacedString.match(objectArrayRegex);
  if (nestedMatch) {
    for (const match of nestedMatch) {
      const open = match[match.length - 1];
      const close = open === "{" ? "}" : "]";
      const nestedStart = replacedString.indexOf(match) + match.length - 1;
      let nestedEnd = nestedStart;
      let balance = 1;

      while (balance > 0) {
        nestedEnd++;
        if (replacedString[nestedEnd] === open) {
          balance++;
        } else if (replacedString[nestedEnd] === close) {
          balance--;
        }
      }

      const nestedJson = replacedString.slice(nestedStart, nestedEnd + 1);
      const formattedNestedJson = getFormattedAleoString(nestedJson);
      replacedString = replacedString.replace(nestedJson, formattedNestedJson);
    }
  }

  return replacedString;
};

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
