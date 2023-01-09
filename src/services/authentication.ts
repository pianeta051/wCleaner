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
    password: "1234",
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

const findByEmail = (email: string) =>
  users.find((user) => user.email === email);

export const logIn = async (email: string, password: string) => {
  await sleep(1000);
  const user = findByEmail(email);
  if (!user) {
    throw "USER_NOT_EXISTS";
  }

  if (user.password != password) {
    throw "INCORRECT_PASSWORD";
  }
};
export const resetPassword = async (email: string) => {
  await sleep(1000);

  const user = users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
  if (!user) {
    throw "USER_NOT_EXISTS";
  }
  return user;
};

export const setPassword = async (newPassword: string) => {
  await sleep(1000);
  if (newPassword.length === 0) {
    throw "INVALID_PASSWORD";
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
