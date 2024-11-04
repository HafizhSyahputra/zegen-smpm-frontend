import { IBaseResponseService, IPaginationResponse } from "@smpm/models";

/**
 * Get Next page
 * @param lastPage
 * @param allPages
 * @returns {*|boolean}
 */
export const GetNextPageParam = (
  lastPage: IBaseResponseService<IPaginationResponse<any>>
) => {
  return +lastPage.result.meta.page < lastPage.result.meta.page_count
    ? +lastPage.result.meta.page + 1
    : false;
};
