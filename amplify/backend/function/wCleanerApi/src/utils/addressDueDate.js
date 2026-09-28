const dayjs = require("dayjs");

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

module.exports = { calculateDueDate };
