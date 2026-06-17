import {
  get as amplifyGet,
  post as amplifyPost,
  put as amplifyPut,
} from "aws-amplify/api";
import { getAccessToken } from "./authentication";
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
  const restOperation = amplifyGet({
    apiName: "AdminQueries",
    path,
    options: {
      headers: {
        "Content-Type": "application/json",
        // Authorization: `${(await Auth.currentSession())
        //   .getAccessToken()
        //   .getJwtToken()}`,
      },
      queryParams,
    },
  });
  return (await restOperation.response).body.json();
};

export const post = async (
  path: string,
  body: { [param: string]: string } = {}
) => {
  if (ADMIN_QUERIES_URL) return localFetch("POST", path, { body });
  const restOperation = amplifyPost({
    apiName: "AdminQueries",
    path,
    options: {
      headers: {
        "Content-Type": "application/json",
        Authorization: (await getAccessToken()) ?? "",
      },
      body,
    },
  });
  return (await restOperation.response).body.json();
};

export const put = async (
  path: string,
  body: { [param: string]: string } = {}
) => {
  if (ADMIN_QUERIES_URL) return localFetch("PUT", path, { body });
  const restOperation = amplifyPut({
    apiName: "AdminQueries",
    path,
    options: {
      headers: {
        "Content-Type": "application/json",
        Authorization: (await getAccessToken()) ?? "",
      },
      body,
    },
  });
  return (await restOperation.response).body.json();
};
