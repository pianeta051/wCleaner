/* eslint-disable */
/*
 * Copyright 2019-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

const { CognitoIdentityServiceProvider } = require("aws-sdk");
import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
const userPoolId = process.env.USERPOOL;

const cognitoClient = new CognitoIdentityProviderClient();

async function addUserToGroup(username, groupname) {
  const params = {
    GroupName: groupname,
    UserPoolId: userPoolId,
    Username: username,
  };

  console.log(`Attempting to add ${username} to ${groupname}`);

  try {
    const command = new AdminAddUserToGroupCommand(params);
    await cognitoClient.send(command);
    console.log(`Success adding ${username} to ${groupname}`);
    return {
      message: `Success adding ${username} to ${groupname}`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function removeUserFromGroup(username, groupname) {
  const params = {
    GroupName: groupname,
    UserPoolId: userPoolId,
    Username: username,
  };

  console.log(`Attempting to remove ${username} from ${groupname}`);

  try {
    const result = await cognitoIdentityServiceProvider
      .adminRemoveUserFromGroup(params)
      .promise();
    console.log(`Removed ${username} from ${groupname}`);
    return {
      message: `Removed ${username} from ${groupname}`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// Confirms as an admin without using a confirmation code.
async function confirmUserSignUp(username) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
  };

  try {
    const result = await cognitoIdentityServiceProvider
      .adminConfirmSignUp(params)
      .promise();
    console.log(`Confirmed ${username} registration`);
    return {
      message: `Confirmed ${username} registration`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// Operations with USER : create, update, delete Disable, enable

async function createUser(user, redirectTo) {
  const { email, password, color, name } = user;

  const params = {
    DesiredDeliveryMediums: ["EMAIL"],
    TemporaryPassword: password,
    UserAttributes: [
      { Name: "email", Value: email },
      { Name: "email_verified", Value: "True" },
    ],
    Username: email,
    UserPoolId: userPoolId,
    ClientMetadata: {
      redirectTo,
    },
  };

  // Add color as a custom attribute
  if (color) {
    params.UserAttributes.push({
      Name: "custom:color",
      Value: color,
    });
  }
  if (name) {
    params.UserAttributes.push({ Name: "name", Value: name });
  }
  try {
    await cognitoIdentityServiceProvider.adminCreateUser(params).promise();
    return {
      message: `Create user ${email}`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}
async function updateUser(id, user) {
  const { email, color, name, password } = user;
  if (!email && !color && !name && !password) {
    return;
  }
  if (email || color || name) {
    const params = {
      Username: id,
      UserPoolId: userPoolId,
      UserAttributes: [],
    };
    if (email) {
      params.UserAttributes.push({ Name: "email_verified", Value: "true" });
    }
    if (color) {
      params.UserAttributes.push({
        Name: "custom:color",
        Value: color,
      });
    }
    if (name) {
      params.UserAttributes.push({ Name: "name", Value: name });
    }

    await cognitoIdentityServiceProvider
      .adminUpdateUserAttributes(params)
      .promise();
  }
  if (password) {
    const params = {
      Username: id,
      UserPoolId: userPoolId,
      Password: password,
      Permanent: true,
    };
    await cognitoIdentityServiceProvider.adminSetUserPassword(params).promise();
  }
}

async function disableUser(username) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
  };

  try {
    const result = await cognitoIdentityServiceProvider
      .adminDisableUser(params)
      .promise();
    console.log(`Disabled ${username}`);
    return {
      message: `Disabled ${username}`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function enableUser(username) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
  };

  try {
    const result = await cognitoIdentityServiceProvider
      .adminEnableUser(params)
      .promise();
    console.log(`Enabled ${username}`);
    return {
      message: `Enabled ${username}`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function getUser(username) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
  };

  console.log(`Attempting to retrieve information for ${username}`);

  try {
    const result = await cognitoIdentityServiceProvider
      .adminGetUser(params)
      .promise();
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function removeUser(username) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
  };

  console.log(`Attempting to remove ${username}`);

  try {
    const result = await cognitoIdentityServiceProvider
      .adminDeleteUser(params)
      .promise();
    console.log(`Removed ${username}`);
    return {
      message: `Removed ${username}`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function listUsersWithGroups(Limit, PaginationToken) {
  const response = await listUsers(Limit, PaginationToken);
  if (response.Users?.length > 0) {
    response.Users = await Promise.all(
      response.Users.map(async (user) => {
        const groupsResponse = await listGroupsForUser(user.Username, 25);
        const groups = groupsResponse.Groups?.map((g) => g.GroupName) ?? [];
        return {
          ...user,
          Groups: groups,
        };
      })
    );
  }
  return response;
}

async function listUsers(Limit, PaginationToken) {
  const params = {
    UserPoolId: userPoolId,
    ...(Limit && { Limit }),
    ...(PaginationToken && { PaginationToken }),
  };

  console.log("Attempting to list users");

  try {
    const result = await cognitoIdentityServiceProvider
      .listUsers(params)
      .promise();

    // Rename to NextToken for consistency with other Cognito APIs
    result.NextToken = result.PaginationToken;
    delete result.PaginationToken;

    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function listGroups(Limit, PaginationToken) {
  const params = {
    UserPoolId: userPoolId,
    ...(Limit && { Limit }),
    ...(PaginationToken && { PaginationToken }),
  };

  console.log("Attempting to list groups");

  try {
    const result = await cognitoIdentityServiceProvider
      .listGroups(params)
      .promise();

    // Rename to NextToken for consistency with other Cognito APIs
    result.NextToken = result.PaginationToken;
    delete result.PaginationToken;

    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function listGroupsForUser(username, Limit, NextToken) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
    ...(Limit && { Limit }),
    ...(NextToken && { NextToken }),
  };

  console.log(`Attempting to list groups for ${username}`);

  try {
    const result = await cognitoIdentityServiceProvider
      .adminListGroupsForUser(params)
      .promise();
    /**
     * We are filtering out the results that seem to be innapropriate for client applications
     * to prevent any informaiton disclosure. Customers can modify if they have the need.
     */
    result.Groups.forEach((val) => {
      delete val.UserPoolId,
        delete val.LastModifiedDate,
        delete val.CreationDate,
        delete val.Precedence,
        delete val.RoleArn;
    });

    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function listUsersInGroup(groupname, Limit, NextToken) {
  const params = {
    GroupName: groupname,
    UserPoolId: userPoolId,
    ...(Limit && { Limit }),
    ...(NextToken && { NextToken }),
  };

  console.log(`Attempting to list users in group ${groupname}`);

  try {
    const result = await cognitoIdentityServiceProvider
      .listUsersInGroup(params)
      .promise();
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// Signs out from all devices, as an administrator.
async function signUserOut(username) {
  const params = {
    UserPoolId: userPoolId,
    Username: username,
  };

  console.log(`Attempting to signout ${username}`);

  try {
    const result = await cognitoIdentityServiceProvider
      .adminUserGlobalSignOut(params)
      .promise();
    console.log(`Signed out ${username} from all devices`);
    return {
      message: `Signed out ${username} from all devices`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

module.exports = {
  createUser,
  addUserToGroup,
  removeUserFromGroup,
  confirmUserSignUp,
  disableUser,
  enableUser,
  getUser,
  listUsers,
  listGroups,
  listGroupsForUser,
  listUsersInGroup,
  signUserOut,
  updateUser,
  removeUser,
  listUsersWithGroups,
};
