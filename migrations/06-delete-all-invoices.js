import {
  DynamoDBClient,
  DeleteItemCommand,
  QueryCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";

const TABLE_NAME = process.env.TABLE_NAME;
const client = new DynamoDBClient({ region: "eu-west-2" });

const deleteAllocator = async () => {
  const queryParams = {
    TableName: TABLE_NAME,
    ExpressionAttributeNames: {
      "#PK": "PK",
      "#SK": "SK",
    },
    ExpressionAttributeValues: {
      ":pk": {
        S: "invoice_allocator",
      },
      ":sk": {
        S: "free_",
      },
    },
    KeyConditionExpression: "#PK = :pk AND begins_with(#SK, :sk)",
  };
  const queryCommand = new QueryCommand(queryParams);
  const data = await client.send(queryCommand);
  const allocator = data.Items?.[0];
  if (allocator) {
    const deleteParams = {
      TableName: TABLE_NAME,
      Key: {
        PK: {
          S: allocator.PK.S,
        },
        SK: {
          S: allocator.SK.S,
        },
      },
    };
    const deleteCommand = new DeleteItemCommand(deleteParams);
    await client.send(deleteCommand);
  }
};

const getOnePageOfInvoices = async (exclusiveStartKey) => {
  const params = {
    TableName: TABLE_NAME,
    IndexName: "invoice_number",
    KeyConditionExpression: "#JPIK = :sk AND invoice_number > :n",
    ExpressionAttributeNames: { "#JPIK": "job_invoice_pk" },
    ExpressionAttributeValues: {
      ":sk": { N: "1" },
      ":n": { N: "0" },
    },
    ExclusiveStartKey: exclusiveStartKey,
  };

  const command = new QueryCommand(params);
  const response = await client.send(command);
  return response;
};

const getAllInvoices = async () => {
  const invoices = [];
  let exclusiveStartKey;
  let results = [];
  do {
    const page = await getOnePageOfInvoices(exclusiveStartKey);
    results = page.Items ?? [];
    if (results.length > 0) {
      invoices.push(...results);
      exclusiveStartKey = page.LastEvaluatedKey;
    }
  } while (exclusiveStartKey);
  return invoices;
};

const deleteInvoices = async () => {
  const invoices = await getAllInvoices();
  for (const invoice of invoices) {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        PK: { S: invoice.PK.S },
        SK: { S: invoice.SK.S },
      },
      ExpressionAttributeNames: {
        "#IAI": "invoice_address_id",
        "#ID": "invoice_date",
        "#IDES": "invoice_description",
        "#JIPK": "job_invoice_pk",
        "#IN": "invoice_number",
      },
      UpdateExpression: "REMOVE #IAI, #ID, #IDES, #JIPK, #IN",
    };
    const command = new UpdateItemCommand(params);
    await client.send(command);
  }
};

(async () => {
  try {
    await deleteAllocator();
    await deleteInvoices();
  } catch (error) {
    console.error("Internal Error", error);
  }
})();
