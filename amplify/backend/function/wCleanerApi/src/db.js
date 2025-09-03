const AWS = require("aws-sdk");
AWS.config.update({ region: "eu-west-2" });
const ddb = new AWS.DynamoDB();
const uuid = require("node-uuid");
const { mapCustomer } = require("./mappers");

const TABLE_NAME = `wcleaner-${process.env.ENV}`;
const PAGE_SIZE = 5;
const generateSlug = async (email, name) => {
  const nameSlug = name
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .split(" ")
    .join("-");
  const emailSlug = email?.split("@")[0].toLowerCase();
  const baseSlug = emailSlug.lenght ? emailSlug : nameSlug;
  let slug = baseSlug;
  let counter = 2;

  // Check if slug already exists
  while (await slugExists(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

const slugExists = async (slug) => {
  const existingCustomer = await getCustomerBySlug(slug);
  return !!existingCustomer;
};

const addCustomer = async (customer) => {
  if (!customer.name?.length) {
    throw "NAME_CANNOT_BE_EMPTY";
  }

  const postcodeParts = customer.postcode.split(/\s/g);
  if (postcodeParts.filter((part) => !!part).length !== 2) {
    throw "INVALID_POSTCODE";
  }

  const outcode = postcodeParts[0];

  if (customer.email) {
    const emailExisting = await queryCustomersByEmail(customer.email);
    if (emailExisting.length > 0) {
      throw "EMAIL_ALREADY_EXISTS";
    }
  }

  const id = uuid.v1();
  const slug = await generateSlug(customer.email, customer.name);

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
      outcode: {
        S: outcode.toUpperCase(),
      },
      mainTelephone: {
        S: customer.mainTelephone,
      },
      secondTelephone: {
        S: customer.secondTelephone,
      },
      slug: {
        S: slug,
      },
      status: {
        S: "active",
      },
    },
  };

  if (customer.email) {
    params.Item["email"] = {
      S: customer.email,
    };
    params.Item["email_lowercase"] = {
      S: customer.email.toLowerCase(),
    };
  }
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
  const nameExisting = await queryJobTypeByName(jobType.name);
  if (nameExisting.length > 0) {
    throw "NAME_ALREADY_EXISTS";
  }
  const colorExisting = await queryJobTypeByColor(jobType.color);

  if (colorExisting.length > 0) {
    throw "COLOR_ALREADY_EXISTS";
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
      name_lowercase: {
        S: jobType.name.toLowerCase(),
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
  const existing = await getCustomerById(id);
  if (!existing) {
    throw "NOT_EXISTING_CUSTOMER";
  }

  const updateExprParts = [];
  const exprAttrNames = {};
  const exprAttrValues = {};

  if (editedCustomer.name !== undefined) {
    exprAttrNames["#N"] = "name";
    exprAttrNames["#NL"] = "name_lowercase";
    exprAttrValues[":name"] = { S: editedCustomer.name };
    exprAttrValues[":name_lowercase"] = {
      S: editedCustomer.name.toLowerCase(),
    };
    updateExprParts.push("#N = :name", "#NL = :name_lowercase");
  }

  if (editedCustomer.address !== undefined) {
    exprAttrNames["#A"] = "address";
    exprAttrValues[":address"] = { S: editedCustomer.address };
    updateExprParts.push("#A = :address");
  }

  if (editedCustomer.postcode !== undefined) {
    const postcodeParts = editedCustomer.postcode.split(/\s/g);
    if (postcodeParts.filter((part) => !!part).length !== 2) {
      throw "INVALID_POSTCODE";
    }
    const outcode = postcodeParts[0];
    exprAttrNames["#P"] = "postcode";
    exprAttrNames["#OC"] = "outcode";
    exprAttrValues[":postcode"] = { S: editedCustomer.postcode };
    exprAttrValues[":outcode"] = { S: outcode };
    updateExprParts.push("#P = :postcode", "#OC = :outcode");
  }

  if (editedCustomer.mainTelephone !== undefined) {
    exprAttrNames["#MP"] = "mainTelephone";
    exprAttrValues[":mainTelephone"] = { S: editedCustomer.mainTelephone };
    updateExprParts.push("#MP = :mainTelephone");
  }

  if (editedCustomer.secondTelephone !== undefined) {
    exprAttrNames["#SP"] = "secondTelephone";
    exprAttrValues[":secondTelephone"] = { S: editedCustomer.secondTelephone };
    updateExprParts.push("#SP = :secondTelephone");
  }

  if (editedCustomer.email) {
    exprAttrNames["#E"] = "email";
    exprAttrNames["#EL"] = "email_lowercase";
    exprAttrValues[":email"] = { S: editedCustomer.email };
    exprAttrValues[":email_lowercase"] = {
      S: editedCustomer.email.toLowerCase(),
    };
    updateExprParts.push("#E = :email", "#EL = :email_lowercase");
  }

  if (editedCustomer.slug !== undefined) {
    exprAttrNames["#SL"] = "slug";
    exprAttrValues[":slug"] = { S: editedCustomer.slug };
    updateExprParts.push("#SL = :slug");
  }

  if (editedCustomer.fileUrls !== undefined) {
    if (!Array.isArray(editedCustomer.fileUrls)) {
      throw "FILEURLS_MUST_BE_ARRAY";
    }
    exprAttrNames["#F"] = "fileUrls";
    exprAttrValues[":fileUrls"] = {
      L: editedCustomer.fileUrls.map((url) => ({ S: url })),
    };
    updateExprParts.push("#F = :fileUrls");
  }

  if (updateExprParts.length === 0) {
    throw "NO_VALID_FIELDS_TO_UPDATE";
  }

  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: { S: `customer_${id}` },
      SK: { S: "profile" },
    },
    UpdateExpression: `SET ${updateExprParts.join(", ")}`,
    ExpressionAttributeNames: exprAttrNames,
    ExpressionAttributeValues: exprAttrValues,
  };

  console.log(JSON.stringify(params, null, 2));

  await ddb.updateItem(params).promise();
  return {
    id,
    ...editedCustomer,
  };
};
const addCustomerAddress = async (customerId, customerAddress) => {
  if (!customerId) {
    throw new Error("CUSTOMER_NOT_FOUND");
  }

  if (
    !customerAddress.name ||
    !customerAddress.address ||
    !customerAddress.postcode
  ) {
    console.error("Invalid Address:" + JSON.stringify({ customerAddress }));
    throw new Error("INVALID_ADDRESS");
  }

  const addressWithSameName = await findAddressesByName(
    customerId,
    customerAddress.name
  );

  if (addressWithSameName?.length) {
    throw new Error("DUPLICATED_ADDRESS_NAME");
  }

  const customerAddressId = uuid.v1();
  const postcodeParts = customerAddress.postcode.split(/\s/g);
  if (postcodeParts.filter((part) => !!part).length !== 2) {
    throw "INVALID_POSTCODE";
  }

  const outcode = postcodeParts[0];

  const params = {
    TableName: TABLE_NAME,
    Item: {
      PK: { S: `customer_${customerId}` },
      SK: { S: `address_${customerAddressId}` },
      name: { S: customerAddress.name },
      address: { S: customerAddress.address },
      postcode: { S: customerAddress.postcode },
      outcode: { S: outcode },
    },
  };
  await ddb.putItem(params).promise();

  return {
    id: customerAddressId,
    ...customerAddress,
  };
};

const updateCustomerAddresses = async (customerId, cleaningAddresses) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: { S: `customer_${customerId}` },
      SK: { S: "addresses" },
    },
    UpdateExpression: "SET #cleaningAddresses = :cleaning",
    ExpressionAttributeNames: {
      "#cleaningAddresses": "cleaningAddresses",
    },
    ExpressionAttributeValues: {
      ":cleaning": {
        L: cleaningAddresses.map((addr) => ({
          M: {
            name: { S: addr.name },
            address: { S: addr.address },
            postcode: { S: addr.postcode },
          },
        })),
      },
    },
  };

  await ddb.updateItem(params).promise();
};

