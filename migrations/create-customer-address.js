import {
  DynamoDBClient,
  ScanCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import * as uuid from "uuid";

const TABLE_NAME = "wcleaner-dev";

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
  return data.Items;
}

async function listAddresses(customerId) {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
    ExpressionAttributeNames: {
      "#PK": "PK",
      "#SK": "SK",
    },
    ExpressionAttributeValues: {
      ":pk": { S: "customer_" + customerId },
      ":sk": { S: "address_" },
    },
    FilterExpression: "begins_with(#SK, :sk) AND #PK = :pk",
  });
  const data = await client.send(command);
  return data.Items;
}

async function createHomeAddress(customer) {
  const id = uuid.v1();
  const params = {
    TableName: TABLE_NAME,
    Item: {
      PK: {
        S: customer.PK.S,
      },
      SK: {
        S: `address_${id}`,
      },
      postcode: {
        S: customer.postcode.S,
      },
      outcode: {
        S: customer.outcode.S,
      },
      name: {
        S: "Home",
      },
    },
  };
  if (customer.address?.S) {
    params.Item.address = {
      S: customer.address.S,
    };
  }
  const command = new PutItemCommand(params);
  await client.send(command);
}

(async () => {
  const customers = await listCustomers();
  for (const customer of customers) {
    const customerId = customer.PK.S.replace("customer_", "");
    const addresses = await listAddresses(customerId);
    if (addresses.length === 0) {
      console.log("Creando home address para " + customerId);
      await createHomeAddress(customer);
      console.log("Creada");
    }
  }
})();
