const decodeToken = (token) => {
  if (!token) return;
  return JSON.parse(Buffer.from(token, "base64").toString("utf8"));
};

const encodeToken = (token) => {
  if (!token) return;
  return Buffer.from(JSON.stringify(token)).toString("base64");
};

const generateToken = (lastEvaluatedKey) => {
  if (!lastEvaluatedKey) return;
  return encodeToken(JSON.stringify(lastEvaluatedKey));
};

const parseToken = (token) => {
  if (!token) return;
  return JSON.parse(decodeToken(token));
};

module.exports = {
  generateToken,
  parseToken,
};
