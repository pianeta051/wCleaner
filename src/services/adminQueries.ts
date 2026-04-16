import { API, Auth } from "aws-amplify";

export const ADMIN_QUERIES_URL = import.meta.env.VITE_ADMIN_QUERIES_URL as
  | string
  | undefined;

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
  const url = new URL(path, ADMIN_QUERIES_URL);
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
  queryParams: { [param: string]: string } = {}
) => {
  if (ADMIN_QUERIES_URL) return localFetch("GET", path, { queryParams });
  return API.get("AdminQueries", path, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${(await Auth.currentSession())
        .getAccessToken()
        .getJwtToken()}`,
    },
    queryStringParameters: queryParams,
  });
};

export const post = async (
  path: string,
  body: { [param: string]: string } = {}
) => {
  if (ADMIN_QUERIES_URL) return localFetch("POST", path, { body });
  return API.post("AdminQueries", path, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${(await Auth.currentSession())
        .getAccessToken()
        .getJwtToken()}`,
    },
    body,
  });
};

export const put = async (
  path: string,
  body: { [param: string]: string } = {}
) => {
  if (ADMIN_QUERIES_URL) return localFetch("PUT", path, { body });
  return API.put("AdminQueries", path, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${(await Auth.currentSession())
        .getAccessToken()
        .getJwtToken()}`,
    },
    body,
  });
};