const findAddressesByName = async (customerId, addressName) => {
  const params = {
    TableName: TABLE_NAME,
    ExpressionAttributeNames: {
      "#PK": "PK",
      "#SK": "SK",
      "#N": "name",
    },
    ExpressionAttributeValues: {
      ":pk": { S: `customer_${customerId}` },
      ":sk": { S: "address" },
      ":n": { S: addressName },
    },
    FilterExpression: "#PK = :pk AND begins_with(#SK, :sk) AND #N = :n",
  };
  let result = await ddb.scan(params).promise();
  const items = result.Items;
  return items;
};

const getCustomers = async (filters, pagination) => {
  const { exclusiveStartKey, limit, enabled } = pagination;

  const { searchInput, outcodeFilter } = filters;
  const filterExpressions = [
    "begins_with(#PK, :pk) AND #SK = :sk AND #ST = :status",
  ];
  let params = {
    TableName: TABLE_NAME,
    ExpressionAttributeNames: {
      "#PK": "PK",
      "#SK": "SK",
      "#ST": "status",
    },
    ExpressionAttributeValues: {
      ":pk": { S: "customer_" },
      ":sk": { S: "profile" },
      ":status": { S: "active" },
    },
    IndexName: "status-index",
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
      ExpressionAttributeValues: {
        ":name": { S: searchInput.toLowerCase() },
        ":email": { S: searchInput.toLowerCase() },
        ":address": { S: searchInput.toLowerCase() },
        ":postcode": { S: searchInput.toLowerCase() },
        ...params.ExpressionAttributeValues,
      },
    };
    filterExpressions.push(
      "(contains(#NL, :name) OR contains(#EL, :email) OR contains(#A, :address) OR contains(#P, :postcode))"
    );
    params = {
      ...params,
      ...searchParams,
    };
  }

  if (Array.isArray(outcodeFilter) && outcodeFilter.length > 0) {
    const expressionAttributeNames = {
      ...params.ExpressionAttributeNames,
      "#OC": "outcode",
    };

    const expressionAttributesValues = {
      ...params.ExpressionAttributeValues,
    };
    for (let i = 0; i < outcodeFilter.length; i++) {
      const outcode = outcodeFilter[i];
      expressionAttributesValues[`:outcode${i}`] = { S: outcode };
    }
    const filterExpression = `#OC IN (${outcodeFilter
      .map((_id, index) => `:outcode${index}`)
      .join(", ")})`;
    filterExpressions.push(filterExpression);
    params = {
      ...params,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributesValues,
    };
  }

  params.FilterExpression = filterExpressions.join(" AND ");

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

