export interface StagingJobOrder {  
  id: number;  
  job_order_no: string;  
  staging_id: number;  
  petugas: string | null;  
  reason: string | null;  
  photo_evidence: string | null;  
  photo_optional: string | null;  
  created_at: string;  
  updated_at: string;  
  updated_by: number | null;  
  jobOrderReport?: JobOrderReport;  
  staging?: {  
    id_staging: number;  
    name: string;  
  };  
  jobOrder?: {  
    no: string;  
  };  
}  

export interface Staging {  
  id_staging: number; // Primary key, auto-incrementing integer  
  name: string; // Name of the staging  
  staging: number; // Unique staging identifier  
  description?: string; // Optional description  
  created_by?: number; // Optional: User ID who created the record  
  updated_by?: number; // Optional: User ID who updated the record  
  created_at: Date; // Timestamp of creation  
  updated_at: Date; // Timestamp of update  
}  

export interface JobOrder {  
  no:string;
  id: number; // Primary key  
  vendor_id: number; // Vendor ID  
  region_id: number; // Region ID  
}  

export interface JobOrderReport {  
  id: number; // Primary key  
  MediaJobOrderReportProofOfVisit: MediaJobOrderReportProofOfVisit[]; // Ubah menjadi array  
  MediaJobOrderReportOptionalPhoto: MediaJobOrderReportOptionalPhoto[]; // Ubah menjadi array  
  job_order_no?: string;  
  nominal?: string;  
  status?: string;  
  status_approve?: string;  
  reason?: string;  
  info_remark?: string;  
  edc_brand?: string;  
  edc_brand_type?: string;  
  edc_serial_number?: string;  
  edc_note?: string;  
  edc_action?: string;  
  edc_second_brand?: string;  
  edc_second_brand_type?: string;  
  edc_second_serial_number?: string;  
  edc_second_note?: string;  
  edc_second_action?: string;  
  information?: string;  
  arrival_time?: string;  
  start_time?: string;  
  end_time?: string;  
  communication_line?: string;  
  direct_line_number?: string;  
  simcard_provider?: string;  
  paper_supply?: string;  
  merchant_pic?: string;  
  merchant_pic_phone?: string;  
  swipe_cash_indication?: string;  
  created_by?: number;  
  updated_by?: number;  
  created_at?: Date;  
  updated_at?: Date;  
  deleted_at?: Date;  
}

export interface PreventiveMaintenanceReport {  
  id: number; // Primary key  
  // Other properties as required based on your PreventiveMaintenanceReport model  
}
export interface Media {  
  id: number;  
  filename: string;  
  ext?: string;  
  size?: number;  
  mime?: string;  
  path: string;  
  destination?: string;  
  created_by?: number;  
  updated_by?: number;  
  created_at?: Date;  
  updated_at?: Date;  
  deleted_at?: Date;  
}  

export interface MediaJobOrderReportProofOfVisit {  
  id: number;  
  media_id?: number;  
  job_order_report_id?: number;  
  created_by?: number;  
  updated_by?: number;  
  created_at?: Date;  
  updated_at?: Date;  
  deleted_at?: Date;  
  media?: Media;  
}  

export interface MediaJobOrderReportOptionalPhoto {  
  id: number;  
  media_id?: number;  
  job_order_report_id?: number;  
  created_by?: number;  
  updated_by?: number;  
  created_at?: Date;  
  updated_at?: Date;  
  deleted_at?: Date;  
  media?: Media;  
}