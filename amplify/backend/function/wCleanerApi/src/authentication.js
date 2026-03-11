const { CognitoIdentityServiceProvider } = require("aws-sdk");

const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();

const userPoolId = process.env.USER_POOL_ID;

console.log("USER POOL ID : " + userPoolId);
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
  if (!authProvider) {
    return {};
  }
  const providerParts = authProvider.split(":");
  const userSub = providerParts[providerParts.length - 1];
  const groups = await getGroups(userSub);
  const userInfo = await getUserInfo(userSub);
  return {
    userSub,
    groups,
    userInfo,
  };
};

const USER_ATTRIBUTES = ["sub", "name", "email", "custom:color"];
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
      const attrName = Name.startsWith("custom:") ? Name.split(":")[1] : Name;
      acc[attrName] = Value;
    }
    return acc;
  }, {});
};

const getJobUsers = async (jobs) => {
  const userIds = [];
  jobs.forEach((item) => {
    let userId;
    if (item.assigned_to?.S) {
      userId = item.assigned_to?.S;
      if (!userIds.includes(userId)) {
        userIds.push(userId);
      }
    }
  });

  const users = [];
  for (const item of userIds) {
    try {
      const user = await getUserInfo(item);
      users.push(user);
    } catch (error) {
      if (error.code === "UserNotFoundException") {
        users.push({
          sub: item,
          name: "Deleted user",
          email: "",
          color: "#a8a8a8ff",
        });
      } else {
        throw error;
      }
    }
  }

  const usersAssignation = {};
  for (const job of jobs) {
    console.log(JSON.stringify({ job }, null, 2));
    const sub = job.assigned_to?.S;
    console.log(JSON.stringify({ sub }, null, 2));
    const assignedTo = sub ? users.find((u) => u.sub === sub) : null;
    console.log(JSON.stringify({ assignedTo }, null, 2));
    const jobId = job.SK?.S?.replace("job_", "");
    console.log(JSON.stringify({ jobId }, null, 2));
    if (assignedTo) {
      usersAssignation[jobId] = assignedTo;
    }
  }
  console.log(JSON.stringify({ usersAssignation }, null, 2));
  return usersAssignation;
};

module.exports = {
  getAuthData,
  getUserInfo,
  getJobUsers,
};
