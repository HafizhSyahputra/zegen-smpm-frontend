import { IVendorModel } from "./vendorModel";

export interface INominalModel {  
  id?: number;  
  nominal: string;  
  jenis: string;  
  vendor_id: number;  
  tipe: string;  
}  

export interface IFormImportNominal {
  onFinish?: (values: any) => void;
  initialValues?: IFormImportNominal;
  isLoading?: boolean;
  onReset?: () => void;
}

export interface INominalModel extends ICreateNominalDTO {  
  id?: number;  
  created_at?: string;  
  updated_at?: string;  
}  

export interface ICreateNominalDTO {  
  nominal: string;  
  jenis: string;  
  vendor_id: number;  
  tipe: string;  
}  

export interface IUpdateNominalDTO {  
  nominal?: string;  
  jenis?: string;  
  vendor_id?: number;  
  tipe?: string;  
}   

export interface IFormInputNominal {
    vendor_id: number;
    vendor: IVendorModel;
    nominal: string;
    id: number;
    jenis: string;
    harga: string;
    tipe: string;
  }

export interface IUpdateInputNominal {
    id: number;
    nominal?: string;
    jenis?: string;
    harga?: string;
    tipe?: string;
  }