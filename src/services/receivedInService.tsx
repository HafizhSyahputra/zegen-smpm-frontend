// src/services/receivedInService.ts

import axios from "@smpm/services/axios";
import { ReceivedInItem } from "@smpm/models/receivedInModel";
import {
  IBaseResponseService,
  IPaginationRequest,
  IPaginationResponse,
} from "../models";

interface ReceivedInResponse {
  status: {
    code: number;
    description: string;
  };
  result: {
    data: ReceivedInItem[];
    meta: {
      page: number;
      take: number;
      item_count: number;
      page_count: number;
      has_previous_page: boolean;
      has_next_page: boolean;
    };
  };
}

interface ApproveReceivedInResponse {
  status: {
    code: number;
    description: string;
  };
  result: ReceivedInItem;
}

export const receivedInService = {
  findAll: async (
    params: IPaginationRequest & { status?: string }
  ): Promise<IBaseResponseService<IPaginationResponse<ReceivedInItem>>> => {
    const response = await axios.get<ReceivedInResponse>("/received-in", { params });
    return {
      status: response.data.status,
      result: {
        data: response.data.result.data,
        meta: response.data.result.meta,
      },
    };
  },

  approveItem: async (
    id: number,
    approveReceivedInDto: {
      approved_by?: number;
      updated_by?: number;
      petugas?: string; // Add this line
      kondisibarang?: string; // Add this line
    }
  ): Promise<IBaseResponseService<ReceivedInItem>> => {
    const response = await axios.patch<ApproveReceivedInResponse>(`/received-in/${id}/approve`, approveReceivedInDto);
    return {
      status: response.data.status,
      result: response.data.result,
    };
  },
}