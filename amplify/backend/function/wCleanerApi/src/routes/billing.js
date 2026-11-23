const {
  calculateTotalFromPaidJobs,
  calculateTotalFromUnpaidJobs,
} = require("../db");

const { mapJobTemporalFilters } = require("../mappers");

const setBillingRoutes = (app) => {
  app.get("/billing/summary", async function (req, res) {
    const startParameter = req.query?.start;
    const endParameter = req.query?.end;

    if (startParameter === undefined || endParameter === undefined) {
      return res.status(400).json({
        error: "Start and end are required",
      });
    }

    const { start, end } = mapJobTemporalFilters(startParameter, endParameter);

    if (
      !Number.isSafeInteger(start) ||
      !Number.isSafeInteger(end) ||
      start < 0 ||
      end < start
    ) {
      return res.status(400).json({
        error: "Invalid date range",
      });
    }

    if (!req.authData?.groups?.includes("Admin")) {
      return res.status(403).json({
        error: "Admin access required",
      });
    }

    const filters = { start, end };

    const [totalPaidJobs, totalUnpaidJobs] = await Promise.all([
      calculateTotalFromPaidJobs(filters),
      calculateTotalFromUnpaidJobs(filters),
    ]);

    return res.json({
      totalPaidJobs,
      totalUnpaidJobs,
    });
  });
};

module.exports = { setBillingRoutes };
