
import axios from "@smpm/services/axios";
import { IAuditTrail } from "@smpm/models/auditModel";

interface ApiResponse {
  status: {
    code: number;
    description: string;
  };
  result: {
    result: IAuditTrail[];
  };
}

export const getAuditTrails = async (): Promise<ApiResponse> => {  
  try {  
    const response = await axios.get<ApiResponse>("/audit/all");  
    return response.data;
  } catch (error) {  
    console.error('Error fetching audit trails:', error);  
    throw error;
  }  
};

export const exportAuditLogs = async (menuName: string): Promise<void> => {  
  try {  
    const response = await axios.get(`/audit/export?menuName=${menuName}`, { responseType: 'blob' });  
    
    const url = window.URL.createObjectURL(new Blob([response.data]));  
    const link = document.createElement('a');  
    link.href = url;  
    link.setAttribute('download', 'audit_logs_authentication.xlsx');  
    document.body.appendChild(link);  
    link.click();  
    link.remove();  
  } catch (error) {  
    console.error('Error exporting audit logs:', error);  
    throw error;  
  }  
};
export const exportSystemAuditLogs = async (): Promise<void> => {  
  try {  
    const response = await axios.get('/audit/SystemExport', { responseType: 'blob' });  
    
    const url = window.URL.createObjectURL(new Blob([response.data]));  
    const link = document.createElement('a');  
    link.href = url;  
    link.setAttribute('download', 'audit_logs.xlsx');   
    document.body.appendChild(link);  
    link.click();  
    link.remove();  
  } catch (error) {  
    console.error('Error exporting audit logs:', error);  
    throw error;  
  }  
};  