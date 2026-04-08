import { API } from "aws-amplify";

export const API_URL = import.meta.env.VITE_API_URL as string | undefined;

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
  return API.get("wCleanerApi", path, {
    queryStringParameters: queryParams,
  });
};

export const post = async <TBody = unknown, TResponse = unknown>(
  path: string,
  body: TBody
): Promise<TResponse> => {
  if (API_URL) return localFetch("POST", path, { body });
  return API.post("wCleanerApi", path, {
    body,
  });
};

export const remove = async (path: string) => {
  if (API_URL) return localFetch("DELETE", path);
  return API.del("wCleanerApi", path, {});
};

export const put = async <TBody = unknown, TResponse = unknown>(
  path: string,
  body: TBody
): Promise<TResponse> => {
  if (API_URL) return localFetch("PUT", path, { body });
  return API.put("wCleanerApi", path, { body });
};
