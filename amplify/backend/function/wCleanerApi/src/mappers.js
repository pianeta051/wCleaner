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
  jobTypeId: customerJob.job_type_id?.S,
});

const mapJob = (jobFromDb) => {
  const start = dayjs(+jobFromDb.start.N);
  const end = dayjs(+jobFromDb.end.N);
  return {
    id: jobFromDb.SK.S.replace("job_", ""),
    date: start.format("YYYY-MM-DD"),
    startTime: start.format("HH:mm"),
    endTime: end.format("HH:mm"),
    price: +jobFromDb.price.N,
    customer: jobFromDb.customer ? mapCustomer(jobFromDb.customer) : undefined,
    jobTypeId: jobFromDb.job_type_id?.S,
  };
};

const mapJobType = (jobTypeFromDb) => {
  return {
    id: jobTypeFromDb.PK.S.replace("job_type_", ""),
    name: jobTypeFromDb.name.S,
    color: jobTypeFromDb.color.S,
  };
};

const mapJobFromRequestBody = (job) => ({
  ...job,
  start: +new Date(`${job.date} ${job.startTime}`),
  end: +new Date(`${job.date} ${job.endTime}`),
});
const mapJobTypeFromRequestBody = (jobType) => ({
  ...jobType,
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
  mapJob,
  mapJobFromRequestBody,
  mapJobTypeFromRequestBody,
  mapJobTemporalFilters,
  mapJobType,
};
