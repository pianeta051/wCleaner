import useSWR from "swr";
import { User, getUsers } from "../../services/authentication";
import { extractErrorCode } from "../../services/error";

export const useUsers = () => {
  const { data, isLoading, error, mutate } = useSWR<
    User[],
    Error,
    readonly [string]
  >(["users"], async ([_operation]) => getUsers());
  return {
    users: data ?? [],
    error: extractErrorCode(error),
    loading: isLoading,
    reload: mutate,
  };
};
