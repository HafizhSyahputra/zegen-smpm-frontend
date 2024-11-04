// src/services/receivedOutService.ts

import axios from "@smpm/services/axios";
import { ReceivedOutItem } from "@smpm/models/receivedOutModel";
import {
  IBaseResponseService,
  IPaginationRequest,
  IPaginationResponse,
} from "../models";

interface ReceivedOutResponse {
  status: {
    code: number;
    description: string;
  };
  result: {
    data: ReceivedOutItem[];
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

interface ApproveReceivedOutResponse {
  status: {
    code: number;
    description: string;
  };
  result: ReceivedOutItem;
}

export const receivedOutService = {
  /**
   * Fetch all ReceivedOut items with pagination and filtering
   */
  findAll: async (
    params: IPaginationRequest
  ): Promise<IBaseResponseService<IPaginationResponse<ReceivedOutItem>>> => {
    const response = await axios.get<ReceivedOutResponse>("/received-out", { params });
    return {
      status: response.data.status,
      result: {
        data: response.data.result.data,
        meta: response.data.result.meta,
      },
    };
  },

  /**
   * Fetch all waiting ReceivedOut items with pagination
   */
  findWaiting: async (
    params: IPaginationRequest
  ): Promise<IBaseResponseService<IPaginationResponse<ReceivedOutItem>>> => {
    const response = await axios.get<ReceivedOutResponse>("/received-out/waiting", { params });
    return {
      status: response.data.status,
      result: {
        data: response.data.result.data,
        meta: response.data.result.meta,
      },
    };
  },

  /**
   * Approve a single ReceivedOut item by ID
   */
  approveItem: async (
    id: number,
    approveReceivedOutDto: {
      petugas?: string;
      kondisibarang?: string;
      approved_by?: number;
      updated_by?: number;
    }
  ): Promise<IBaseResponseService<ReceivedOutItem>> => {
    const response = await axios.patch<ApproveReceivedOutResponse>(`/received-out/${id}/approve`, approveReceivedOutDto);
    return {
      status: response.data.status,
      result: response.data.result,
    };
  },

};