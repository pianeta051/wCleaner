import useSWRMutation from "swr/mutation";
import { useSWRConfig } from "swr";
import { extractErrorCode } from "../../services/error";
import { deleteFile } from "../../services/files";

export const useDeleteFile = () => {
  const { trigger, isMutating, error } = useSWRMutation<
    void,
    string,
    readonly [string],
    string
  >(
    ["deleteFile"],
    async ([_operation], { arg: path }) => {
      await deleteFile(path);
    },
    {
      revalidate: false,
      populateCache: false,
    }
  );

  return {
    deleteFile: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
