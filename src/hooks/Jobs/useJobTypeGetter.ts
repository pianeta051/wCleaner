import { JobType } from "../../types/types";
import { useJobTypes } from "./useJobTypes";

export const useJobTypeGetter = (): ((id: string) => JobType | undefined) => {
  const { jobTypes } = useJobTypes();
  const getter = (id: string) => jobTypes?.find((jobType) => jobType.id === id);
  return getter;
};
