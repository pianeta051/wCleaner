const dayjs = require("dayjs");

const mapCustomer = (customerFromDb) => ({
  id: customerFromDb.PK.S.replace("customer_", ""),
  name: customerFromDb.name.S,
  address: customerFromDb.address.S,
  postcode: customerFromDb.postcode.S,
  mainTelephone: customerFromDb.mainTelephone?.S,
  secondTelephone: customerFromDb.secondTelephone?.S,
  email: customerFromDb.email?.S,
  slug: customerFromDb.slug.S,
  fileUrls: customerFromDb.fileUrls?.L?.map((f) => f.S) ?? [],
  notes:
    customerFromDb.notes?.L?.map((item) => {
      const note = item.M;
      return {
        id: note.id?.S || "",
        title: note.title?.S || "",
        content: note.content?.S || "",
        author: note.author?.S || "",
        timestamp: note.timestamp ? Number(note.timestamp.N) : undefined,
        isFavourite: !!note?.isFavourite?.BOOL,
        updatedAt: note.updatedAt ? Number(note.updatedAt.N) : undefined,
        updatedBy: note.updatedBy?.S || "",
      };
    }) || [],
});

const mapCleaningAddress = (cleaningAddressFromDb) => ({
  id: cleaningAddressFromDb.SK.S.replace("address_", ""),
  name: cleaningAddressFromDb.name.S,
  address: cleaningAddressFromDb.address?.S,
  postcode: cleaningAddressFromDb.postcode.S,
});

const mapCustomerJobs = (customerJob) => ({
  id: customerJob.SK.S.replace("job_", ""),
  date: dayjs(+customerJob.start.N).format("YYYY-MM-DD"),
  startTime: dayjs(+customerJob.start.N).format("HH:mm"),
  endTime: dayjs(+customerJob.end.N).format("HH:mm"),
  price: +customerJob.price.N,
  jobTypeId: customerJob.job_type_id?.S,
  addressId: customerJob.address_id?.S,
  customerId: customerJob.PK.S.replace("customer_", ""),
  status: customerJob.status?.S || "pending",
  paymentMethod: customerJob.payment_method?.S || "none",
});

const mapInvoice = (item) => ({
  jobId: item.PK.S.replace("job_id_", ""),
  invoiceNumber: item.invoice_number
    ? Number(item.invoice_number.N)
    : undefined,
  date: item.date ? Number(item.date.S) : undefined,
  description: item.description?.S ?? "",
  generatedAt: item.generated_at?.S,
});

// map a single standalone job
const mapJob = (jobFromDb) => {
  const startValue = jobFromDb.start?.N ? +jobFromDb.start.N : Date.now();
  const endValue = jobFromDb.end?.N ? +jobFromDb.end.N : startValue + 3600000;

  const start = dayjs(startValue);
  const end = dayjs(endValue);

  return {
    id: jobFromDb.SK?.S?.replace("job_", ""),
    customerId: jobFromDb.PK?.S?.replace("customer_", ""),
    date: start.format("YYYY-MM-DD"),
    startTime: start.format("HH:mm"),
    endTime: end.format("HH:mm"),
    price: jobFromDb.price?.N ? +jobFromDb.price.N : 0,
    jobTypeId: jobFromDb.job_type_id?.S || "",
    addressId: jobFromDb.address_id?.S || "",
    customer: jobFromDb.customer ? mapCustomer(jobFromDb.customer) : undefined,
    status: jobFromDb.status?.S || "pending",
    paymentMethod: jobFromDb.payment_method?.S || "none",
  };
};

const mapJobAddressUpdate = (jobFromDb, newAddress) => ({
  id: jobFromDb.SK.S.replace("job_", ""),
  customerId: jobFromDb.PK.S.replace("customer_", ""),
  addressId: newAddress.id,
  address: newAddress.address,
  postcode: newAddress.postcode,
});
const mapJobType = (jobTypeFromDb) => {
  if (!jobTypeFromDb || !jobTypeFromDb.PK || !jobTypeFromDb.name) {
    return {
      id: "",
      name: "Unknown",
      color: "#999999",
    };
  }

  return {
    id: jobTypeFromDb.PK.S.replace("job_type_", ""),
    name: jobTypeFromDb.name.S,
    color: jobTypeFromDb.color?.S || "#999999",
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
  mapCleaningAddress,
  mapCustomer,
  mapCustomerJobs,
  mapInvoice,
  mapJob,
  mapJobAddressUpdate,
  mapJobFromRequestBody,
  mapJobTypeFromRequestBody,
  mapJobTemporalFilters,
  mapJobType,
};
