import { IRegionModel } from "./regionModel";

export interface IMerchantModel {
  file1: any;
  file2: any;
  id?: number;
  
  region_id: number;
  mid: string;
  name: string;
  category: string;
  customer_name: string;
  telephone?: string;
  pic: string;
  phone1: string;
  phone2?: string;
  address1: string;
  address2: string;
  address3: string;
  address4: string;
  district?: string;
  subdistrict?: string;
  city?: string;
  province?: string;
  postal_code: string;

  created_by?: number;
  updated_by?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  region?: IRegionModel;
}