const getOutcodes = async () => {
  let params = {
    TableName: TABLE_NAME,
    FilterExpression: "begins_with(#PK, :pk) AND #SK = :sk AND #ST = :status",
    ExpressionAttributeNames: {
      "#PK": "PK",
      "#SK": "SK",
      "#ST": "status",
    },
    ExpressionAttributeValues: {
      ":pk": { S: "customer_" },
      ":sk": { S: "profile" },
      ":status": { S: "active" },
    },
    IndexName: "status-index",
  };

  let result = await ddb.scan(params).promise();
  const items = result.Items;

  while (result.LastEvaluatedKey) {
    const exclusiveStartKey = result.LastEvaluatedKey;
    params = {
      ...params,
      ExclusiveStartKey: exclusiveStartKey,
      Limit: limit - items.length,
    };
    result = await ddb.scan(params).promise();
    items.push(...result.Items);
  }
  const outcodes = [];
  for (let index = 0; index < items.length; index++) {
    const outcode = items[index].outcode?.S;
    if (outcode && !outcodes.includes(outcode)) {
      outcodes.push(outcode);
    }
  }

  return {
    outcodes,
  };
};

const getCleaningAddresses = async (customerId) => {
  const params = {
    TableName: TABLE_NAME,
    ExpressionAttributeNames: {
      "#PK": "PK",
      "#SK": "SK",
    },
    FilterExpression: "begins_with(#SK, :sk) AND #PK = :pk",
    ExpressionAttributeValues: {
      ":pk": { S: `customer_${customerId}` },
      ":sk": { S: "address_" },
    },
  };

  const result = await ddb.scan(params).promise();
  return result.Items;
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

const queryJobTypeByName = async (name) => {
  const params = {
    ExpressionAttributeNames: {
      "#N": "name_lowercase",
      "#PK": "PK",
      "#SK": "SK",
    },
    ExpressionAttributeValues: {
      ":name": { S: name.toLowerCase() },
      ":pk": { S: "job_type_" },
      ":sk": { S: "definition" },
    },
    KeyConditionExpression: "#N = :name",
    FilterExpression: "begins_with(#PK, :pk) AND #SK = :sk",
    TableName: TABLE_NAME,
    IndexName: "job_type_name",
  };
  const result = await ddb.query(params).promise();

  return result.Items;
};

const queryJobTypeByColor = async (color) => {
  const params = {
    ExpressionAttributeValues: {
      ":color": { S: color },
    },
    KeyConditionExpression: "color = :color",
    TableName: TABLE_NAME,
    IndexName: "job_type_color",
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
    UpdateExpression: `
      SET #status = :status,
          #address = :address,
          #mainTelephone = :mainTelephone,
          #secondTelephone = :secondTelephone
      REMOVE #email
    `,
    ExpressionAttributeNames: {
      "#status": "status",
      "#address": "address",
      "#email": "email",
      "#mainTelephone": "mainTelephone",
      "#secondTelephone": "secondTelephone",
    },
    ExpressionAttributeValues: {
      ":status": { S: "deleted" },
      ":mainTelephone": { S: "" },
      ":secondTelephone": { S: "" },
      ":address": { S: "" },
    },
  };

  await ddb.updateItem(params).promise();
};

/// JOBS

//ADD JOB TO CUSTOMER

const addCustomerJob = async (customerId, job, assignedTo) => {
  if (!(await getCustomerById(customerId))) {
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
      job_type_id: { S: job.jobTypeId },
    },
  };
  await ddb.putItem(params).promise();
  return { ...job, id: jobId, assignedTo: { sub: assignedTo } };
};

