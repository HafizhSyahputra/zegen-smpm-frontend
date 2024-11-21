import { IBaseResponseService, IPaginationRequest, IPaginationResponse } from "@smpm/models";  
import { IBeritaAcaraModel } from "@smpm/models/beritaacaramodel";  
import axios from "./axios";  

// Fungsi untuk mengambil daftar Berita Acara dengan pagination  
export const getBeritaAcaraList = async (  
    params: IPaginationRequest  
): Promise<IBaseResponseService<IPaginationResponse<IBeritaAcaraModel>>> => {  
    const response = await axios.get("/berita-acara", { params });  
    return response.data;  
};  
  
// Fungsi untuk mengambil detail Berita Acara berdasarkan ID  
export const getBeritaAcaraById = async (id: number): Promise<IBaseResponseService<IBeritaAcaraModel>> => {  
    const response = await axios.get(`/berita-acara/${id}`);  
    return response.data;  
};   

// Fungsi untuk membuat Berita Acara baru  
export const createBeritaAcara = async (  
    data: IBeritaAcaraModel  
): Promise<IBaseResponseService<IBeritaAcaraModel>> => {  
    const response = await axios.post("/berita-acara", data);  
    return response.data;  
};  

// Fungsi untuk memperbarui Berita Acara  
export const updateBeritaAcara = async (  
    id: number,   
    data: Partial<IBeritaAcaraModel>  
): Promise<IBaseResponseService<IBeritaAcaraModel>> => {  
    const response = await axios.put(`/berita-acara/${id}`, data);  
    return response.data;  
};  

// Fungsi untuk menghapus Berita Acara  
// Di file beritaacaraService.ts  
export const deleteBeritaAcara = async (id: number): Promise<IBaseResponseService<null>> => {  
    try {  
        const response = await axios.delete(`/berita-acara/${id}`);  
        return response.data;  // Pastikan response mengikuti struktur IBaseResponseService  
    } catch (error) {  
        throw error;  
    }  
};  

export const uploadBeritaAcaraFile = async (  
    id: number,  
    file: File  
): Promise<IBaseResponseService<{ path: string }>> => {  
    const formData = new FormData();  
    formData.append('file', file); // Use 'file' as the field name

    try {  
        const response = await axios.post(`/berita-acara/${id}/submit`, formData, {  
            headers: {   
                'Content-Type': 'multipart/form-data'   
            },  
        });  

        return response.data;  
    } catch (error: any) {  
        console.error('Upload Error:', error.response ? error.response.data : error);  
        throw new Error(  
            error.response?.data?.message ||  
            error.message ||   
            'Failed to upload file'  
        );  
    }  
};


// Fungsi untuk mengunduh file dari Berita Acara  
export const downloadBeritaAcaraFile = async (  
    id: number,   
    fileKey: 'file1' | 'file2'  
): Promise<Blob> => {  
    const response = await axios.get(`/berita-acara/${id}/download/${fileKey}`, {  
        responseType: 'blob'  
    });  
    return response.data;  
};