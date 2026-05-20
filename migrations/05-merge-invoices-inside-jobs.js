import {
  DynamoDBClient,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";

const TABLE_NAME = process.env.TABLE_NAME;
const client = new DynamoDBClient({ region: "eu-west-2" });

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

const getOnePageOfInvoices = async (exclusiveStartKey) => {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
    ExpressionAttributeNames: {
      "#SK": "SK",
    },
    FilterExpression: "#SK = :sk",
    ExpressionAttributeValues: {
      ":sk": { S: "invoice" },
    },
    ExclusiveStartKey: exclusiveStartKey,
  });

  const data = await client.send(command);
  return data;
};

const getJob = async (jobId) => {
  let data;
  let exclusiveStartKey;
  do {
    const params = {
      TableName: TABLE_NAME,
      ExpressionAttributeNames: {
        "#SK": "SK",
      },
      FilterExpression: "#SK = :sk",
      ExpressionAttributeValues: {
        ":sk": { S: `job_${jobId}` },
      },
      ExclusiveStartKey: exclusiveStartKey,
    };
    const command = new ScanCommand(params);
    data = await client.send(command);

    if (!data.Items?.[0]) exclusiveStartKey = data.LastEvaluatedKey;
  } while (exclusiveStartKey);

  const job = data.Items?.[0];
  if (!job) {
    throw Error(`Job with ID ${jobId} does not exist`);
  }
  return job;
};

const addInvoiceToJob = async (customerId, jobId, invoiceData) => {
  const { addressId, date, invoiceDescription, invoiceNumber } = invoiceData;
  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: { S: `customer_${customerId}` },
      SK: { S: `job_${jobId}` },
    },
    UpdateExpression:
      "SET #ID = :description, #IN = :number, #JPIK = :jpik, #IA = :address_id, #IDT = :date",
    ExpressionAttributeNames: {
      "#IA": "invoice_address_id",
      "#ID": "invoice_description",
      "#IDT": "invoice_date",
      "#IN": "invoice_number",
      "#JPIK": "job_invoice_pk",
    },
    ExpressionAttributeValues: {
      ":description": { S: invoiceDescription },
      ":number": { N: invoiceNumber },
      ":jpik": { N: "1" },
      ":address_id": { S: addressId },
      ":date": { N: date },
    },
  };

  const command = new UpdateItemCommand(params);
  await client.send(command);
};

(async () => {
  try {
    const invoices = await getAllInvoices();
    for (let i = 0; i < invoices.length; i++) {
      const invoice = invoices[i];
      console.log(`Processing invoice ${i + 1} of ${invoices.length}`);
      const jobId = invoice.PK.S.replace("job_id_", "");
      const invoiceDescription = invoice.description.S;
      const invoiceNumber = invoice.invoice_number.N;
      const addressId = invoice.address_id.S;
      const date = invoice.date?.N ?? "0";
      const job = await getJob(jobId);
      const customerId = job.PK.S.replace("customer_", "");
      await addInvoiceToJob(customerId, jobId, {
        addressId,
        date,
        invoiceDescription,
        invoiceNumber,
      });
      console.log(`Processed invoice ${i + 1} of ${invoices.length}`);
    }
  } catch (error) {
    console.error("Internal Error", error);
  }
})();
