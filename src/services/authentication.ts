import { Auth } from "aws-amplify";
import { CognitoUser } from "amazon-cognito-identity-js";
import * as AdminQueries from "./adminQueries";
import { CreateUserFormValues } from "../components/CreateUserForm/CreateUserForm";
type UserAttribute = { Name: string; Value: string };

type UserResponse = {
  Username: string;
  Attributes: UserAttribute[];
};

export type User = {
  id: string;
  email: string;
  name?: string;
  color?: string;
};

type GroupResponse = {
  GroupName: string;
};

export type CognitoUserWithAttributes = CognitoUser & {
  attributes?: {
    [key: string]: string;
  };
};

export const createUser = async (
  formValues: CreateUserFormValues
): Promise<void> => {
  try {
    await AdminQueries.post("/createUser", formValues);
  } catch (error) {
    if (hasResponseMessage(error)) {
      if (
        error.response.data.message ===
        "An account with the given email already exists."
      ) {
        throw "DUPLICATED_USER";
      }
      if (
        error.response.data.message.includes(
          "Password did not conform with password policy"
        )
      ) {
        throw "INVALID_PASSWORD";
      }
      if (
        error.response.data.message ===
        "User does not have permissions to perform administrative tasks"
      ) {
        throw "UNAUTHORIZED";
      }
    }
    throw "INTERNAL_ERROR";
  }
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

export const getUserGroups = async (id: string): Promise<string[]> => {
  try {
    const response = await AdminQueries.get("/listGroupsForUser", {
      username: id,
    });
    if (
      !response.Groups ||
      !Array.isArray(response.Groups) ||
      !response.Groups.length
    ) {
      return [];
    }
    const groups: string[] = response.Groups.map(
      (group: unknown): string | null => {
        if (!isGroupResponse(group)) {
          return null;
        }
        return group.GroupName;
      }
    ).filter((group: string | null) => group !== null);
    return groups;
  } catch (error) {
    throw "INTERNAL_ERROR";
  }
};

const findAttributeValue = (user: UserResponse, attribute: string) =>
  user.Attributes.find((att) => att.Name === attribute)?.Value;

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

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await AdminQueries.get("/listUsers");
    if (
      !response.Users ||
      !Array.isArray(response.Users) ||
      !response.Users.length
    ) {
      return [];
    }
    const users: User[] = response.Users.map((user: unknown): User | null => {
      if (!isUserResponse(user)) {
        return null;
      }
      const id = user.Username;
      const email = findAttributeValue(user, "email");
      const name = findAttributeValue(user, "name");
      const color = findAttributeValue(user, "custom:color");
      if (!id || !email) {
        return null;
      }
      return { id, email, name, color };
    }).filter((user: User | null) => user !== null);
    return users;
  } catch (error) {
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

const hasResponseMessage = (
  value: unknown
): value is { response: { data: { message: string } } } => {
  if (typeof value !== "object") {
    return false;
  }
  const objectValue = value as Record<string, unknown>;
  if (
    typeof objectValue.response !== "object" ||
    objectValue.response === null
  ) {
    return false;
  }
  const response = objectValue.response as Record<string, unknown>;
  if (typeof response.data !== "object" || response.data === null) {
    return false;
  }
  const data = response.data as Record<string, unknown>;
  if (typeof data.message !== "string") {
    return false;
  }
  return true;
};

const isAttribute = (value: unknown): value is UserAttribute =>
  typeof value === "object" &&
  value !== null &&
  "Name" in value &&
  "Value" in value &&
  !!(value as UserAttribute)["Name"] &&
  !!(value as UserAttribute)["Value"];

const isGroupResponse = (value: unknown): value is GroupResponse =>
  typeof value === "object" && value !== null && "GroupName" in value;

const isUserResponse = (value: unknown): value is UserResponse =>
  typeof value === "object" &&
  value !== null &&
  "Username" in value &&
  "Attributes" in value &&
  Array.isArray((value as UserResponse)["Attributes"]) &&
  (value as UserResponse)["Attributes"].reduce(
    (correct, value) => correct && isAttribute(value),
    true
  );

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

export const makeUserAdmin = async (id: string) => {
  try {
    await AdminQueries.post("/addUserToGroup", {
      username: id,
      groupname: "Admin",
    });
  } catch (error) {
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

export const removeUserAdmin = async (id: string) => {
  try {
    await AdminQueries.post("/removeUserFromGroup", {
      username: id,
      groupname: "Admin",
    });
  } catch (error) {
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
      if (error?.code === "ExpiredCodeException") {
        throw "EXPIRED_LINK";
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
