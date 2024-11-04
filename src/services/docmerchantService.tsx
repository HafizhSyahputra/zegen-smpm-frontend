import {  
  IBaseResponseService,  
  IPaginationRequest,  
  IPaginationResponse,  
} from "@smpm/models";  
import { DocMerchantModel } from "@smpm/models/documentModel";  
import axios from "@smpm/services/axios";  

export const findAll = async (  
  params: IPaginationRequest  
): Promise<IBaseResponseService<IPaginationResponse<DocMerchantModel>>> => {  
  const response = await axios.get("/document-merchant", { params });  
  return response.data;  
};  

export const findOne = async (id: number): Promise<IBaseResponseService<DocMerchantModel>> => {  
  const response = await axios.get(`/document-merchant/${id}`);  
  return response.data;  
}  


export const createDocumentMerchant = async (  
  // merchantId: number, 
  merchantName: string,  
  address: string,  
  latitude: string,  
  longitude: string,  
  fileDoc1: File,   
  fileDoc2?: File | null  
): Promise<IBaseResponseService<any>> => {  
  const formData = new FormData();  
  formData.append('file1', fileDoc1);  
  
  if (fileDoc2) {  
    formData.append('file2', fileDoc2);  
  }  

  const payload = {  
    // merchant_id: merchantId,
    merchant_name: merchantName,  
    location: address,  
    latitude,  
    longitude,  
  };  

  try {  
    const response = await axios.post('/document-merchant', {  
      ...payload,  
      ...Object.fromEntries(formData),  
    }, {  
      headers: {  
        'Content-Type': 'multipart/form-data', 
      },  
    });  

    return response.data;  
  } catch (error) {  
    console.error('Error in createDocumentMerchant:', error);  
    throw error;  
  }  
};   

export const update = async (
  id: number,
  updateApproveDto: FormData
): Promise<IBaseResponseService<DocMerchantModel>> => {
  const response = await axios.patch(`/document-merchant/${id}`, updateApproveDto, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const remove = async (id: number): Promise<IBaseResponseService<void>> => {  
  const response = await axios.delete(`/document-merchant/${id}`);  
  return response.data;  
}  

export const deleteFile = async (id: number, fileKey: 'file1' | 'file2') => {
  const response = await axios.delete(`/document-merchant/${id}/file/${fileKey}`);
  return response.data;
};

export const download = async (id: number, fileKey: 'file1' | 'file2'): Promise<{  
  data: Blob;  
  fileName: string;  
  fileExtension: string;  
}> => {  
  const response = await axios.get(`/document-merchant/${id}/download/${fileKey}`, {  
    responseType: 'blob',  
  });  

  const fileName = response.headers['content-disposition']?.split('filename=')[1];  
  const fileExtension = response.headers['content-type'].split('/')[1];  

  return {  
    data: response.data,  
    fileName: fileName?.replace(/"/g, ''),  
    fileExtension,  
  };  
};