import {
  DynamoDBClient,
  ScanCommand,
  QueryCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";

const TABLE_NAME = process.env.TABLE_NAME;

const client = new DynamoDBClient({ region: "eu-west-2" });

const getAllJobs = async () => {
  let items = [];
  let ExclusiveStartKey;

  do {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      ExclusiveStartKey,
      ExpressionAttributeNames: {
        "#SK": "SK",
      },
      ExpressionAttributeValues: {
        ":sk": { S: "job_" },
      },
      FilterExpression: "begins_with(#SK, :sk)",
    });

    const response = await client.send(command);
    items.push(...response.Items);
    ExclusiveStartKey = response.LastEvaluatedKey;
  } while (ExclusiveStartKey);

  return items;
};

const getAddressesForCustomer = async (customerId) => {
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
    ExpressionAttributeValues: {
      ":pk": { S: `customer_${customerId}` },
      ":sk": { S: "address_" },
    },
  });

  const response = await client.send(command);
  return response.Items;
};

const updateJobWithAddressId = async (job, addressId) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: job.PK,
      SK: job.SK,
    },
    ExpressionAttributeNames: {
      "#AID": "address_id",
    },
    ExpressionAttributeValues: {
      ":aid": { S: `address_${addressId}` },
    },
    UpdateExpression: "SET #AID = :aid",
  };
  try {
    const command = new UpdateItemCommand(params);
    await client.send(command);
  } catch (e) {
    console.log(JSON.stringify(params, null, 2));
    throw e;
  }
};

(async () => {
  const jobs = await getAllJobs();
  console.log(`Found ${jobs.length} jobs.`);
  const customersWithoutAddresses = [];
  const jobsWithoutAddresses = [];

  for (const job of jobs) {
    const customerId = job.PK.S.replace("customer_", "");
    const jobId = job.SK.S.replace("job_", "");
    console.log(`Working on job ${jobId}`);

    if (job.address_id?.S) {
      console.log("Already has address");
      continue;
    }

    const addresses = await getAddressesForCustomer(customerId);

    if (!addresses.length) {
      console.log(`No addresses for customer ${customerId}`);
      customersWithoutAddresses.push(customerId);
      continue;
    }

    let chosenAddress;

    if (addresses.length === 1) {
      chosenAddress = addresses[0];
    } else {
      const home = addresses.find(
        (a) =>
          a.name?.S?.toLowerCase().trim() === "Home" && a.status?.S === "active"
      );
      chosenAddress =
        home ?? addresses.find((a) => a.status?.S === "active") ?? addresses[0];
    }
    if (!chosenAddress) {
      console.log(`No valid addresses for job ${jobId}`);
      jobsWithoutAddresses.push(jobId);
      continue;
    }

    const addressId = chosenAddress.SK.S.replace("address_", "");
    await updateJobWithAddressId(job, addressId);

    console.log(
      `Updated job ${jobId} (customer: ${customerId}) with address_${addressId}`
    );
  }
  console.log(
    "Customer without addresses",
    customersWithoutAddresses.join("\n")
  );
  console.log("Jobs without addresses", jobsWithoutAddresses.join("\n"));
})();
