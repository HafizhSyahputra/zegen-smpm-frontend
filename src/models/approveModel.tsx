
export interface ApproveItem {
  id: number;  
  id_jobOrder: number;  
  vendor_id: number;  
  region_id: number;  
  reason: string;  
  info_remark: string;  
  status: string;  
  approved_by: number | null;  
  rejected_by: number | null;  
  created_by: number | null;  
  updated_by: number | null;  
  created_at: string;  
  updated_at: string; 
  deleted_at: string; 
  jobOrder: {
    no: string;
    type: string;
    date: string;
    mid: string;
    tid: string;
    status: string;
    merchant_name: string;
    address1: string;
    address2: string;
    address3: string;
    address4: string;
    merchant_category: string;
    ownership: string;
  };
  vendor: {
    id: number;
    name: string;
    code: string;
    description: string | null;
  };
  region: {
    id: number;
    name: string;
    code: string;
    description?: string | null;
  };
}

export interface ICreateApproveDto {
  id_jobOrder: number;
  vendor_id: number;
  region_id: number;
  status: string;
  approved_by?: number;
  rejected_by?: number;
  created_by?: number;
  updated_by?: number;
}
