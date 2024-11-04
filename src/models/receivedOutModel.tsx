// src/models/receivedOutModel.ts

export interface JobOrder {
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

export interface Vendor {
  id: number;
  name: string;
  code: string;
  description: string | null;
}

export interface Region {
  id: number;
  name: string;
  code: string;
  description?: string | null;
}

export interface Merchant {
  id: number;
  name: string;
  // Add other fields as needed
}

export interface EDC {
  id: number;
  tid: string;
  brand: string;
  brand_type: string;
  serial_number: string;
  // Add other properties as needed
}

export interface ReceivedOutItem {
  id: number;
  id_joborder: number;
  id_edc: number;
  id_region: number;
  id_vendor: number;
  id_merchant: number;
  petugas: string;
  kondisibarang : string,
  status: string;
  approved_by: number | null;
  created_by: number | null;
  updated_by: number | null;
  created_at: string; // Use string for dates on frontend
  updated_at: string;
  serial_number?: string;
  tid?: string;
  deleted_at: string | null;
  joborder?: JobOrder;    // Made optional
  vendor?: Vendor;        // Made optional
  region?: Region;        // Made optional
  merchant?: Merchant;    // Made optional
  edc?: EDC;              // Made optional
}