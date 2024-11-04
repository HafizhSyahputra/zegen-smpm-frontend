import {  
    IBaseResponseService,  
    IPaginationRequest,  
    IPaginationResponse,  
  } from "@smpm/models";  
  import { IMaintenanceModel } from "@smpm/models/maintenanceModel";  
  import axios from "@smpm/services/axios";  
  
  export const createDataMaintenance = async (  
    data: IMaintenanceModel  
  ): Promise<any> => {  
    const response = await axios.post("/maintenance", data);  
    return response.data;  
  };  
  
  export const updateDataMaintenance = async (  
    data: IMaintenanceModel  
  ): Promise<any> => {  
    const response = await axios.patch(`/maintenance/${data.id}`, data);  
    return response.data;  
  };  
  
  export const getDataMaintenance = async (  
    param: IPaginationRequest  
  ): Promise<IBaseResponseService<IPaginationResponse<IMaintenanceModel>>> => {  
    const response = await axios.get("/maintenance", {  
      params: param,  
    });  
    return response.data;  
  };  
  
  export const getDataMaintenanceById = async (  
    id: number  
  ): Promise<IBaseResponseService<IMaintenanceModel>> => {  
    const response = await axios.get(`/maintenance/${id}`);  
    return response.data;  
  };  
  
  export const deleteDataMaintenance = async (  
    id: number  
  ): Promise<IBaseResponseService<IMaintenanceModel>> => {  
    const response = await axios.delete(`/maintenance/${id}`);  
    return response.data;  
  };