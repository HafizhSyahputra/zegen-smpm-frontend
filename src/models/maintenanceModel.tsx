export interface IMaintenanceModel {  
    id?: number;  
    maintenance_id: string;  
    merchant_name: string;  
    terminal_id: string;  
    maintenance_type: string;  
    status: string;  
    maintenance_date: string;  
  }  
  
  export interface IMaintenanceResponse {  
    result: {  
      data: IMaintenanceModel[];  
      meta: {  
        page: number;  
        take: number;  
        item_count: number;  
        page_count: number;  
      };  
    };  
  }  
  
  export interface IMaintenanceQueryParams {  
    order?: 'ASC' | 'DESC';  
    order_by?: string;  
    search?: string;  
    search_by?: string;  
    page?: number;  
    take?: number;  
  }