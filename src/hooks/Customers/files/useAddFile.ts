import useSWRMutation from "swr/mutation";
import { extractErrorCode } from "../../../services/error";
import { uploadFile } from "../../../services/files";

export const useAddFile = () => {
  const { trigger, isMutating, error } = useSWRMutation<
    string, // return type (uploaded key/path)
    string,
    readonly [string],
    { file: File; path: string }
  >(
    ["add-file"],
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
    addFile: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