//GET JOBS

const getJob = async (customerId, jobId) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: { S: `customer_${customerId}` },
      SK: { S: `job_${jobId}` },
    },
  };
  const job = await ddb.getItem(params).promise();
  const customer = await getCustomerById(
    job.Item.PK.S.replace("customer_", "")
  );
  const item = {
    ...job.Item,
    customer,
  };
  return item;
};
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

//GET JOB TYPES
const getJobType = async (jobTypeId) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: { S: `job_type_${jobTypeId}` },
      SK: { S: "definition" },
    },
  };
  const job = await ddb.getItem(params).promise();
  return job.Item;
};
const getJobTypes = async () => {
  const params = {
    TableName: TABLE_NAME,
    ExpressionAttributeNames: {
      "#PK": "PK",
      "#SK": "SK",
    },
    ExpressionAttributeValues: {
      ":sk": { S: "definition" },
      ":pk": { S: "job_type" },
    },
    FilterExpression: "begins_with(#PK, :pk) AND #SK = :sk",
  };

  let result = await ddb.scan(params).promise();
  const items = result.Items;

  return {
    items,
  };
};

//EDIT JOB TYPE
const editJobType = async (jobTypeId, updatedJobType) => {
  if (!updatedJobType.name?.length) {
    throw "NAME_CANNOT_BE_EMPTY";
  }
  if (!updatedJobType.color?.length) {
    throw "COLOR_CANNOT_BE_EMPTY";
  }
  const nameExisting = await queryJobTypeByName(updatedJobType.name);
  if (nameExisting.length > 0) {
    if (nameExisting[0].PK.S !== `job_type_${jobTypeId}`) {
      throw "NAME_ALREADY_EXISTS";
    }
  }

  const colorExisting = await queryJobTypeByColor(updatedJobType.color);
  if (colorExisting.length > 0) {
    if (colorExisting[0].PK.S !== `job_type_${jobTypeId}`) {
      throw "COLOR_ALREADY_EXISTS";
    }
  }

  const params = {
    ExpressionAttributeNames: {
      "#N": "name",
      "#C": "color",
    },
    ExpressionAttributeValues: {
      ":name": {
        S: updatedJobType.name,
      },
      ":color": {
        S: updatedJobType.color,
      },
    },
    Key: {
      PK: {
        S: `job_type_${jobTypeId}`,
      },
      SK: {
        S: `definition`,
      },
    },
    TableName: TABLE_NAME,
    UpdateExpression: "SET #N = :name, #C = :color",
  };
  await ddb.updateItem(params).promise();
  return updatedJobType;
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
  return {
    items: items,
  };
};

