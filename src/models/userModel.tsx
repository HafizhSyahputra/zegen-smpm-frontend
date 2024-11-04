export const userSearchColumn = ["id", "name", "email", "role", "npp", "phone"]  

export interface IUserModel {  
  id: number  
  role_id: number  
  region_id: number  
  vendor_id: number  
  name: string  
  email: string  
  password: string  
  npp: string  
  dob: string  
  phone: string  
  created_by: number  
  updated_by: number  
  created_at: string  
  updated_at: string  
  deleted_at: string | null  
}