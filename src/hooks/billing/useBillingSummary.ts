import useSWR from "swr";

import { extractErrorCode } from "../../services/error";
import { getBillingSummary } from "../../services/jobs";
import { BillingFilters } from "../../types/types";

export const useBillingSummary = (filters: BillingFilters) => {
  const { data, error, isLoading, mutate } = useSWR(
    ["billing-summary", filters],
    ([, filters]) => getBillingSummary(filters)
  );

  return {
    totalPaidJobs: data?.totalPaidJobs ?? 0,
    totalUnpaidJobs: data?.totalUnpaidJobs ?? 0,
    loading: isLoading,
    error: extractErrorCode(error),
    reload: mutate,
  };
};
