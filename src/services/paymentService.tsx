import {  
  IBaseResponseService,  
  IPaginationRequest,  
  IPaginationResponse,  
} from "@smpm/models";  
import { IJobOrderModel } from "@smpm/models/jobOrderModel";  
import { PaymentEntity } from "@smpm/models/paymentModel";
import axios from "@smpm/services/axios";  

export const createDataMerchant = async (data: any): Promise<any> => {  
  const response = await axios.post("/merchant", data);  
  return response.data;  
};  

export const getDataPayment = async (  
  param: IPaginationRequest & { id?: number }  
): Promise<IBaseResponseService<IPaginationResponse<PaymentEntity>>> => {  
  const response = await axios.get(`/payment${param.id ? `/${param.id}` : ''}`, {  
    params: { ...param, id: undefined },  
  });  
  return response.data;  
};

export const getActivityJobOrder = async (  
param: IPaginationRequest  
): Promise<IBaseResponseService<IPaginationResponse<IJobOrderModel>>> => {  
const response = await axios.get("/job-order/activity", {  
  params: param,  
})  
return response.data  
}  

export const getMerchantFiles = async () => {  
  const response = await axios.get("/merchant/files");  
  return response.data;  
};  

export const getMerchantLocations = async () => {  
  const response = await axios.get("/merchant/locations");  
  return response.data;  
};