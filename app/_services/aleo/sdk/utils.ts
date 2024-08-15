import { JSONRPCClient } from "json-rpc-2.0";

export const getLazyInitAleoSDK = async () => {
  try {
    return await import("@demox-labs/aleo-sdk");
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAleoClient = ({ apiUrl }: { apiUrl: string }) => {
  const client = new JSONRPCClient((jsonRPCRequest: any) =>
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ ...jsonRPCRequest }),
    }).then((response: any) => {
      if (response.status === 200) {
        // Use client.receive when you received a JSON-RPC response.
        return response.json().then((jsonRPCResponse: any) => client.receive(jsonRPCResponse));
      } else if (jsonRPCRequest.id !== undefined) {
        return Promise.reject(new Error(response.statusText));
      }
    }),
  );
  return client;
};

export const getAleoMappingValue = async ({
  apiUrl,
  mappingKey,
  programId,
  mappingName,
  maxRetries = 6,
  baseDelay = 300,
}: {
  apiUrl: string;
  mappingKey: string;
  programId: string;
  mappingName: string;
  maxRetries?: number;
  baseDelay?: number;
}) => {
  const client = await getAleoClient({ apiUrl });

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await delay(baseDelay * Math.pow(2, attempt - 1));
      const response = (await client.request("getMappingValue", {
        program_id: programId,
        mapping_name: mappingName,
        key: mappingKey,
      })) as string;

      return response;
    } catch (error) {
      if (attempt === maxRetries) {
        throw new Error(`Failed to get mapping value after ${maxRetries} attempts: ${error}`);
      }
    }
  }

  // This line should not be reached as the function will either return or throw an error
  throw new Error("Unexpected error in getMappingValue function");
};

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
