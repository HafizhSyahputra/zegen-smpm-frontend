
import { getUser } from "./userService";
import { getAllRegion } from "./regionService";
import { getRole } from "./roleService";
import { getAllVendor } from "./vendorService";
import { getDataMerchant } from "./merchantService";
import { IPaginationEDCRequest, IPaginationRequest } from "@smpm/models";
import { getDataEDC } from "./edcService";
import { DashboardCounts } from "@smpm/models/dashboardModel";

const defaultPaginationRequest: IPaginationRequest = {  
    page: 1,  
    take: 10,  
    order: 'asc',  
    order_by: 'id' 
  };  

const defaultPaginationEDC: IPaginationEDCRequest = {
  page: 1,
  take: 10,
  order: 'asc',
};  
  
  export const fetchDashboardCounts = async (): Promise<DashboardCounts> => {  
    try {  
      const [users, regions, roles, vendors, merchants, edcData] = await Promise.all([  
        getUser(defaultPaginationRequest),  
        getAllRegion(),  
        getRole(defaultPaginationRequest),  
        getAllVendor(),  
        getDataMerchant(defaultPaginationRequest),  
        getDataEDC(defaultPaginationEDC),  
      ]);  
  
      return {  
        userCount: users.result.meta.item_count || 0,  
        groupRolesCount: roles.result.data?.length || 0,  
        wilayahCount: regions.result.length || 0,  
        vendorCount: vendors.result.length || 0,  
        midCount: merchants.result.data?.length || 0,  
        tidCount: edcData.result.data?.length || 0,  
      };  
    } catch (error) {  
      console.error('Error fetching dashboard counts:', error);  
      throw error;  
    }  
  };