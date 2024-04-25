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
  date: customerJob.date.S,
  time: customerJob.time.S,
  price: customerJob.price.S,
});

module.exports = {
  mapCustomer,
  mapCustomerJobs,
};
