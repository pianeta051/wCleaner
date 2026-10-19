import {
  DynamoDBClient,
  QueryCommand,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import dayjs from "dayjs";

const calculateDueDate = (baseDate, frequencyValue, frequencyUnit) => {
  if (!baseDate || !frequencyValue || !frequencyUnit) {
    return;
  }

  const base = dayjs(baseDate);

  if (frequencyUnit === "weeks") {
    return base.add(frequencyValue, "week").valueOf();
  }

  if (frequencyUnit === "months") {
    return base.add(frequencyValue, "month").valueOf();
  }

  return;
};

const TABLE_NAME = process.env.TABLE_NAME;
const client = new DynamoDBClient({ region: "eu-west-2" });

const DEFAULT_FREQUENCY_VALUE = 12;
const DEFAULT_FREQUENCY_UNIT = "months";

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

      ExclusiveStartKey,
    });

    const result = await client.send(command);

    ExclusiveStartKey = result.LastEvaluatedKey;
    items = [...items, ...(result.Items ?? [])];
  } while (ExclusiveStartKey);

  return items;
}

async function getLastCleaningDate(customerId, addressId) {
  let ExclusiveStartKey;

  do {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: "job_start_time",
      ScanIndexForward: false,

      ExpressionAttributeNames: {
        "#JSTPK": "job_start_time_pk",
        "#PK": "PK",
        "#AI": "address_id",
        "#ST": "status",
      },

      ExpressionAttributeValues: {
        ":aggregator": { N: "1" },
        ":pk": { S: `customer_${customerId}` },
        ":addressId": { S: addressId },
        ":cancelled": { S: "cancelled" },
      },

      KeyConditionExpression: "#JSTPK = :aggregator",

      FilterExpression: "#PK = :pk AND #AI = :addressId AND #ST <> :cancelled",

      ExclusiveStartKey,
    });

    const result = await client.send(command);

    if (result.Items?.length) {
      const job = result.Items[0];

      if (job.start?.N) {
        return Number(job.start.N);
      }
    }

    ExclusiveStartKey = result.LastEvaluatedKey;
  } while (ExclusiveStartKey);

  return undefined;
}

async function setDueDate(address, dueDate) {
  const params = {
    TableName: TABLE_NAME,

    Key: {
      PK: address.PK,
      SK: address.SK,
    },

    UpdateExpression: "SET #DD = :due_date, #DDPK = :due_date_pk",

    ExpressionAttributeNames: {
      "#DD": "due_date",
      "#DDPK": "due_date_pk",
    },

    ExpressionAttributeValues: {
      ":due_date": {
        N: dueDate.toString(),
      },
      ":due_date_pk": {
        N: "1",
      },
    },
  };

  const command = new UpdateItemCommand(params);
  await client.send(command);
}

async function setDueDatePk(address) {
  const params = {
    TableName: TABLE_NAME,

    Key: {
      PK: address.PK,
      SK: address.SK,
    },

    UpdateExpression: "SET #DDPK = :due_date_pk",

    ExpressionAttributeNames: {
      "#DDPK": "due_date_pk",
    },

    ExpressionAttributeValues: {
      ":due_date_pk": {
        N: "1",
      },
    },
  };

  const command = new UpdateItemCommand(params);
  await client.send(command);
}

(async () => {
  try {
    console.log("Finding cleaning addresses...");

    const addresses = await getAddresses();

    for (const address of addresses) {
      const customerId = address.PK.S.replace("customer_", "");
      const addressId = address.SK.S.replace("address_", "");

      if (address.due_date?.N) {
        if (!address.due_date_pk?.N) {
          console.log(
            `${addressId} already has due date ${address.due_date.N}. Adding due_date_pk`
          );

          await setDueDatePk(address);
        } else {
          console.log(
            `${addressId} already has due date ${address.due_date.N} and due_date_pk`
          );
        }

        continue;
      }

      const storedFrequencyValue = address.frequency_value?.N
        ? Number(address.frequency_value.N)
        : undefined;

      const storedFrequencyUnit = address.frequency_unit?.S;

      const hasValidFrequency =
        storedFrequencyValue !== undefined &&
        storedFrequencyValue > 0 &&
        !!storedFrequencyUnit;

      const frequencyValue = hasValidFrequency
        ? storedFrequencyValue
        : DEFAULT_FREQUENCY_VALUE;

      const frequencyUnit = hasValidFrequency
        ? storedFrequencyUnit
        : DEFAULT_FREQUENCY_UNIT;

      if (!hasValidFrequency) {
        console.log(
          `${addressId} has no valid frequency. Using default: 12 months`
        );
      }

      const lastCleaningDate = await getLastCleaningDate(customerId, addressId);

      if (!lastCleaningDate) {
        console.log(`${addressId} has no previous cleaning. Skipping...`);

        continue;
      }

      const dueDate = calculateDueDate(
        lastCleaningDate,
        frequencyValue,
        frequencyUnit
      );

      if (!dueDate) {
        console.log(`${addressId} could not calculate due date. Skipping...`);

        continue;
      }

      console.log(
        `${addressId}: ${new Date(
          lastCleaningDate
        ).toISOString()} + ${frequencyValue} ${frequencyUnit}`
      );

      console.log(`Setting due date: ${new Date(dueDate).toISOString()}`);

      await setDueDate(address, dueDate);
    }

    console.log("Due date migration completed.");
  } catch (error) {
    console.error("Internal Error", error);
  }
})();
