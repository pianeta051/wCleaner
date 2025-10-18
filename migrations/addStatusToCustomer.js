import {
  DynamoDBClient,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";

const TABLE_NAME = "wcleaner-prod";
const client = new DynamoDBClient({ region: "eu-west-2" });

async function listCustomers() {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
    ExpressionAttributeNames: {
      "#PK": "PK",
      "#SK": "SK",
    },
    ExpressionAttributeValues: {
      ":pk": { S: "customer_" },
      ":sk": { S: "profile" },
    },
    FilterExpression: "begins_with(#PK, :pk) AND #SK = :sk",
  });

  const data = await client.send(command);
  return data.Items ?? [];
}

async function addStatusAttribute(customer) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: customer.PK,
      SK: customer.SK,
    },
    UpdateExpression: "SET #status = :statusValue",
    ExpressionAttributeNames: {
      "#status": "status",
    },
    ExpressionAttributeValues: {
      ":statusValue": { S: "active" },
    },
  };

  const command = new UpdateItemCommand(params);
  await client.send(command);
}

(async () => {
  try {
    console.log("Scanning Customers...");
    const customers = await listCustomers();

    for (const customer of customers) {
      const customerId = customer.PK.S.replace("customer_", "");
      const hasStatus = !!customer.status;

      if (!hasStatus) {
        console.log(`Adding status 'active' a ${customerId}`);
        await addStatusAttribute(customer);
      } else {
        console.log(`${customerId} Already have (${customer.status.S})`);
      }
    }
  } catch (error) {
    console.error("Internal Error", error);
  }
})();
