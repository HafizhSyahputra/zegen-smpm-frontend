import { useInfiniteDataMapper } from "@smpm/utils/useInfiniteDataMapper";
import { useSelectHelper } from "@smpm/utils/useSelectHelper";

import { UseInfiniteQueryResult } from "@tanstack/react-query";
import { Select, SelectProps } from "antd";
import React from "react";

export interface BaseSelectProps<R> extends SelectProps {
  label: string;
  api: UseInfiniteQueryResult<R>;
  filterFn?: (v: R) => boolean;
  returnList?: (v: R) =>
    | {
        value: number | string;
        label: string | React.ReactNode;
      }
    | React.ReactNode
    | string[]
    | number[]
    | R;
}

const BaseSelectInner = <R extends unknown>(
  props: BaseSelectProps<R>,
  ref: React.ForwardedRef<any>
) => {
  const { dropdownRender, onPopUpScroll } = useSelectHelper({
    fetchNextPage: props.api.fetchNextPage,
    hasNextPage: props.api.hasNextPage,
    isFetchingNextPage: props.api.isFetchingNextPage,
    isLoading: props.api.isLoading,
  });

  const data = useInfiniteDataMapper({
    isSuccess: props.api.isSuccess,
    data: props.api.data as any,
    filterFn: props.filterFn,
    returnList: props.returnList,
  });

  return (
    <Select
      {...props}
      ref={ref}
      dropdownRender={dropdownRender}
      onPopupScroll={onPopUpScroll}
    >
      {data}
    </Select>
  );
};

const BaseSelect = React.forwardRef(BaseSelectInner);

export default BaseSelect;
