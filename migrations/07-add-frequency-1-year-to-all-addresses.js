import {
  DynamoDBClient,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";

const TABLE_NAME = process.env.TABLE_NAME;
const client = new DynamoDBClient({ region: "eu-west-2" });

async function getAddresses() {
  let ExclusiveStartKey;
  let items = [];
  do {
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

    const result = await client.send(command);
    ExclusiveStartKey = result.LastEvaluatedKey;
    items = [...items, ...result.Items];
  } while (ExclusiveStartKey);

  return items;
}

async function addFrequency(address) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: address.PK,
      SK: address.SK,
    },
    UpdateExpression: "SET #FV = :frequency_value, #FU = :frequency_unit",
    ExpressionAttributeNames: {
      "#FV": "frequency_value",
      "#FU": "frequency_unit",
    },
    ExpressionAttributeValues: {
      ":frequency_value": { N: "12" },
      ":frequency_unit": { S: "months" },
    },
  };

  const command = new UpdateItemCommand(params);
  await client.send(command);
}

(async () => {
  try {
    console.log("Finding addresses without frequency...");
    const addresses = await getAddresses();

    for (const address of addresses) {
      const addressId = address.SK.S.replace("address_", "");
      const hasFrequency =
        !!address.frequency_unit && !!address.frequency_value;

      if (!hasFrequency) {
        console.log(`Adding frequency '12 months' to  ${addressId}`);
        await addFrequency(address);
      } else {
        console.log(
          `${addressId} Already have frequency ${address.frequency_value.N} ${address.frequency_unit.S}`
        );
      }
    }
  } catch (error) {
    console.error("Internal Error", error);
  }
})();
