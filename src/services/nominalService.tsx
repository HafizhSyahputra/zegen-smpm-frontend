import { IBaseResponseService, IPaginationRequest, IPaginationResponse } from "@smpm/models";
import axios from "./axios";
import { IFormInputNominal, IUpdateInputNominal, INominalModel, ICreateNominalDTO } from "@smpm/models/nominalModel";


export const uploadNominal = async (data: { nominal: string; jenis: string; tipe: string }) => {
    const response = await axios.patch("/nominal/:id", data, {
        headers: { "Content-Type": "application/json" },
    });
    return response.data;
};

export const getNominal = async (
    params: IPaginationRequest
): Promise<IBaseResponseService<IPaginationResponse<IFormInputNominal>>> => {
    const response = await axios.get("/nominal", { params });
    return response.data;
};

export const update = async (
    id: number,
    updateNominalDto: Partial<IUpdateInputNominal>
): Promise<IBaseResponseService<IFormInputNominal>> => {
    const response = await axios.patch(`/nominal/${id}`, updateNominalDto);
    return response.data;
};

 export const updateNominal = async (id: number, values: Partial<INominalModel>) => {  
    try {  
        const response = await axios.patch(`/nominal/${id}`, values);  
        return response.data;  
    } catch (error: any) {  
         if (error.response) {  
            throw error;  
        }  
        throw new Error('Terjadi kesalahan saat mengupdate data');  
    }  
};

 export const deleteNominal = async (id: number) => {  
    const response = await axios.delete(`/nominal/${id}`);  
    return response.data;  
};

export const createNominal = async (data: ICreateNominalDTO) => {  
    try {  
      console.log('Data yang akan dikirim ke server:', {  
        nominal: data.nominal,  
        vendor_id: data.vendor_id,  
        jenis: data.jenis,  
        tipe: data.tipe  
      });  
  
      const response = await axios.post("/nominal", data);  
      return response.data;  
    } catch (error: any) {  
        console.error('Detail Error dari Server:', {  
            status: error.response?.status,  
            statusText: error.response?.statusText,  
            responseData: error.response?.data,
            fullError: error  
        });  
        if (error.response) {  
            throw error;  
        }  
        throw new Error('Terjadi kesalahan saat create data');   
    }
  };
  