
import {
  IBaseResponseService,
  IPaginationRequest,
  IPaginationResponse,
} from "@smpm/models"
import { IVendorModel } from "@smpm/models/vendorModel"
import axios from "@smpm/services/axios"

export interface IOptionalPaginationRequest extends Partial<IPaginationRequest> {}

export const getVendor = async (
  param: IPaginationRequest
): Promise<IBaseResponseService<IPaginationResponse<IVendorModel>>> => {
  try {
    const response = await axios.get("/vendor", {
      params: param,
    })
    return response.data
  } catch (error) {
    console.error('Error in getVendor:', error);
    throw error;
  }
}

export const updateVendor = async (
  id: number,
  vendorData: Partial<IVendorModel>
): Promise<IBaseResponseService<IVendorModel>> => {
  try {
    const response = await axios.patch(`/vendor/${id}`, vendorData);
    return response.data;
  } catch (error: any) {
    console.error('Error in updateVendor:', error);
    if (error.response) {
      throw new Error(error.response.data.message || 'Server responded with an error');
    } else if (error.request) {
      throw new Error('No response received from server');
    } else {
      throw new Error('Error setting up the request');
    }
  }
};

export const getAllVendor = async (): Promise<
  IBaseResponseService<IVendorModel[]>
> => {
  try {
    const response = await axios.get("/vendor/get/all")
    return response.data
  } catch (error) {
    console.error('Error in getAllVendor:', error);
    throw error;
  }
}

export const getVendorMilik = async (
  param: IOptionalPaginationRequest = {}
): Promise<IBaseResponseService<IPaginationResponse<IVendorModel>>> => {
  try {
    const defaultParams: IPaginationRequest = {
      page: 1,
      take: 1000, // Adjust based on expected maximum vendors
      order: "asc",
      order_by: "name", // Adjust based on vendor model
    };
    const finalParams = { ...defaultParams, ...param };
    const response = await axios.get("/vendor", {
      params: { ...finalParams, jenis: "milik" },
    });
    return response.data;
  } catch (error) {
    console.error("Error in getVendorMilik:", error);
    throw error;
  }
};

/**
 * Modified getVendorSewa to accept optional pagination parameters
 */
export const getVendorSewa = async (
  param: IOptionalPaginationRequest = {}
): Promise<IBaseResponseService<IPaginationResponse<IVendorModel>>> => {
  try {
    const defaultParams: IPaginationRequest = {
      page: 1,
      take: 1000,
      order: "asc",
      order_by: "name",
    };
    const finalParams = { ...defaultParams, ...param };
    const response = await axios.get("/vendor", {
      params: { ...finalParams, jenis: "sewa" },
    });
    return response.data;
  } catch (error) {
    console.error("Error in getVendorSewa:", error);
    throw error;
  }
};

/**
 * New Function: Fetch All Vendors without Pagination
 */
export const getAllVendorMilik = async (): Promise<IVendorModel[]> => {
  try {
    const response = await axios.get("/vendor", {
      params: { jenis: "milik", page: 1, take: 1000 },
    });
    return response.data.result.data; // Adjust based on actual response structure
  } catch (error) {
    console.error("Error in getAllVendorMilik:", error);
    throw error;
  }
};

export const getAllVendorSewa = async (): Promise<IVendorModel[]> => {
  try {
    const response = await axios.get("/vendor", {
      params: { jenis: "sewa", page: 1, take: 1000 },
    });
    return response.data.result.data; // Adjust based on actual response structure
  } catch (error) {
    console.error("Error in getAllVendorSewa:", error);
    throw error;
  }
};

export const createVendor = async (
  vendorData: Omit<IVendorModel, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'created_by' | 'updated_by'>
): Promise<IBaseResponseService<IVendorModel>> => {
  try {
    const response = await axios.post("/vendor", vendorData);
    return response.data;
  } catch (error) {
    console.error('Error in createVendor:', error);
    throw error;
  }
};

export const deleteVendor = async (
  id: number
): Promise<IBaseResponseService<void>> => {
  try {
    const response = await axios.delete(`/vendor/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error in deleteVendor:', error);
    if (error.response) {
      throw new Error(error.response.data.message || 'Server responded with an error');
    } else if (error.request) {
      throw new Error('No response received from server');
    } else {
      throw new Error('Error setting up the request');
    }
  }
};
