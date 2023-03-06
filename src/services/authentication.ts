import { Auth } from "aws-amplify";
import { CognitoUser } from "amazon-cognito-identity-js";

export type User = {
  id?: number;
  email: string;
  password?: string;
  name?: string;
  mustChangePassword: boolean;
};
export type CognitoUserWithAttributes = CognitoUser & {
  attributes?: {
    [key: string]: string;
  };
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

export const getAuthenticatedUser =
  async (): Promise<CognitoUserWithAttributes | null> => {
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
  try {
    await Auth.forgotPassword(email, {
      redirectTo: process.env.REACT_APP_HOST || "",
    });
  } catch (error) {
    if (hasCode(error)) {
      if (error.code === "UserNotFoundException") {
        throw "USER_NOT_EXISTS";
      }
    }
    throw "INTERNAL_ERROR";
  }
};

const hasCode = (
  value: unknown
): value is {
  message: string;
  code: string;
} =>
  typeof value === "object" &&
  (value as Record<string, unknown>).code !== undefined;

export const logIn = async (
  email: string,
  password: string
): Promise<CognitoUserWithAttributes> => {
  try {
    const user = await Auth.signIn(email, password);
    return user;
  } catch (error) {
    if (hasCode(error)) {
      if (error?.code === "UserNotFoundException") {
        throw "USER_NOT_EXISTS";
      }
      if (error.code === "NotAuthorizedException") {
        if (error.message === "Password attempts exceeded") {
          throw "TOO_MANY_TRIES";
        }
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

export const resetPassword = async (
  email: string,
  code: string,
  newPassword: string
) => {
  try {
    await Auth.forgotPasswordSubmit(email, code, newPassword);
  } catch (error) {
    if (hasCode(error)) {
      if (error?.code === "UserNotFoundException") {
        throw "USER_NOT_EXISTS";
      }
      if (error?.code === "InvalidPasswordException") {
        throw "INVALID_PASSWORD";
      }
      if (error?.code === "CodeMismatchException") {
        throw "INVALID_RESET_PASSWORD_LINK";
      }
      if (error?.code === "LimitExceededException") {
        throw "TOO_MANY_TRIES";
      }
    }

    throw "INTERNAL_ERROR";
  }
};

export const setPassword = async (
  user: CognitoUserWithAttributes,
  newPassword: string
) => {
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

export const updateName = async (
  user: CognitoUserWithAttributes,
  newName: string
): Promise<CognitoUserWithAttributes> => {
  try {
    await Auth.updateUserAttributes(user, { name: newName });
    const newUser: CognitoUserWithAttributes = user;
    newUser.attributes = {
      ...user.attributes,
      name: newName,
    };
    return newUser;
  } catch (error) {
    throw "INTERNAL_ERROR";
  }
};

export const updatePassword = async (
  user: CognitoUserWithAttributes,
  oldPassword: string,
  newPassword: string
) => {
  try {
    await Auth.changePassword(user, oldPassword, newPassword);
  } catch (error) {
    if (hasCode(error)) {
      if (error.code === "NotAuthorizedException") {
        throw "INCORRECT_PASSWORD";
      }
      if (error.code === "InvalidPasswordException") {
        throw "INVALID_PASSWORD";
      }
      if (error.code === "LimitExceededException") {
        throw "TOO_MANY_TRIES";
      }
    }
    throw "INTERNAL_ERROR";
  }
};
