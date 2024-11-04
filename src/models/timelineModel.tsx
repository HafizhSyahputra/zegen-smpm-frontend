export interface StagingJobOrder {  
  id: number; // Primary key, auto-incrementing integer  
  job_order_no: string; // Associated Job Order Number, should be unique  
  jo_report_id?: number; // Optional: Report ID for Job Order  
  pm_report_id?: number; // Optional: Report ID for Preventive Maintenance  
  staging_id: number; // Reference to Staging model  
  petugas?: string; // Personnel In Charge  
  text?: string; // Additional Text Information  
  reason?: string; // Reason for Staging Job Order  
  photo_evidence?: string; // Optional URL or path to Photo Evidence  
  photo_optional?: string; // Optional URL or path for additional Photos  
  info_remark?: string; // Remarks or Notes  
  created_by?: number; // Optional: User ID who created the record  
  updated_by?: number; // Optional: User ID who updated the record  
  created_at: Date; // Timestamp of creation  
  updated_at: Date; // Timestamp of update  
  deleted_at?: Date; // Optional timestamp for soft deletion  

  // Relationship properties (optional, depending on your need to reference related models)  
  staging?: Staging; // Optional relationship to Staging model  
  jobOrder?: JobOrder; // Optional relationship to JobOrder model  
  jobOrderReport?: JobOrderReport; // Optional relationship to JobOrderReport  
  preventiveMaintenanceReport?: PreventiveMaintenanceReport; // Optional relationship to PreventiveMaintenanceReport  
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
  id: number; // Primary key  
  vendor_id: number; // Vendor ID  
  region_id: number; // Region ID  
  // Other properties as required based on your JobOrder model  
}  

export interface JobOrderReport {  
  id: number; // Primary key  
  // Other properties as required based on your JobOrderReport model  
}  

export interface PreventiveMaintenanceReport {  
  id: number; // Primary key  
  // Other properties as required based on your PreventiveMaintenanceReport model  
}