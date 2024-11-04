import {  
	IBaseResponseService,  
	IPaginationRequest,  
	IPaginationResponse,  
  } from "@smpm/models"  
  import { IRegionModel } from "@smpm/models/regionModel"  
  import axios from "@smpm/services/axios"  
  
  export interface IRegionCreateRequest {  
	name: string;  
	code: string;  
	description?: string;  
  }  
  
  export interface IRegionUpdateRequest {  
	name?: string;  
	code?: string;  
	description?: string;  
  }  
  
  export const getRegion = async (  
	param: IPaginationRequest  
  ): Promise<IBaseResponseService<IPaginationResponse<IRegionModel>>> => {  
	const response = await axios.get("/region", {  
	  params: param,  
	})  
	return response.data  
  }  
  
  export const getAllRegion = async (): Promise<  
	IBaseResponseService<IRegionModel[]>  
  > => {  
	const response = await axios.get("/region/get/all")  
	return response.data  
  }  
  
  export const getRegionById = async (  
	id: number  
  ): Promise<IBaseResponseService<IRegionModel>> => {  
	const response = await axios.get(`/region/${id}`)  
	return response.data  
  }  
  
  export const createRegion = async (  
	data: IRegionCreateRequest  
  ): Promise<IBaseResponseService<IRegionModel>> => {  
	const response = await axios.post("/region", data)  
	return response.data  
  }  
  
  export const updateRegion = async (  
	id: number,  
	data: IRegionUpdateRequest  
  ): Promise<IBaseResponseService<IRegionModel>> => {  
	const response = await axios.patch(`/region/${id}`, data)  
	return response.data  
  }  
  
  export const deleteRegion = async (  
	id: number  
  ): Promise<IBaseResponseService<void>> => {  
	const response = await axios.delete(`/region/${id}`)  
	return response.data  
  }