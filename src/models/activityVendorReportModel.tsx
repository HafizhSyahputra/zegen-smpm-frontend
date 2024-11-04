
export interface IActivityVendorReportModel {
    id: number;
    job_order_no: string;
    vendor_id: number;
    nominal?: string;
    mid?: string;
    tid?: string;
    status?: string;
    jenis?: string;
    description?: string;
    amount?: string;
    petugas?: string;
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
    vendor: {
        name: string;
    };
    edc: {
        tid: string;
    };
    merchant: {
        mid: string;
    };
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