//EDIT JOB

const editJobFromCustomer = async (customerId, jobId, updatedJob) => {
  const params = {
    ExpressionAttributeNames: {
      "#ST": "start",
      "#ET": "end",
      "#P": "price",
      "#A": "assigned_to",
      "#JT": "job_type_id",
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
      ":job_type_id": {
        S: updatedJob.jobTypeId,
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
      "SET #ST = :start, #ET = :end, #P = :price, #A=:assigned_to, #JT=:job_type_id",
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

const deleteJobType = async (jobTypeId) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: { S: `job_type_${jobTypeId}` },
      SK: { S: "definition" },
    },
  };
  await ddb.deleteItem(params).promise();
  const queryParams = {
    TableName: TABLE_NAME,
    ExpressionAttributeNames: {
      "#JTI": "job_type_id",
    },
    ExpressionAttributeValues: {
      ":job_type_id": {
        S: jobTypeId,
      },
    },
    KeyConditionExpression: "#JTI = :job_type_id",
    IndexName: "job_type_id",
  };
  const result = await ddb.query(queryParams).promise();
  if (Array.isArray(result?.Items)) {
    for (const jobItem of result.Items) {
      const updateParams = {
        ExpressionAttributeNames: {
          "#JTI": "job_type_id",
        },
        Key: {
          PK: {
            S: jobItem.PK.S,
          },
          SK: {
            S: jobItem.SK.S,
          },
        },
        TableName: TABLE_NAME,
        UpdateExpression: "REMOVE #JTI",
      };
      await ddb.updateItem(updateParams).promise();
    }
  }
};

const getAllRows = async (params) => {
  let result = await ddb.scan(params).promise();
  const items = result.Items;
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

//FILES
//ADD FILE

const addFile = async (fileBuffer, path) => {
  if (!fileBuffer || !fileBuffer.length) {
    throw "FILE_CANNOT_BE_EMPTY";
  }

  if (!path?.length) {
    throw "PATH_CANNOT_BE_EMPTY";
  }

  const id = uuidv1();
  const timestamp = new Date().toISOString();

  const params = {
    TableName: TABLE_NAME,
    Item: {
      PK: { S: `file_${id}` },
      SK: { S: "meta" },
      path: { S: path },
      size: { N: String(fileBuffer.length) },
      uploadedAt: { S: timestamp },
    },
  };

  await ddb.putItem(params).promise();

  return {
    id,
    path,
    size: fileBuffer.length,
    uploadedAt: timestamp,
  };
};

//CUSTOMER NOTES
const addCustomerNote = async (customerId, note) => {
  const customer = await getCustomerById(customerId);
  if (!customer) {
    throw new Error("CUSTOMER_NOT_FOUND");
  }

  if (!note.title || !note.content || !note.author || !note.timestamp) {
    throw new Error(
      "Invalid note: missing required fields. " + JSON.stringify({ note })
    );
  }

  const noteId = uuid.v1();

  const dynamoNote = {
    id: { S: noteId },
    title: { S: note.title },
    content: { S: note.content },
    author: { S: note.author },
    timestamp: { N: note.timestamp.toString() },
    isFavourite: { BOOL: note.isFavourite },
    updatedAt: { N: note.timestamp.toString() },
    updatedBy: { S: note.author },
  };

  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: { S: `customer_${customerId}` },
      SK: { S: `profile` },
    },
    UpdateExpression:
      "SET notes = list_append(if_not_exists(notes, :empty_list), :new_note)",
    ExpressionAttributeValues: {
      ":empty_list": { L: [] },
      ":new_note": { L: [{ M: dynamoNote }] },
    },
    ReturnValues: "UPDATED_NEW",
  };

  await ddb.updateItem(params).promise();

  return {
    id: noteId,
    ...note,
    updatedAt: note.timestamp,
    updatedBy: note.author,
  };
};

