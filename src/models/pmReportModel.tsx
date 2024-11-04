export interface IPreventiveMaintenanceReportModel {
  id: number;
  job_order_no: string;
  status: string;
  reason?: string;
  edc_brand: string;
  edc_brand_type: string;
  edc_serial_number: string;
  edc_note: string;
  edc_action: string;
  information: string;
  arrival_time: Date;
  start_time: Date;
  end_time: Date;
  communication_line: string;
  direct_line_number: string;
  simcard_provider: string;
  paper_supply: string;
  merchant_pic: string;
  merchant_pic_phone: string;
  swipe_cash_indication: string;
  created_by: number;
  updated_by: number;
  job_order: {
    type: string;
    date: string;
    mid: string;
    tid: string;
    merchant_name: string;
    region: string;
    vendor_id: number;
    merchant_id: number;
    status: string;
  };
}
