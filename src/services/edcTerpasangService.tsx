import {
	IBaseResponseService,
	IPaginationRequest,
	IPaginationResponse,
  } from "@smpm/models";
  import { ElectronicDataCaptureMachine } from "@smpm/models/edcTerpasangModel";
  import axios from "@smpm/services/axios";
  
  export const getDataEDC = async (
	param: IPaginationRequest
  ): Promise<
	IBaseResponseService<IPaginationResponse<ElectronicDataCaptureMachine>>
  > => {
	const response = await axios.get("/edc-terpasang", {
	  params: param,
	});
	return response.data;
  };
  
  export const getAllEDC = async (): Promise<ElectronicDataCaptureMachine[]> => {
	const response = await axios.get("/edc-terpasang/get/all");
	return response.data;
  };
  