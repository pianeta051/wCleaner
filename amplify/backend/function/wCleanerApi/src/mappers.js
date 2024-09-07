const dayjs = require("dayjs");

const mapCustomer = (customerFromDb) => ({
  id: customerFromDb.PK.S.replace("customer_", ""),
  name: customerFromDb.name.S,
  address: customerFromDb.address.S,
  postcode: customerFromDb.postcode.S,
  mainTelephone: customerFromDb.mainTelephone.S,
  secondTelephone: customerFromDb.secondTelephone.S,
  email: customerFromDb.email.S,
  slug: customerFromDb.slug.S,
});

const mapCustomerJobs = (customerJob) => ({
  id: customerJob.SK.S.replace("job_", ""),
  date: dayjs(+customerJob.start.N).format("YYYY-MM-DD"),
  startTime: dayjs(+customerJob.start.N).format("HH:mm"),
  endTime: dayjs(+customerJob.end.N).format("HH:mm"),
  price: +customerJob.price.N,
});

const mapJobFromRequestBody = (job) => ({
  ...job,
  start: +new Date(`${job.date} ${job.startTime}`),
  end: +new Date(`${job.date} ${job.endTime}`),
});
const mapJobTemporalFilters = (start, end) => {
  const startNumeric = +new Date(start);
  const endNumeric = +new Date(end);
  return {
    start: startNumeric,
    end: endNumeric,
  };
};

module.exports = {
  mapCustomer,
  mapCustomerJobs,
  mapJobFromRequestBody,
  mapJobTemporalFilters,
};
