import { IBaseResponseService, IPaginationRequest, IPaginationResponse } from "@smpm/models";
import { IActivityVendorReportModel } from "@smpm/models/activityVendorReportModel";
import axios from "@smpm/services/axios"

export const getActivityVendorReport = async (  
	param: IPaginationRequest & { search_by: string[] }   
): Promise<IBaseResponseService<IPaginationResponse<IActivityVendorReportModel>>> => {  
	const response = await axios.get("/activity-vendor-report", {  
		params: param,  
	});  
	return response.data;  
};  