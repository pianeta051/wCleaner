const decodeToken = (token) => {
  if (!token) return;
  return JSON.parse(Buffer.from(token, "base64").toString("utf8"));
};

const encodeToken = (token) => {
  if (!token) return;
  return Buffer.from(JSON.stringify(token)).toString("base64");
};

// const generateToken = (lastEvaluatedKey) => {
//   if (!lastEvaluatedKey) return;
//   return encodeToken(JSON.stringify(lastEvaluatedKey));
// };

const generateToken = (lastEvaluatedKey) => {
  if (!lastEvaluatedKey) return "";

  // Guardamos el objeto tal cual lo devuelve DynamoDB
  return Buffer.from(JSON.stringify(lastEvaluatedKey), "utf8").toString(
    "base64"
  );
};

// const parseToken = (token) => {
//   if (!token) return;
//   return JSON.parse(decodeToken(token));
// };

const parseToken = (token) => {
  // Si viene vacío, undefined, null, etc ---no hay ExclusiveStartKey
  if (!token || typeof token !== "string" || !token.trim()) return undefined;

  try {
    const decoded = Buffer.from(token, "base64").toString("utf8");
    const parsed = JSON.parse(decoded);

    // Debe ser un objeto no vacío
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return undefined;
    }
    if (Object.keys(parsed).length === 0) return undefined;

    return parsed;
  } catch (e) {
    return undefined;
  }
};

module.exports = {
  generateToken,
  parseToken,
};
