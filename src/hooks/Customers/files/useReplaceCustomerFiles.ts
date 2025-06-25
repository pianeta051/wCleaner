import useSWRMutation from "swr/mutation";
import { extractErrorCode } from "../../../services/error";
import { replaceCustomerFiles } from "../../../services/customers";
import { useSWRConfig } from "swr";

export const useReplaceCustomerFiles = (
  customerId?: string,
  slug?: string,
  jobId?: string
) => {
  const { mutate } = useSWRConfig();

  const { trigger, isMutating, error } = useSWRMutation<
    { fileUrls: string[]; id: string },
    string,
    readonly [string, string | undefined],
    string[]
  >(
    ["customer", slug],
    async (_key, { arg: fileUrls }) => {
      if (!customerId) throw new Error("Missing customerId");
      const response = await replaceCustomerFiles(customerId, fileUrls);
      await mutate(["customer", slug], undefined, {
        revalidate: true,
        populateCache: false,
      });
      await mutate(["customer", customerId], undefined, {
        revalidate: true,
        populateCache: false,
      });
      if (jobId) {
        await mutate(["job", customerId, jobId], undefined, {
          revalidate: true,
          populateCache: false,
        });
      }
      return response;
    },
    {
      revalidate: false,
      populateCache: false,
    }
  );

  return {
    replaceFiles: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
