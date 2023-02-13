import { Auth } from "aws-amplify";
import { CognitoUser } from "amazon-cognito-identity-js";

export type User = {
  id?: number;
  email: string;
  password?: string;
  name?: string;
  mustChangePassword: boolean;
};

const users: User[] = [
  {
    id: 1,
    email: "carlos@domain.net",
    password: "123456Ab?",
    name: "Carlos",
    mustChangePassword: false,
  },
  {
    id: 2,
    email: "pedro@email.com",
    password: "4321",
    name: "pedro",
    mustChangePassword: true,
  },
];

const sleep = async (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export const createUser = async (email: string, password: string) => {
  await sleep(1000);
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    throw "DUPLICATED_USER";
  }

  const user: User = {
    id: users.length + 1,
    email,
    password,
    mustChangePassword: true,
  };
  user["name"] = user.email.split("@")[0];
  users.push(user);
  return { ...user };
};

export const currentUser = async () => {
  await sleep(1000);
  return users[0];
};

export const getAuthenticatedUser = async (): Promise<CognitoUser | null> => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    return user;
  } catch (error) {
    return null;
  }
};

const findByEmail = (email: string) =>
  users.find((user) => user.email === email);

export const forgotPassword = async (email: string) => {
  await sleep(1000);

  const user = users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
  if (!user) {
    throw "USER_NOT_EXISTS";
  }
  return user;
};

const hasCode = (value: unknown): value is { code: string } =>
  typeof value === "object" &&
  (value as Record<string, unknown>).code !== undefined;

export const logIn = async (
  email: string,
  password: string
): Promise<CognitoUser> => {
  try {
    const user = await Auth.signIn(email, password);
    return user;
  } catch (error) {
    if (hasCode(error)) {
      if (error?.code === "UserNotFoundException") {
        throw "USER_NOT_EXISTS";
      }
      if (error.code === "NotAuthorizedException") {
        throw "INCORRECT_PASSWORD";
      }
    }
    throw "INTERNAL_ERROR";
  }
};

export const logOut = async () => {
  try {
    await Auth.signOut();
  } catch (e) {
    throw "INTERNAL_ERROR";
  }
};

export const resetPassword = async (email: string, newPassword: string) => {
  await sleep(1000);

  const user = users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
  if (!user) {
    throw "USER_NOT_EXISTS";
  }
  user.password = newPassword;
  return user;
};

export const setPassword = async (
  user: CognitoUser,
  newPassword: string
): Promise<CognitoUser> => {
  try {
    const loggedInUser = await Auth.completeNewPassword(user, newPassword);
    return loggedInUser;
  } catch (error) {
    if (hasCode(error)) {
      if (error?.code === "InvalidPasswordException") {
        throw "INVALID_PASSWORD";
      }
    }
    console.log("error signing in", error);
    throw "INTERNAL_ERROR";
  }
};

export const user = async (email: string) => {
  await sleep(1000);
  return findByEmail(email);
};
export const getUsers = async () => {
  await sleep(1000);
  return [...users];
};

export const updateName = async (email: string, newName: string) => {
  await sleep(1000);
  const userIndex = users.findIndex((user) => email === user.email);
  if (userIndex === -1) {
    throw "USER_NOT_EXISTS";
  }
  const newUser = {
    ...users[userIndex],
    name: newName,
  };
  users[userIndex] = newUser;
  return newUser;
};

export const updatePassword = async (
  email: string,
  oldPassword: string,
  newPassword: string
) => {
  await sleep(1000);
  const userIndex = users.findIndex((user) => email === user.email);
  if (userIndex === -1) {
    throw "USER_NOT_EXISTS";
  }
  if (oldPassword !== users[userIndex].password) {
    throw "INCORRECT_PASSWORD";
  }
  const newUser = {
    ...users[userIndex],
    password: newPassword,
  };
  return newUser;
};
