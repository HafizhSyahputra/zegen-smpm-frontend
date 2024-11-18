
export interface DocMerchantModel {
  merchant: any;  
  id: number; 
  merchant_name: string;  
  longitude: string;
  latitude: string;
  file1?: string;  
  file2?: string;  
  location: string;  
}  

export interface IUpdateDocMerchantDto {  
  file1?: string;  
  file2?: string;  
  updated_by?: number;  
}  

export interface DocVendorModel {  
  id: number; 
  name: string;  
  vendor_name: string; 
  tanggal_perjanjian: string; 
  no_perjanjian_kerjasama: string;  
  file1: string;  
  file2: string;  
}  

export interface IUpdateDocVendorDto {  
  file1?: string;  
  file2?: string;  
  updated_by?: number;  
}