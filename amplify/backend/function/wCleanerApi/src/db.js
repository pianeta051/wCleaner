const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-west-2" });
const ddb = new AWS.DynamoDB();
const uuid = require("node-uuid");

const TABLE_NAME = "wcleaner-dev";

const generateSlug = (email) => {
  return email.split("@")[0];
};

const addCustomer = async (customer) => {
  if (!customer.email?.length) {
    throw "EMAIL_CANNOT_BE_EMPTY";
  }
  if (!customer.name?.length) {
    throw "NAME_CANNOT_BE_EMPTY";
  }

  const emailExisting = await queryCustomersByEmail(customer.email);
  if (emailExisting.length > 0) {
    console.log("Customer already exist");
    throw "EMAIL_ALREADY_EXISTS";
  }
  const id = uuid.v1();
  const slug = generateSlug(customer.email);

  const params = {
    TableName: TABLE_NAME,
    Item: {
      PK: {
        S: `customer_${id}`,
      },
      SK: {
        S: "profile",
      },
      name: {
        S: customer.name,
      },
      name_lowercase: {
        S: customer.name?.toLowerCase(),
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
      email_lowercase: {
        S: customer.email?.toLowerCase(),
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

  // const emailExisting = await queryCustomersByEmail(editedCustomer.email);

  // if (
  //   emailExisting.length > 0 &&
  //   !emailExisting.find((item) => item.PK.S === `customer_${id}`)
  // ) {
  //   throw "EMAIL_ALREADY_REGISTERED";
  // }

  const params = {
    TableName: TABLE_NAME,
    ExpressionAttributeNames: {
      "#N": "name",
      "#NL": "name_lowercase",
      "#A": "address",
      "#P": "postcode",
      "#MP": "mainTelephone",
      "#SP": "secondTelephone",
      "#E": "email",
      "#EL": "email_lowercase",
      "#SL": "slug",
    },
    ExpressionAttributeValues: {
      ":name": {
        S: editedCustomer.name,
      },
      ":name_lowercase": {
        S: editedCustomer.name?.toLowerCase(),
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
      ":email_lowercase": {
        S: editedCustomer.email?.toLowerCase(),
      },
      ":slug": {
        S: editedCustomer.slug,
      },
    },
    UpdateExpression:
      "SET #N = :name, #A = :address, #P = :postcode, #MP = :mainTelephone, #SP = :secondTelephone, #E = :email, #NL = :name_lowercase, #EL = :email_lowercase, #SL = :slug",
    Key: {
      PK: { S: `customer_${id}` },
      SK: { S: "profile" },
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
    TableName: TABLE_NAME,
    Key: {
      PK: { S: `customer_${id}` },
      SK: { S: "profile" },
    },
  };
  const customer = await ddb.getItem(params).promise();
  return customer.Item;
};

const getCustomers = async (exclusiveStartKey, limit, searchInput) => {
  let params = {
    TableName: TABLE_NAME,
    Limit: limit,
    ExclusiveStartKey: exclusiveStartKey,
    FilterExpression: "begins_with(#PK, :pk) AND #SK = :sk",
    ExpressionAttributeNames: {
      "#PK": "PK",
      "#SK": "SK",
    },
    ExpressionAttributeValues: {
      ":pk": { S: "customer_" },
      ":sk": { S: "profile" },
    },
  };

  if (searchInput?.length) {
    const searchParams = {
      ExpressionAttributeNames: {
        "#NL": "name_lowercase",
        "#EL": "email_lowercase",
        "#A": "address",
        "#P": "postcode",
        ...params.ExpressionAttributeNames,
      },
      FilterExpression:
        params.FilterExpression +
        " AND (contains(#NL, :name) OR contains(#EL, :email) OR contains(#A, :address) OR contains(#P, :postcode))",
      ExpressionAttributeValues: {
        ":name": { S: searchInput.toLowerCase() },
        ":email": { S: searchInput.toLowerCase() },
        ":address": { S: searchInput.toLowerCase() },
        ":postcode": { S: searchInput.toLowerCase() },
        ...params.ExpressionAttributeValues,
      },
    };
    params = {
      ...params,
      ...searchParams,
    };
  }
  let result = await ddb.scan(params).promise();
  const items = result.Items;

  while (result.LastEvaluatedKey && items.length < limit) {
    const exclusiveStartKey = result.LastEvaluatedKey;
    params = {
      ...params,
      ExclusiveStartKey: exclusiveStartKey,
      Limit: limit - items.length,
    };
    result = await ddb.scan(params).promise();
    items.push(...result.Items);
  }

  const nextItem = await getNextCustomer(result.LastEvaluatedKey);
  return {
    items,
    lastEvaluatedKey: nextItem ? result.LastEvaluatedKey : null,
  };
};

const getCustomerBySlug = async (slug) => {
  const params = {
    TableName: TABLE_NAME,
    IndexName: "customer_slug",
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

const getCustomerById = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: { S: `customer_${id}` },
      SK: { S: "profile" },
    },
  };
  const customer = await ddb.getItem(params).promise();
  return customer.Item;
};

const getNextCustomer = async (lastEvaluatedKey) => {
  const params = {
    TableName: TABLE_NAME,
    Limit: 5,
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
    TableName: TABLE_NAME,
    IndexName: "customer_email",
  };
  const result = await ddb.query(params).promise();
  return result.Items;
};

const deleteCustomer = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: { S: `customer_${id}` },
      SK: { S: "profile" },
    },
  };
  await ddb.deleteItem(params).promise();
};

/// JOBS

//ADD JOB TO CUSTOMER

const addCustomerJob = async (customerId, job) => {
  if (!(await getCustomer(customerId))) {
    throw "Customer not found";
  }
  const jobId = uuid.v1();
  const params = {
    TableName: TABLE_NAME,
    Item: {
      PK: { S: `customer_${customerId}` },
      SK: { S: `job_${jobId}` },
      date: { S: job.date },
      time: { S: job.time },
      price: { S: job.price.toString() },
    },
  };
  await ddb.putItem(params).promise();
  return { ...job, id: jobId };
};

// GET JOBS
const getCustomerJobs = async (customerId, exclusiveStartKey) => {
  const PAGE_SIZE = 5;
  const params = {
    TableName: TABLE_NAME,
    ExpressionAttributeValues: {
      ":pk": { S: `customer_${customerId}` },
      ":sk": { S: "job_" },
    },
    ExpressionAttributeNames: {
      "#PK": "PK",
      "#SK": "SK",
    },
    KeyConditionExpression: "#PK = :pk AND begins_with(#SK, :sk)",
    Limit: PAGE_SIZE,
    ExclusiveStartKey: exclusiveStartKey,
  };
  const result = await ddb.query(params).promise();
  const nextItem = await getNextValue(result.LastEvaluatedKey, {
    filterExpression: params.KeyConditionExpression,
    expressionAttributeNames: params.ExpressionAttributeNames,
    expressionAttributeValues: params.ExpressionAttributeValues,
  });
  return {
    items: result.Items,
    lastEvaluatedKey: nextItem ? result.LastEvaluatedKey : null,
  };
};

//DELETE JOB
const deleteJobFromCustomer = async (customerId, jobId) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: { S: `customer_${customerId}` },
      SK: { S: `job_${jobId}` },
    },
  };
  await ddb.deleteItem(params).promise();
};

const getNextValue = async (lastEvaluatedKey, filter) => {
  const params = {
    TableName: TABLE_NAME,
    Limit: 1,
    ExclusiveStartKey: lastEvaluatedKey,
    FilterExpression: filter.filterExpression,
    ExpressionAttributeNames: filter.expressionAttributeNames,
    ExpressionAttributeValues: filter.expressionAttributeValues,
  };
  const result = await ddb.scan(params).promise();
  if (result.Items.length) {
    const item = result.Items[0];
    return item;
  }
  return null;
};

module.exports = {
  addCustomer,
  addCustomerJob,
  editCustomer,
  getCustomerBySlug,
  getCustomerById,
  getCustomers,
  getCustomer,
  getCustomerJobs,
  queryCustomersByEmail,
  deleteCustomer,
  deleteJobFromCustomer,
};
