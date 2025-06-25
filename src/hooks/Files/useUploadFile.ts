import useSWRMutation from "swr/mutation";
import { extractErrorCode } from "../../services/error";
import { uploadFile } from "../../services/files";

export const useUploadFile = () => {
  const { trigger, isMutating, error } = useSWRMutation<
    string,
    string,
    readonly [string],
    { file: File; path: string }
  >(
    ["customer"],
    async ([_operation], { arg: { file, path } }) => {
      const uploadedPath = await uploadFile(file, path);

      return uploadedPath;
    },
    {
      revalidate: false,
      populateCache: false,
    }
  );

  return {
    uploadFile: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
