import { IBaseResponseService, IPaginationRequest, IPaginationResponse } from "@smpm/models";  
import { StagingJobOrder } from "@smpm/models/timelineModel";
 import axios from "@smpm/services/axios";  

export const getTimelineData = async (  
  param: IPaginationRequest & { no_jo: string }  
): Promise<IBaseResponseService<IPaginationResponse<StagingJobOrder>>> => {  
  const response = await axios.get(`/job-order/staging/${param.no_jo}`, {  
    params: {  
      page: param.page,  
    },  
  });  
  return response.data;     
};

export const downloadMedia = async (filename: string): Promise<Blob> => {  
  try {  
    const response = await axios.get(`/job-order/media/download/${encodeURIComponent(filename)}`, {  
      responseType: 'blob',  
      headers: {  
        'Accept': 'application/octet-stream'  
      }  
    });  
    
    if (response.status !== 200) {  
      throw new Error('Download failed');  
    }  
    
    return response.data;  
  } catch (error) {  
    console.error('Download error:', error);  
    throw error;  
  }  
};