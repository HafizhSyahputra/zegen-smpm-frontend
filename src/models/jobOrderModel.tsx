
export interface IJobOrderModel {  
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
}

export interface Document {  
  result: {
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
    vendor: {  
      name: string;  
    };  
    JobOrderReport: {  
      id: number;  
      job_order_no: string;  
      status: string;  
      reason?: string;  
      edc_brand: string;  
      edc_brand_type: string;  
      edc_serial_number: string;  
      edc_note: string;  
      edc_action: string;  
      edc_second_brand: string;  
      edc_second_brand_type: string;  
      edc_second_serial_number: string;  
      edc_second_note: string;  
      edc_second_action: string;  
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
    };  
    PreventiveMaintenanceReport: {  
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
    };  
  }
}
export interface IFormInputImportJobOrder {
  files: File;
}



export interface IJobOrderReportModel {
  id: number;
  job_order_no: string;
  status: string;
  reason?: string;
  edc_brand: string;
  edc_brand_type: string;
  edc_serial_number: string;
  edc_note: string;
  edc_action: string;
  edc_second_brand: string;
  edc_second_brand_type: string;
  edc_second_serial_number: string;
  edc_second_note: string;
  edc_second_action: string;
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

export interface IFormImportJobOrder {
  onFinish?: (values: any) => void;
  initialValues?: IFormInputImportJobOrder;
  isLoading?: boolean;
  onReset?: () => void;
}

export interface ReportPDFProps {
  data: {
    job_order_no: string;
    job_order: {
      preventive_type: string;
      merchant_name: string;
      vendor: {
        name: string;
      }
      mid: string;
      target_date: string;
      type: string;
      tid: string;
      case_type: string;
      city: string;
      merchant: {
        mid: string;
        address1: string;
        address2: string;
        address3: string;
        address4: string;
        city: string;
        province: string;
        postal_code: string;
        village: string;
        customer_name: string;
        phone1: string;
        phone2: string;
      }
    };
    products: {
      name: string;
      serial_number: string;
      notes: string;
      action: string;
    }[];
    status: string;
    status_approve: string;
    arrival_time: string;
    start_time: string;
    end_time: string;
    communication_line: string;
    direct_line_number: string;
    simcard_provider: string;
    paper_supply: string;
    merchant_pic: string;
    merchant_pic_phone: string;
    swipe_cash_indication: string;
    information: string;
    cancel_reason?: string;
    reason: string;
    info_remark: string;
    dongle: {
      battery_cover: boolean;
      battery: boolean;
      edc_adapter: boolean;
      edc_bracket: boolean;
      edc_holder: boolean;
      dongle_holder: boolean;
      dongle_adapter: boolean;
      cable_ecr: boolean;
      cable_lan: boolean;
      cable_telephone_line: boolean;
      mid_tid: boolean;
      magic_box: boolean;
      transaction_guide: boolean;
      pin_cover: boolean;
      telephone_line_splitter: boolean;
      sticker_bank: boolean;
      sticer_dongle: boolean;
      sticer_gpn: boolean;
      sticker_qrcode: boolean;
    };
    promo_materials: {
      flyer: boolean;
      tent_card: boolean;
      holder_card: boolean;
      holder_pen: boolean;
      holder_bill: boolean;
      sign_pad: boolean;
      pen: boolean;
      acrylic_open_close: boolean;
      logo_sticker: boolean;
      banner: boolean;
    };
    training_materials: {
      fraud_awareness: boolean;
      sale_void_settlement_logon: boolean;
      installment: boolean;
      audit_report: boolean;
      top_up: boolean;
      redeem_point: boolean;
      cardverif_preauth_offline: boolean;
      manual_key_in: boolean;
      tips_adjust: boolean;
      mini_atm: boolean;
      fare_non_fare: boolean;
      dcc_download_bin: boolean;
      first_level_maintenance: boolean;
      transaction_receipt_storage: boolean;
    };
    proofOfVisitImages: ProofOfVisitImage[];
    optionalPhotos: OptionalImage[];
  };
}

interface ProofOfVisitImage {
  media: {
    path: string;
  };
}
interface OptionalImage {
  media: {
    path: string;
  };
}  
