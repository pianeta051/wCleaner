import useSWRInfinite from "swr/infinite";
import { getCustomers } from "../../services/customers";
import { extractErrorCode } from "../../services/error";
import { Customer } from "../../types/types";

type CustomersResponse = {
  customers: Customer[];
  nextToken?: string;
  totalCustomers: number;
};

type CustomersKey = readonly [
  "customers",
  string | undefined,
  string[] | undefined,
  string | undefined
];

export const useCustomers = (
  searchInput?: string,
  outcodeFilter?: string[]
) => {
  const getKey = (
    pageIndex: number,
    previousPageData: CustomersResponse | null
  ): CustomersKey | null => {
    if (previousPageData && !previousPageData.nextToken) {
      return null;
    }

    return [
      "customers",
      searchInput,
      outcodeFilter,
      pageIndex === 0 ? undefined : previousPageData?.nextToken,
    ];
  };

  const fetcher = async (key: CustomersKey): Promise<CustomersResponse> => {
    const [, search, outcodes, nextToken] = key;

    return getCustomers(
      {
        searchInput: search,
        outcodeFilter: outcodes,
      },
      {
        nextToken,
        disabled: false,
      }
    );
  };

  const {
    data,
    error,
    isLoading: loading,
    size,
    setSize,
    isValidating,
    mutate,
  } = useSWRInfinite<CustomersResponse, Error>(getKey, fetcher, {
    keepPreviousData: true,
    revalidateFirstPage: true,
  });

  const customers = data?.flatMap((page) => page.customers) ?? [];

  const totalCustomers = data?.[0]?.totalCustomers;

  const lastPage = data?.[data.length - 1];

  const moreToLoad =
    typeof lastPage?.nextToken === "string" && lastPage.nextToken.length > 0;

  const loadingMore = isValidating && !!data && size > 0;

  const loadMore = () => {
    if (!moreToLoad || loadingMore) return;

    setSize(size + 1);
  };

  return {
    customers,
    totalCustomers,
    error: extractErrorCode(error),
    loading,
    moreToLoad,
    loadMore,
    loadingMore,
    reload: mutate,
  };
};
