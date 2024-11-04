import { Spin } from "antd";
import React from "react";

export interface UseSelectHelperResult {
  dropdownRender: (menu: any) => React.ReactElement;
  onPopupScroll?: React.UIEventHandler<HTMLDivElement> | undefined;
}

export interface UseSelectHelperParam {
  isFetchingNextPage: boolean;
  isLoading: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
}

export const useSelectHelper = ({
  isFetchingNextPage,
  isLoading,
  hasNextPage,
  fetchNextPage,
}: UseSelectHelperParam) => {
  const dropdownRender = (menu: any) => (
    <>
      {menu}
      <div className="w-full flex items-center justify-center space-x-4 mt-3">
        {isFetchingNextPage || isLoading ? (
          <>
            <Spin spinning={true} size="small" />
            <p className="text-gray-400 font-poppins">Loading...</p>
          </>
        ) : null}
      </div>
    </>
  );

  // On Popup scroll
  const onPopUpScroll: React.UIEventHandler<HTMLDivElement> | undefined = (
    event
  ) => {
    var target = event.currentTarget;

    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      if (hasNextPage) {
        fetchNextPage();
      }
    }
  };

  return { dropdownRender, onPopUpScroll };
};
