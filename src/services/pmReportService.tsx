import { IBaseResponseService, IPaginationRequest, IPaginationResponse } from "@smpm/models";
import { IPreventiveMaintenanceReportModel } from "@smpm/models/pmReportModel";
import axios from "@smpm/services/axios"
import saveAs from "file-saver";

export const getPMReports = async (  
	param: IPaginationRequest & { search_by: string[] }   
): Promise<IBaseResponseService<IPaginationResponse<IPreventiveMaintenanceReportModel>>> => {  
	const response = await axios.get("/preventive-maintenance-report", {  
		params: param,  
	});  
	return response.data;  
};  

export const downloadPreventiveSLA = async () => {  
	const response = await axios.get("/sla/export/Preventive", {  
	  responseType: "blob",  
	})  
	saveAs(response.data, "preventive_sla.xlsx")  
  }  