import {
  IBaseResponseService,
  IPaginationResponse,
} from "@smpm/models";
import { DocVendorModel } from "@smpm/models/documentModel";
 import axios from "@smpm/services/axios";

 export const findAll = async (): Promise<IBaseResponseService<IPaginationResponse<DocVendorModel>>> => {  
  const response = await axios.get("/document-vendor");  // Hapus parameter tidak perlu  
  return response.data;  
};

export const findOne = async (id: number): Promise<IBaseResponseService<DocVendorModel>> => {
  const response = await axios.get(`/document-vendor/${id}`);
  return response.data;
}

export const createDocumentVendor = async (  
  vendor_name: string,  
  tanggal_perjanjian: string,  
  no_perjanjian_kerjasama: string, // Ubah dari agreement_number  
  fileDoc1: File,   
  fileDoc2?: File | null,  
): Promise<IBaseResponseService<any>> => {  
  const formData = new FormData();  
  
  // Append files  
  formData.append('file1', fileDoc1);  
  if (fileDoc2) {  
    formData.append('file2', fileDoc2);  
  }  

  // Append form data yang sesuai dengan backend  
  formData.append('vendor_name', vendor_name);  
  formData.append('tanggal_perjanjian', tanggal_perjanjian);  
  formData.append('no_perjanjian_kerjasama', no_perjanjian_kerjasama); // Sesuaikan dengan backend  

  try {  
    const response = await axios.post('/document-vendor', formData, {  
      headers: {  
        'Content-Type': 'multipart/form-data',   
      },  
    });  

    return response.data;  
  } catch (error) {  
    console.error('Error in createDocumentVendor:', error);  
    throw error;  
  }  
};

export const update = async (
  id: number,
  updateApproveDto: FormData
): Promise<IBaseResponseService<DocVendorModel>> => {
  const response = await axios.patch(`/document-vendor/${id}`, updateApproveDto, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteFile = async (id: number, fileKey: 'file1' | 'file2') => {
  const response = await axios.delete(`/document-vendor/${id}/file/${fileKey}`);
  return response.data;
};

export const download = async (id: number, fileKey: 'file1' | 'file2'): Promise<{  
data: Blob;  
fileName: string;  
fileExtension: string;  
}> => {  
const response = await axios.get(`/document-vendor/${id}/download/${fileKey}`, {  
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
export const remove = async (id: number): Promise<IBaseResponseService<void>> => {
  const response = await axios.delete(`/document-vendor/${id}`);
  return response.data;
}