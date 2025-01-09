import { API, Auth } from "aws-amplify";

export const get = async (
  path: string,
  queryParams: { [param: string]: string } = {}
) => {
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
