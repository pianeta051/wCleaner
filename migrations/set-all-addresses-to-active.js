import {
  DynamoDBClient,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";

const TABLE_NAME = "wcleaner-dev";

const client = new DynamoDBClient({ region: "eu-west-2" });

const setAsActive = async (address) => {
  const command = new UpdateItemCommand({
    TableName: TABLE_NAME,
    Key: {
      SK: address.SK,
      PK: address.PK,
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
    ExpressionAttributeValues: {
      ":status": {
        S: "active",
      },
    },
    UpdateExpression: "SET #status = :status",
  });
  await client.send(command);
};

const listAddresses = async () => {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
    ExpressionAttributeNames: {
      "#PK": "PK",
      "#SK": "SK",
    },
    ExpressionAttributeValues: {
      ":pk": { S: "customer_" },
      ":sk": { S: "address_" },
    },
    FilterExpression: "begins_with(#PK, :pk) AND begins_with(#SK, :sk)",
  });
  const data = await client.send(command);
  return data.Items;
};

(async () => {
  const addresses = await listAddresses();
  for (const address of addresses) {
    await setAsActive(address);
    console.log(`Address ${address.SK.S} set as active`);
  }
})();
