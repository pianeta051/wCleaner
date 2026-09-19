import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const useQueueSearchParams = (): [
  URLSearchParams,
  Dispatch<SetStateAction<Record<string, string | undefined>>>
] => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [parameters, setParameters] = useState<
    Record<string, string | undefined>
  >({});

  useEffect(() => {
    const paramsClean: Record<string, string> = { ...parameters } as Record<
      string,
      string
    >;
    Object.keys(paramsClean).forEach((key) => {
      if (paramsClean[key] === undefined) {
        delete paramsClean[key];
      }
    });
    setSearchParams(paramsClean);
  }, [parameters]);

  return [searchParams, setParameters];
};
