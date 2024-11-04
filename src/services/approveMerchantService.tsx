// src/services/approveMerchantService.ts

import axios from '@smpm/services/axios'; // Sesuaikan path sesuai struktur proyek Anda
 import {
  IBaseResponseService,
  IPaginationRequest,
  IPaginationResponse,
} from '@smpm/models';
import { IApproveMerchantModel, IMerchantModel } from '@smpm/models/MerchantApproveModel';

interface IApproveMerchantResponse {
  status: {
    code: number;
    description: string;
  };
  result: {
    data: IApproveMerchantModel[];
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

// Mengambil daftar persetujuan dengan status 'Waiting', bisa difilter berdasarkan type
export const getWaitingApprovals = async (
  params: { type?: string } & IPaginationRequest
): Promise<IBaseResponseService<IPaginationResponse<IApproveMerchantModel>>> => {
  const { page, type } = params;
  try {
    const response = await axios.get<IApproveMerchantResponse>('/approve-merchant', {
      params: {
        page,
        type,
        // Jangan sertakan 'pageSize' jika backend tidak mengharapkannya
      },
    });

    // Parse DataAfter dan assign ke merchant
    const itemsWithMerchant = response.data.result.data.map(item => ({
      ...item,
      merchant: item.DataAfter ? JSON.parse(item.DataAfter) as IMerchantModel : null,
    }));

    return {
      status: {
        code: response.data.status.code,
        description: response.data.status.description,
      },
      result: {
        items: itemsWithMerchant,
        meta: response.data.result.meta,
      },
    };
  } catch (error) {
    throw error;
  }
};



// Mengambil riwayat persetujuan, bisa difilter berdasarkan type
export const getApprovalHistoryAdd = async (
  params: { type?: string } & IPaginationRequest
): Promise<IBaseResponseService<IPaginationResponse<IApproveMerchantModel>>> => {
  const { page, type } = params;
  try {
    const response = await axios.get<IApproveMerchantResponse>('/approve-merchant/approved-rejected/Add', {
      params: {
        page,
        type,
        // Jangan sertakan 'pageSize' jika backend tidak mengharapkannya
      },
    });

    // Parse DataAfter dan assign ke merchant
    const itemsWithMerchant = response.data.result.data.map(item => ({
      ...item,
      merchant: item.DataAfter ? JSON.parse(item.DataAfter) as IMerchantModel : null,
    }));

    return {
      status: {
        code: response.data.status.code,
        description: response.data.status.description,
      },
      result: {
        items: itemsWithMerchant,
        meta: response.data.result.meta,
      },
    };
  } catch (error) {
    throw error;
  }
};

export const getApprovalHistoryDelete = async (
  params: { type?: string } & IPaginationRequest
): Promise<IBaseResponseService<IPaginationResponse<IApproveMerchantModel>>> => {
  const { page, type } = params;
  try {
    const response = await axios.get<IApproveMerchantResponse>('/approve-merchant/approved-rejected/Delete', {
      params: {
        page,
        type,
        // Don't include 'pageSize' if backend doesn't expect it
      },
    });

    // **Update the mapping logic to handle 'Delete' type properly**
    const itemsWithMerchant = response.data.result.data.map(item => ({
      ...item,
      // If DataAfter exists, parse it. Otherwise, use the existing merchant data from the backend
      merchant: item.DataAfter
        ? JSON.parse(item.DataAfter) as IMerchantModel
        : item.merchant || (item.DataBefore ? JSON.parse(item.DataBefore) as IMerchantModel : null),
    }));

    return {
      status: {
        code: response.data.status.code,
        description: response.data.status.description,
      },
      result: {
        items: itemsWithMerchant,
        meta: response.data.result.meta,
      },
    };
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error; // Optionally, you can handle this differently
  }
};


export const getApprovalHistoryEdit = async (
  params: { type?: string } & IPaginationRequest
): Promise<IBaseResponseService<IPaginationResponse<IApproveMerchantModel>>> => {
  const { page, type } = params;
  try {
    const response = await axios.get<IApproveMerchantResponse>('/approve-merchant/approved-rejected/Edit', {
      params: {
        page,
        type,
        // Jangan sertakan 'pageSize' jika backend tidak mengharapkannya
      },
    });

    // Parse DataAfter dan assign ke merchant
    const itemsWithMerchant = response.data.result.data.map(item => ({
      ...item,
      merchant: item.DataAfter ? JSON.parse(item.DataAfter) as IMerchantModel : null,
    }));

    return {
      status: {
        code: response.data.status.code,
        description: response.data.status.description,
      },
      result: {
        items: itemsWithMerchant,
        meta: response.data.result.meta,
      },
    };
  } catch (error) {
    throw error;
  }
};

// Menyetujui sebuah permintaan persetujuan berdasarkan ID
export const approveMerchant = async (
  id: number
): Promise<IBaseResponseService<IApproveMerchantModel>> => {
  try {
    const response = await axios.patch(`/approve-merchant/${id}/approve`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Menolak sebuah permintaan persetujuan berdasarkan ID dengan alasan dan catatan
export const rejectMerchant = async (
  id: number,
  reason: string,
  info_remark: string
): Promise<IBaseResponseService<IApproveMerchantModel>> => {
  try {
    const response = await axios.patch(`/approve-merchant/${id}/reject`, {
      reason,
      info_remark,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Mengambil statistik persetujuan
export const getApprovalStatistics = async (): Promise<IBaseResponseService<{
  waiting: number;
  approved: number;
  rejected: number;
}>> => {
  try {
    const response = await axios.get('/approve-merchant/statistics');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Menyetujui banyak permintaan persetujuan berdasarkan array ID
export const bulkApproveMerchants = async (
  ids: number[]
): Promise<IBaseResponseService<{ count: number }>> => {
  try {
    const response = await axios.post('/approve-merchant/bulk-approve', {
      ids,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getWaitingApprovalsAdd = async (
  params: { type?: string } & IPaginationRequest
): Promise<IBaseResponseService<IPaginationResponse<IApproveMerchantModel>>> => {
  const { page, type } = params;
  try {
    const response = await axios.get<IApproveMerchantResponse>('/approve-merchant/waiting/Add', {
      params: {
        page,
        type,
        // Jangan sertakan 'pageSize' jika backend tidak mengharapkannya
      },
    });

    // Parse DataAfter dan assign ke merchant
    const itemsWithMerchant = response.data.result.data.map(item => ({
      ...item,
      merchant: item.DataAfter ? JSON.parse(item.DataAfter) as IMerchantModel : null,
    }));

    return {
      status: {
        code: response.data.status.code,
        description: response.data.status.description,
      },
      result: {
        items: itemsWithMerchant,
        meta: response.data.result.meta,
      },
    };
  } catch (error) {
    throw error;
  }
};


export const getWaitingApprovalsDelete = async (
  params: { type?: string } & IPaginationRequest
): Promise<IBaseResponseService<IPaginationResponse<IApproveMerchantModel>>> => {
  const { page, type } = params;
  try {
    const response = await axios.get<IApproveMerchantResponse>('/approve-merchant/waiting/Delete', {
      params: {
        page,
        type,
        // Don't include 'pageSize' if backend doesn't expect it
      },
    });

    // Update the mapping logic
    const itemsWithMerchant = response.data.result.data.map(item => ({
      ...item,
      // If DataAfter exists, parse it. Otherwise, use the existing merchant data from the backend
      merchant: item.DataAfter ? JSON.parse(item.DataAfter) as IMerchantModel : item.merchant,
    }));

    return {
      status: {
        code: response.data.status.code,
        description: response.data.status.description,
      },
      result: {
        items: itemsWithMerchant,
        meta: response.data.result.meta,
      },
    };
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error; // Optionally, you can handle this differently
  }
};

export const getWaitingApprovalsEdit = async (
  params: { type?: string } & IPaginationRequest
): Promise<IBaseResponseService<IPaginationResponse<IApproveMerchantModel>>> => {
  const { page, type } = params;
  try {
    const response = await axios.get<IApproveMerchantResponse>('/approve-merchant/waiting/Edit', {
      params: {
        page,
        type,
        // Jangan sertakan 'pageSize' jika backend tidak mengharapkannya
      },
    });

    // Parse DataAfter dan assign ke merchant
    const itemsWithMerchant = response.data.result.data.map(item => ({
      ...item,
      merchant: item.DataAfter ? JSON.parse(item.DataAfter) as IMerchantModel : null,
    }));

    return {
      status: {
        code: response.data.status.code,
        description: response.data.status.description,
      },
      result: {
        items: itemsWithMerchant,
        meta: response.data.result.meta,
      },
    };
  } catch (error) {
    throw error;
  }
};