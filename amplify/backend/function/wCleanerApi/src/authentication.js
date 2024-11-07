const { CognitoIdentityServiceProvider } = require("aws-sdk");
const { mapJob } = require("./mappers");

const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
const userPoolId = "eu-west-2_nRfe1m5kq";

const getGroups = async (userSub) => {
  const params = {
    UserPoolId: userPoolId,
    Username: userSub,
  };
  const result = await cognitoIdentityServiceProvider
    .adminListGroupsForUser(params)
    .promise();
  if (result) {
    return result.Groups?.map((g) => g.GroupName);
  }
  return [];
};

const getAuthData = async (req) => {
  const authProvider =
    req.apiGateway.event.requestContext.identity.cognitoAuthenticationProvider;
  const providerParts = authProvider.split(":");
  const userSub = providerParts[providerParts.length - 1];
  const groups = await getGroups(userSub);
  return {
    userSub,
    groups,
  };
};

const USER_ATTRIBUTES = ["sub", "name", "email"];
const getUserInfo = async (userSub) => {
  const params = {
    UserPoolId: userPoolId,
    Username: userSub,
  };
  const response = await cognitoIdentityServiceProvider
    .adminGetUser(params)
    .promise();
  return response.UserAttributes.reduce((acc, { Name, Value }) => {
    if (USER_ATTRIBUTES.includes(Name)) {
      acc[Name] = Value;
    }
    return acc;
  }, {});
};

const getJobUsers = async (items) => {
  const userIds = [];
  items.forEach((item) => {
    const userId = item.assigned_to?.S;
    if (!userIds.includes(userId)) {
      userIds.push(userId);
    }
  });
  const users = [];
  for (const item of userIds) {
    users.push(await getUserInfo(item));
  }
  let jobs = items.map(mapJob);
  jobs = jobs.map((job, i) => {
    const assignedTo = users.find(
      (user) => user.sub === items[i].assigned_to.S
    );
    return {
      ...job,
      assignedTo,
    };
  });
  return jobs;
};

module.exports = {
  getAuthData,
  getUserInfo,
  getJobUsers,
};
