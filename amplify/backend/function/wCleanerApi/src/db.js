const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-west-2" });
const ddb = new AWS.DynamoDB();
const uuid = require("node-uuid");

const TABLE_NAME = "wcleaner-dev";
const PAGE_SIZE = 5;
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
  await ddb.putItem(params).promise();
  return {
    ...customer,
    id,
    slug,
  };
};

const addJobType = async (jobType) => {
  if (!jobType.name?.length) {
    throw "NAME_CANNOT_BE_EMPTY";
  }
  if (!jobType.color?.length) {
    throw "COLOR_CANNOT_BE_EMPTY";
  }
  const id = uuid.v1();
  const params = {
    TableName: TABLE_NAME,
    Item: {
      PK: {
        S: `job_type_${id}`,
      },
      SK: {
        S: "definition",
      },
      name: {
        S: jobType.name,
      },
      color: {
        S: jobType.color,
      },
    },
  };
  await ddb.putItem(params).promise();
  return {
    ...jobType,
    id,
  };
};

const editCustomer = async (id, editedCustomer) => {
  const customer = await getCustomer(id);

  if (customer === undefined) {
    throw "NOT_EXISTING_CUSTOMER";
  }

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

const getCustomers = async (filters, pagination) => {
  const { exclusiveStartKey, limit, enabled } = pagination;

  const { searchInput } = filters;
  let params = {
    TableName: TABLE_NAME,

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

  if (enabled) {
    params.Limit = limit;
    params.ExclusiveStartKey = exclusiveStartKey;
  }

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

  let lastEvaluatedKey;

  if (enabled) {
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
    lastEvaluatedKey = nextItem ? result.LastEvaluatedKey : null;
  }

  return {
    items,
    lastEvaluatedKey,
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

const addCustomerJob = async (customerId, job, assignedTo) => {
  if (!(await getCustomer(customerId))) {
    throw "CUSTOMER_NOT_FOUND";
  }
  const jobId = uuid.v1();
  const params = {
    TableName: TABLE_NAME,
    Item: {
      PK: { S: `customer_${customerId}` },
      SK: { S: `job_${jobId}` },
      assigned_to: {
        S: assignedTo,
      },
      start: {
        N: job.start.toString(),
      },
      end: {
        N: job.end.toString(),
      },
      price: { N: job.price.toString() },
      job_start_time_pk: {
        N: "1",
      },
    },
  };
  await ddb.putItem(params).promise();
  return { ...job, id: jobId, assignedTo: { sub: assignedTo } };
};

//GET JOBS
const getJobs = async (filters, order, exclusiveStartKey, paginate) => {
  const { start, end, assignedTo } = filters;
  const DEFAULT_FILTER_EXPRESSION = "begins_with(#SK, :sk)";
  const params = {
    TableName: TABLE_NAME,
    IndexName: "job_start_time",
    ScanIndexForward: order !== "desc",
    ExpressionAttributeNames: {
      "#SK": "SK",
      "#JSTPK": "job_start_time_pk",
    },
    ExpressionAttributeValues: {
      ":sk": { S: "job_" },
      ":aggregator": { N: "1" },
    },

    FilterExpression: DEFAULT_FILTER_EXPRESSION,
    KeyConditionExpression: "#JSTPK = :aggregator",
  };

  if (paginate) {
    params.ExclusiveStartKey = exclusiveStartKey;
    params.Limit = PAGE_SIZE;
  }
  const filterExpressions = [];
  if (assignedTo) {
    const filterExpression = "#AT = :assigned_to";
    params.ExpressionAttributeNames["#AT"] = "assigned_to";
    params.ExpressionAttributeValues[":assigned_to"] = { S: assignedTo };
    filterExpressions.push(filterExpression);
  }
  if (start && end) {
    params.ExpressionAttributeNames["#S"] = "start";
    params.ExpressionAttributeValues[":start"] = {
      N: start.toString(),
    };
    params.ExpressionAttributeValues[":end"] = {
      N: end.toString(),
    };
    params.KeyConditionExpression = `${params.KeyConditionExpression} AND #S BETWEEN :start AND :end`;
  } else if (start) {
    params.ExpressionAttributeNames["#S"] = "start";
    params.ExpressionAttributeValues[":start"] = {
      N: start.toString(),
    };
    params.KeyConditionExpression = `${params.KeyConditionExpression} AND #S >= :start`;
  } else if (end) {
    params.ExpressionAttributeNames["#S"] = "start";
    params.ExpressionAttributeValues[":end"] = {
      N: end.toString(),
    };
    params.KeyConditionExpression = `${params.KeyConditionExpression} AND #S <= :end`;
  }
  if (filterExpressions.length) {
    params.FilterExpression = [...filterExpressions, DEFAULT_FILTER_EXPRESSION]
      .map((e) => `(${e})`)
      .join(" AND ");
  }
  let result = await ddb.query(params).promise();
  const items = result.Items;
  let lastEvaluatedKey;

  if (paginate) {
    // Extract enough items to fill a page
    while (result.LastEvaluatedKey && items.length < PAGE_SIZE) {
      result = await ddb
        .query({
          ...params,
          ExclusiveStartKey: result.LastEvaluatedKey,
          Limit: PAGE_SIZE - items.length,
        })
        .promise();
      items.push(...result.Items);
    }
    const nextItem = await ddb
      .query({
        ...params,
        ExclusiveStartKey: result.LastEvaluatedKey,
        Limit: 1,
      })
      .promise();
    if (nextItem.Items.length > 0) {
      lastEvaluatedKey = result.LastEvaluatedKey;
    }
  } else {
    // Extract all items
    while (result.LastEvaluatedKey && result.Items.length > 0) {
      result = await ddb
        .query({
          ...params,
          ExclusiveStartKey: result.LastEvaluatedKey,
        })
        .promise();
      items.push(...result.Items);
    }
  }

  for (let i = 0; i < items.length; i++) {
    const job = items[i];
    const customer = await getCustomerById(job.PK.S.replace("customer_", ""));
    items[i].customer = customer;
  }
  return {
    items,
    lastEvaluatedKey,
  };
};

// GET CUSTOMER JOBS
const getCustomerJobs = async (customerId, filters, order) => {
  const { start, end, assignedTo } = filters;
  const DEFAULT_FILTER_EXPRESSION = "#PK = :pk AND begins_with(#SK, :sk)";
  const params = {
    TableName: TABLE_NAME,
    ExpressionAttributeNames: {
      "#PK": "PK",
      "#SK": "SK",
      "#JSTPK": "job_start_time_pk",
    },
    ExpressionAttributeValues: {
      ":pk": { S: `customer_${customerId}` },
      ":sk": { S: "job_" },
      ":aggregator": { N: "1" },
    },
    IndexName: "job_start_time",
    KeyConditionExpression: "#JSTPK = :aggregator",
    FilterExpression: DEFAULT_FILTER_EXPRESSION,
    ScanIndexForward: order === "asc",
  };
  const filterExpressions = [];
  if (assignedTo) {
    const filterExpression = "#AT = :assigned_to";
    params.ExpressionAttributeNames["#AT"] = "assigned_to";
    params.ExpressionAttributeValues[":assigned_to"] = { S: assignedTo };
    filterExpressions.push(filterExpression);
  }
  if (start && end) {
    params.ExpressionAttributeNames["#S"] = "start";
    params.ExpressionAttributeValues[":start"] = {
      N: start.toString(),
    };

    params.ExpressionAttributeValues[":end"] = {
      N: end.toString(),
    };
    params.KeyConditionExpression = `${params.KeyConditionExpression} AND #S BETWEEN :start AND :end`;
  } else if (start) {
    params.ExpressionAttributeNames["#S"] = "start";
    params.ExpressionAttributeValues[":start"] = {
      N: start.toString(),
    };
    params.KeyConditionExpression = `${params.KeyConditionExpression} AND #S >= :start`;
  } else if (end) {
    params.ExpressionAttributeNames["#S"] = "start";
    params.ExpressionAttributeValues[":end"] = {
      N: end.toString(),
    };
    params.KeyConditionExpression = `${params.KeyConditionExpression} AND #S <= :end`;
  }
  if (filterExpressions.length) {
    params.FilterExpression = [...filterExpressions, DEFAULT_FILTER_EXPRESSION]
      .map((e) => `(${e})`)
      .join(" AND ");
  }
  let result = await ddb.query(params).promise();

  const items = [...result.Items];
  // console.log(JSON.stringify({ items }, null, 2));
  return {
    items: items,
  };
};

//EDIT JOB

const editJobFromCustomer = async (customerId, jobId, updatedJob) => {
  console.log("Update Job :");
  console.log(JSON.stringify({ updatedJob }, 2, null));
  const params = {
    ExpressionAttributeNames: {
      "#ST": "start",
      "#ET": "end",
      "#P": "price",
      "#A": "assigned_to",
    },
    ExpressionAttributeValues: {
      ":start": {
        N: updatedJob.start.toString(),
      },
      ":end": {
        N: updatedJob.end.toString(),
      },
      ":price": {
        N: updatedJob.price.toString(),
      },
      ":assigned_to": {
        S: updatedJob.assigned_to,
      },
    },
    Key: {
      PK: {
        S: `customer_${customerId}`,
      },
      SK: {
        S: `job_${jobId}`,
      },
    },
    TableName: TABLE_NAME,
    UpdateExpression:
      "SET #ST = :start, #ET = :end, #P = :price, #A=:assigned_to",
  };
  await ddb.updateItem(params).promise();
  return updatedJob;
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
const getAllRows = async (params) => {
  let result = await ddb.scan(params).promise();
  const items = result.Items;
  console.log(`Items : ${items}`);
  while (result.LastEvaluatedKey) {
    const exclusiveStartKey = result.LastEvaluatedKey;
    params = {
      ...params,
      ExclusiveStartKey: exclusiveStartKey,
    };
    result = await ddb.scan(params).promise();
    items.push(...result.Items);
  }
  return items;
};
const getJobIDs = async (customerId) => {
  const params = {
    FilterExpression: "#CI = :ci",
    ExpressionAttributeNames: {
      "#CI": "customer_id",
    },
    ExpressionAttributeValues: {
      ":ci": { S: customerId },
    },
    TableName: TABLE_NAME,
    Limit: PAGE_SIZE,
  };
  const items = await getAllRows(params);

  const jobIds = items.map((item) => item.PK.S.split("_")[1]);
  return jobIds;
};

module.exports = {
  addCustomer,
  addCustomerJob,
  addJobType,
  editCustomer,
  getCustomerBySlug,
  getCustomerById,
  getCustomers,
  getCustomer,
  getCustomerJobs,
  getJobs,
  queryCustomersByEmail,
  deleteCustomer,
  editJobFromCustomer,
  deleteJobFromCustomer,
};
