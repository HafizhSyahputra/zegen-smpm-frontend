import { IBaseResponseService, IPaginationResponse } from "@smpm/models";

/**
 * Get Prev Page
 * @param firstPage
 * @param allPages
 * @returns {number|boolean}
 */
export const GetPrevPageParam = (
  firstPage: IBaseResponseService<IPaginationResponse<any>>
) => {
  return +firstPage.result.meta.page <= firstPage.result.meta.page_count
    ? +firstPage.result.meta.page - 1
    : false;
};
