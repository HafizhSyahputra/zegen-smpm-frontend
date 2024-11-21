export interface IBeritaAcaraModel {  
    id_berita_acara: number; 
    id_vendor: number;  
    path_file: string;
    job_order_ids: number[]; 
    job_order_report_ids: number[]; 
    tgl_submit?: string | moment.Moment; 
    note?: string;           
    status: string;          
    subject: string;         
    harga_total: string;     
    created_by: number;      
    updated_by: number;       
    created_at: Date;         
    updated_at: Date; 
    deleted_at?: Date | null;  
    [key: string]: any;
  }