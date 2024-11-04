// src/services/edcService.ts

import {
	IBaseResponseService,
	IPaginationRequest,
	IPaginationResponse,
  } from "@smpm/models";
  import {
	ElectronicDataCaptureMachine,
	ProviderEntity,
  } from "@smpm/models/edcModel";
  import axios from "@smpm/services/axios";
  
  interface IBulkCreateResponse {
	success: number;
	failed: number;
	errors: Array<{
	  row: number;
	  error: string;
	}>;
  }
  
  export const createDataEDC = async (data: any): Promise<any> => {
	const response = await axios.post("/electronic-data-capture", data);
	return response.data;
  };
  
  export const getReceivedInEDCs = async (
	filters: { brand?: string; type?: string }
  ): Promise<IBaseResponseService<ElectronicDataCaptureMachine[]>> => {
	const response = await axios.get("/electronic-data-capture/received-in", {
	  params: filters,
	});
	return response.data;
  };
  
  // Fetch Received Out EDCs
  export const getReceivedOutEDCs = async (
	filters: { brand?: string; type?: string }
  ): Promise<IBaseResponseService<ElectronicDataCaptureMachine[]>> => {
	const response = await axios.get("/electronic-data-capture/received-out", {
	  params: filters,
	});
	return response.data;
  };
  
  export const bulkCreateEDC = async (
	formData: FormData
  ): Promise<IBaseResponseService<IBulkCreateResponse>> => {
	try {
	  const response = await axios.post(
		"/electronic-data-capture/bulk-create",
		formData,
		{
		  headers: {
			"Content-Type": "multipart/form-data",
		  },
		}
	  );
	  return response.data;
	} catch (error: any) {
	  console.error("Bulk Create EDC Error:", error);
	  throw error;
	}
  };
  
  // Update function getDataEDC to accept status_edc
  export const getDataEDC = async (
	param: IPaginationRequest
  ): Promise<
	IBaseResponseService<IPaginationResponse<ElectronicDataCaptureMachine>>
  > => {
	const response = await axios.get("/electronic-data-capture", {
	  params: param,
	});
  
	// Add 'key' property to each data item
	const dataWithKey = response.data.result.data.map(
	  (item: ElectronicDataCaptureMachine) => ({
		...item,
		key: item.id, // Set key to id
	  })
	);
  
	return {
	  ...response.data,
	  result: {
		...response.data.result,
		data: dataWithKey,
	  },
	};
  };
  
  export const getBrand = async () => {
	try {
	  const response = await axios.get("/electronic-data-capture/brand/show");
	  return response.data; // Ensure the full response is returned
	} catch (error) {
	  console.error("Error fetching brands from API:", error);
	  throw error;
	}
  };

// src/services/edcService.ts

export const getBrandType = async (params: { brand: string }) => {
	try {
	  const response = await axios.get("/electronic-data-capture/brand-type/show", {
		params,
	  });
	  // Return langsung response.data agar struktur responsenya utuh
	  return response.data;
	} catch (error) {
	  console.error("Error fetching brand types from API:", error);
	  throw error;
	}
  };
  
  
  export const getEDCById = async (
	id: number
  ): Promise<ElectronicDataCaptureMachine> => {
	const response = await axios.get(`/electronic-data-capture/${id}`);
	return {
	  ...response.data.result,
	  key: response.data.result.id,
	};
  };
  
  // **New Function: Update EDC**
  export const updateDataEDC = async (
	id: number,
	data: any
  ): Promise<ElectronicDataCaptureMachine> => {
	const response = await axios.patch(`/electronic-data-capture/${id}`, data);
	return {
	  ...response.data.result,
	  key: response.data.result.id,
	};
  };
  
  export const deleteDataEDC = async (id: number): Promise<any> => {
	const response = await axios.delete(`/electronic-data-capture/${id}`);
	return response.data;
  };
  
  // **New Function: Get EDCs by Merchant ID**
  export const getEDCsByMerchantId = async (
	merchantId: number
  ): Promise<ElectronicDataCaptureMachine[]> => {
	try {
	  const response = await axios.get(
		`/electronic-data-capture/merchant/${merchantId}`
	  );
	  // Ensure response.data is an array
	  return response.data.data || [];
	} catch (error: any) {
	  console.error(`Error fetching EDCs for Merchant ID ${merchantId}:`, error);
	  // Return an empty array if an error occurs
	  return [];
	}
  };
  
  export const getInstalledEDCs = async (
	filters: IPaginationRequest & { status_edc: string[] }
  ): Promise<IPaginationResponse<ElectronicDataCaptureMachine>> => {
	const response = await axios.get("/electronic-data-capture/installed", {
	  params: filters,
	});
  
	const apiResult = response.data.result.result;
  
	// Add 'key' property to each data item
	const dataWithKey = apiResult.data.map((item: ElectronicDataCaptureMachine) => ({
	  ...item,
	  key: item.id, // Assuming 'id' is unique
	}));
  
	return {
	  ...apiResult,
	  data: dataWithKey,
	};
  };
  
  
  
 export const getAllProviderSimcards = async () => {
  try {
    const response = await axios.get("/electronic-data-capture/provider-simcard");
    return response.data.result;  
  } catch (error) {
    console.error("Error fetching provider simcards from API:", error);
    throw error;
  }
};
  
   export const createProviderSimcard = async (
	data: { name_provider: string }
  ): Promise<ProviderEntity> => {
	const response = await axios.post(
	  "/electronic-data-capture/provider-simcard",
	  data
	);
	return response.data;
  };
  