const editCustomerNote = async (customerId, noteId, note) => {
  const customer = mapCustomer(await getCustomerById(customerId));
  if (!customer.notes?.length) {
    throw new Error("NOTE_NOT_FOUND");
  }
  const index = customer.notes.findIndex((note) => note.id === noteId);
  if (index === -1) {
    throw new Error("NOTE_NOT_FOUND");
  }
  const existingNote = customer.notes[index];

  const dynamoNote = {
    id: { S: noteId },
    title: { S: note.title },
    content: { S: note.content },
    author: { S: existingNote.author },
    timestamp: { N: existingNote.timestamp.toString() },
    isFavourite: { BOOL: note.isFavourite },
    updatedAt: { N: Date.now().toString() },
    updatedBy: { S: note.updatedBy },
  };

  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: { S: `customer_${customerId}` },
      SK: { S: `profile` },
    },
    UpdateExpression: `SET notes[${index}] = :new_note`,
    ExpressionAttributeValues: {
      ":new_note": { M: dynamoNote },
    },
    ReturnValues: "UPDATED_NEW",
  };

  await ddb.updateItem(params).promise();

  return {
    id: noteId,
    ...existingNote,
    ...note,
    updatedAt: Date.now(),
    updatedBy: note.author,
  };
};

const deleteCustomerNote = async (customerId, noteId) => {
  // paramas
  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: { S: `customer_${customerId}` },
      SK: { S: "profile" },
    },
    ProjectionExpression: "notes",
  };

  const result = await ddb.getItem(params).promise();

  if (!result.Item || !result.Item.notes || !result.Item.notes.L) {
    throw "NOTE_NOT_FOUND";
  }

  const notes = result.Item.notes.L;

  // Find the index of the note with matching id
  const indexToRemove = notes.findIndex((n) => n.M?.id?.S === noteId);

  if (indexToRemove === -1) {
    throw "NOTE_NOT_FOUND";
  }

  // Remove the note at that index using UpdateExpression
  const updateParams = {
    TableName: TABLE_NAME,
    Key: {
      PK: { S: `customer_${customerId}` },
      SK: { S: "profile" },
    },
    UpdateExpression: `REMOVE notes[${indexToRemove}]`,
  };

  await ddb.updateItem(updateParams).promise();
};

module.exports = {
  addCustomer,
  addCustomerAddress,
  addCustomerJob,
  addCustomerNote,
  addJobType,
  editCustomer,
  editCustomerNote,
  editJobType,
  getCleaningAddresses,
  getCustomerBySlug,
  getCustomerById,
  getCustomers,
  getCustomerJobs,
  getJob,
  getJobs,
  getJobType,
  getJobTypes,
  getOutcodes,
  queryCustomersByEmail,
  deleteCustomer,
  deleteJobType,
  deleteCustomerNote,
  editJobFromCustomer,
  deleteJobFromCustomer,
  addFile,
};
