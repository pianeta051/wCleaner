import {
  get as amplifyGet,
  post as amplifyPost,
  put as amplifyPut,
  del as amplifyDelete,
} from "aws-amplify/api";

import { DocumentType } from "@aws-amplify/core/internals/utils";

export const API_URL = import.meta.env.VITE_API_URL as string | undefined;
// export const API_URL = undefined;
export const localFetch = async (
  method: string,
  path: string,
  {
    queryParams,
    body,
  }: {
    queryParams?: { [param: string]: string | undefined | number | boolean };
    body?: unknown;
  } = {}
) => {
  const url = new URL(path, API_URL);
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
};

export const get = async (
  path: string,
  queryParams: { [param: string]: string | undefined | number | boolean } = {}
) => {
  if (API_URL) return localFetch("GET", path, { queryParams });
  const restOperation = amplifyGet({
    apiName: "wCleanerApi",
    path,
    options: { queryParams: queryParams as Record<string, string> },
  });
  return (await restOperation.response).body.json();
};

export const post = async (
  path: string,
  body: FormData | DocumentType | undefined
) => {
  if (API_URL) return localFetch("POST", path, { body });
  const restOperation = amplifyPost({
    apiName: "wCleanerApi",
    path,
    options: { body },
  });
  return (await restOperation.response).body.json();
};

export const remove = async (path: string) => {
  if (API_URL) return localFetch("DELETE", path);
  const restOperation = amplifyDelete({
    apiName: "wCleanerApi",
    path,
  });
  return (await restOperation.response).body.json();
};

export const put = async (
  path: string,
  body: FormData | DocumentType | undefined
) => {
  if (API_URL) return localFetch("PUT", path, { body });
  const restOperation = amplifyPut({
    apiName: "wCleanerApi",
    path,
    options: { body },
  });
  return (await restOperation.response).body.json();
};
