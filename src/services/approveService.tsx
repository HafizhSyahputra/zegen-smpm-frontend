import axios from "@smpm/services/axios";
import {
  IBaseResponseService,
  IPaginationRequest,
  IPaginationResponse,
} from "@smpm/models";
import { ApproveItem, ICreateApproveDto } from "@smpm/models/approveModel";

export const approveService = {
  create: async (
    createApproveDto: ICreateApproveDto
  ): Promise<IBaseResponseService<ApproveItem>> => {
    const response = await axios.post("/approve", createApproveDto);
    return response.data;
  },

  findAll: async (
    params: IPaginationRequest
  ): Promise<IBaseResponseService<IPaginationResponse<ApproveItem>>> => {
    const response = await axios.get("/approve", { params });
    return response.data;
  },

  findOne: async (id: number): Promise<IBaseResponseService<ApproveItem>> => {
    const response = await axios.get(`/approve/${id}`);
    return response.data;
  },

  update: async (
    id: number,
    updateApproveDto: Partial<ICreateApproveDto>
  ): Promise<IBaseResponseService<ApproveItem>> => {
    const response = await axios.patch(`/approve/${id}`, updateApproveDto);
    return response.data;
  },

  remove: async (id: number): Promise<IBaseResponseService<void>> => {
    const response = await axios.delete(`/approve/${id}`);
    return response.data;
  },

  approveItem: async (
    id: number
  ): Promise<IBaseResponseService<ApproveItem>> => {
    const response = await axios.patch(`/approve/${id}/approve`);
    return response.data;
  },

  // In approveService.js
  async rejectedItem(
    id: number,
    rejectDto: { reason: string; info_remark: string }
  ): Promise<ApproveItem> {
    const response = await axios.patch(`/approve/${id}/reject`, rejectDto); 
    return response.data;
  },

  bulkApprove: async (
    ids: number[]
  ): Promise<IBaseResponseService<{ count: number }>> => {
    const response = await axios.post("/approve/bulk-approve", { ids });
    return response.data;
  },

  getWaitingApprovals: async (
    params: IPaginationRequest
  ): Promise<IBaseResponseService<IPaginationResponse<ApproveItem>>> => {
    const response = await axios.get("/approve/waiting", { params });
    return response.data;
  },

  searchApprovals: async (
    params: IPaginationRequest & { search: string; search_by?: string[] }
  ): Promise<IBaseResponseService<IPaginationResponse<ApproveItem>>> => {
    const response = await axios.get("/approve", { params });
    return response.data;
  },

  getApprovalStatistics: async (): Promise<
    IBaseResponseService<{
      waiting: number;
      approved: number;
      rejected: number;
    }>
  > => {
    const response = await axios.get("/approve/statistics");
    return response.data;
  },

  exportApprovals: async (params: IPaginationRequest): Promise<Blob> => {
    const response = await axios.get("/approve/export", {
      params,
      responseType: "blob",
    });
    return response.data;
  },
};
