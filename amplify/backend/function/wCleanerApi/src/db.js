const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-west-2" });
const ddb = new AWS.DynamoDB();
const uuid = require("node-uuid");

const generateSlug = (email) => {
  return email.split("@")[0];
};

const addCustomer = async (customer) => {
  if (!customer.email?.length) {
    throw "EMAIL_CANNOT_BE_EMPTY";
  }

  const emailExisting = await queryCustomersByEmail(customer.email);
  if (emailExisting.length > 0) {
    console.log("Customer already exist");
    throw "EMAIL_ALREADY_EXISTS";
  }
  const id = uuid.v1();
  const slug = generateSlug(customer.email);

  const params = {
    TableName: "customers-dev",
    Item: {
      id: {
        S: id,
      },
      name: {
        S: customer.name,
      },
      address: {
        S: customer.address,
      },
      postcode: {
        S: customer.postcode,
      },
      mainTelephone: {
        S: customer.mainTelephone,
      },
      secondTelephone: {
        S: customer.secondTelephone,
      },
      email: {
        S: customer.email,
      },
      slug: {
        S: slug,
      },
    },
  };
  const data = await ddb.putItem(params).promise();
  return {
    ...customer,
    id,
    slug,
  };
};

const editCustomer = async (id, editedCustomer) => {
  const customer = await getCustomer(id);

  if (customer === undefined) {
    throw "NOT_EXISTING_CUSTOMER";
  }

  const emailExisting = await queryCustomersByEmail(editedCustomer.email);

  if (
    emailExisting.length > 0 &&
    !emailExisting.find((item) => item.id.S === id)
  ) {
    console.log("Customer already exist");

    throw "EMAIL_ALREADY_REGISTERED";
  }
  const params = {
    TableName: "customers-dev",
    ExpressionAttributeNames: {
      "#N": "name",
      "#A": "address",
      "#P": "postcode",
      "#MP": "mainTelephone",
      "#SP": "secondTelephone",
      "#E": "email",
    },
    ExpressionAttributeValues: {
      ":name": {
        S: editedCustomer.name,
      },
      ":address": {
        S: editedCustomer.address,
      },
      ":postcode": {
        S: editedCustomer.postcode,
      },
      ":mainTelephone": {
        S: editedCustomer.mainTelephone,
      },
      ":secondTelephone": {
        S: editedCustomer.secondTelephone,
      },
      ":email": {
        S: editedCustomer.email,
      },
    },
    UpdateExpression:
      "SET #N = :name, #A = :address, #P = :postcode, #MP = :mainTelephone, #SP = :secondTelephone, #E = :email",
    Key: {
      id: { S: id },
    },
  };
  await ddb.updateItem(params).promise();
  return {
    id,
    ...editedCustomer,
  };
};

const getCustomer = async (id) => {
  const params = {
    TableName: "customers-dev",
    Key: {
      id: { S: id },
    },
  };
  const customer = await ddb.getItem(params).promise();
  return customer.Item;
};

const getCustomers = async (exclusiveStartKey, limit, name) => {
  let params = {
    TableName: "customers-dev",
    Limit: limit,
    ExclusiveStartKey: exclusiveStartKey,
  };

  if (name?.length) {
    const searchParams = {
      ExpressionAttributeNames: {
        "#N": "name",
      },
      FilterExpression: "#N = :name",
      ExpressionAttributeValues: {
        ":name": { S: name },
      },
    };
    params = {
      ...params,
      ...searchParams,
    };
  }
  const result = await ddb.scan(params).promise();
  const items = result.Items;
  const lastEvaluatedKey = result.LastEvaluatedKey;
  const nextItem = await getNextCustomer(lastEvaluatedKey);
  return {
    items,
    lastEvaluatedKey: nextItem ? lastEvaluatedKey : null,
  };
};

const getCustomerBySlug = async (slug) => {
  const params = {
    TableName: "customers-dev",
    IndexName: "search_by_slug",
    KeyConditionExpression: "slug = :slug",
    ExpressionAttributeValues: {
      ":slug": { S: slug },
    },
  };
  const result = await ddb.query(params).promise();
  if (!result.Items?.length) {
    return null;
  }
  const customer = result.Items[0];
  return customer;
};

const getNextCustomer = async (lastEvaluatedKey) => {
  const params = {
    TableName: "customers-dev",
    Limit: 1,
    ExclusiveStartKey: lastEvaluatedKey,
  };
  const result = await ddb.scan(params).promise();
  if (result.Items.length) {
    const item = result.Items[0];
    return item;
  }
  return null;
};
const queryCustomersByEmail = async (email) => {
  const params = {
    ExpressionAttributeValues: {
      ":email": { S: email },
    },
    KeyConditionExpression: "email = :email",
    TableName: "customers-dev",
    IndexName: "search_by_email",
  };
  const result = await ddb.query(params).promise();
  return result.Items;
};

const deleteCustomer = async (id) => {
  const params = {
    TableName: "customers-dev",
    Key: {
      id: { S: id },
    },
  };
  await ddb.deleteItem(params).promise();
};

module.exports = {
  addCustomer,
  editCustomer,
  getCustomerBySlug,
  getCustomers,
  getCustomer,
  queryCustomersByEmail,
  deleteCustomer,
};
