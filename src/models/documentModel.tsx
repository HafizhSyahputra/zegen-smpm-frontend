
export interface DocMerchantModel {
  merchant: any;  
  id: number; 
  merchant_id: number;
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
  no_jo: string;  
  name: string;  
  jo_type: string;  
  vendor_name: string; 
  edc_brand: string;  
  edc_type: string;  
  tanggal_masuk: string;  
  file1: string;  
  file2: string;  
}  

export interface IUpdateDocVendorDto {  
  file1?: string;  
  file2?: string;  
  updated_by?: number;  
}