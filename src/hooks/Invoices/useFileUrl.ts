import useSWR from "swr";
import { getFileUrl } from "../../services/files";
import { extractErrorCode } from "../../services/error";

type FileUrlKey = readonly ["file-url", string];

export const useFileUrl = (fileKey?: string) => {
  const key = fileKey ? (["file-url", fileKey] as const) : null;

  const {
    data: fileUrl,
    error,
    isLoading: loading,
    mutate: reload,
  } = useSWR<string, Error>(
    key,
    async ([, storageKey]: FileUrlKey) => getFileUrl(storageKey),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5 * 60 * 1000,
    }
  );

  return {
    fileUrl,
    loading,
    error: extractErrorCode(error),
    reload,
  };
};
