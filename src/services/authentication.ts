type LogInFormData = {
  email: string;
  password?: string;
};

const users: LogInFormData[] = [
  {
    email: "carlos@domain.net",
    password: "1234",
  },
];

const sleep = async (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

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

  const result = users.filter((user) =>
    user.email.toLowerCase().includes(email.toLowerCase())
  );
  if (result.length === 0) {
    throw "EMAIL_NOT_REGISTERED";
  }
  return result;
};

export const signUp = async (email: string, password: string) => {
  await sleep(1000);
  const user = findByEmail(email);
  if (user) {
    throw "Failed sign up";
  }
  users.push({ email, password });
};

export const user = async (email: string) => {
  await sleep(1000);
  return findByEmail(email);
};
export const getUsers = () => users;
