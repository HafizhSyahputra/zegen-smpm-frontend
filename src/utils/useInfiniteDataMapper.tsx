import { IBaseResponseService, IPaginationResponse } from "@smpm/models";
import { InfiniteData } from "@tanstack/react-query";
import { useMemo } from "react";

/**
 * Select data mapper
 * @param isSuccess
 * @param data
 * @param key
 * @param returnList
 */
export const useInfiniteDataMapper = <
  T extends IBaseResponseService<IPaginationResponse<O>>,
  O
>({
  isSuccess = false,
  data,
  prepend = [],
  changes,
  filterFn = () => true,
  returnList,
}: {
  isSuccess: boolean;
  data?: InfiniteData<T>;
  prepend?: any;
  changes?: any;
  filterFn?: (v: O) => boolean;
  returnList?: (v: O) =>
    | {
        value: number | string;
        label: string | React.ReactNode;
      }
    | React.ReactNode
    | string[]
    | number[]
    | O;
}) => {
  return useMemo(() => {
    if (isSuccess) {
      return data && data?.pages && data?.pages.length > 0
        ? prepend.concat(
            ...data?.pages.map((d) => {
              return d.result.data.length > 0
                ? d.result.data.filter(filterFn).map((v) => {
                    return returnList && returnList(v);
                  })
                : [];
            })
          )
        : [];
    } else {
      return [];
    }
  }, [data, isSuccess, changes]);
};
