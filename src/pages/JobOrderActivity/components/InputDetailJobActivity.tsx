import React, { useEffect, useState } from "react";  
import FormFieldInputDetailJobActivity from "@smpm/components/FormFields/FormFieldInputDetailJobActivity";  
import { findJobOrder } from "@smpm/services/jobOrderService";  
import { useParams } from "react-router-dom";  
import dayjs from "dayjs";  
import { Skeleton } from "antd";  

type InputDetailJobActivityProps = {  
  hide?: boolean;  
};  

const InputDetailJobActivity: React.FC<InputDetailJobActivityProps> = ({  
  hide,  
}) => {  
  const { no_jo } = useParams<{ no_jo?: string }>();  
  const [jobOrder, setJobOrder] = useState<any>(null);  
  const [loading, setLoading] = useState(true);  

  useEffect(() => {  
    const fetchJobOrder = async () => {  
      if (typeof no_jo === "string") {  
        try {  
          const jobOrderData = await findJobOrder(no_jo);  
          setJobOrder(jobOrderData);  
        } catch (error) {  
          console.error("Error fetching job order:", error);  
        } finally {  
          setLoading(false);  
        }  
      }  
    };  

    fetchJobOrder();  
  }, [no_jo]);  

  if (!jobOrder) {  
    return (  
      <div style={{ display: hide ? "none" : "block" }}>  
        <Skeleton active paragraph={{ rows: 6 }} />  
      </div>  
    );  
  }  

  const { result } = jobOrder;  

  const jobOrderReport =  
    result.JobOrderReport.length > 0  
      ? result.JobOrderReport[0]  
      : result.PreventiveMaintenanceReport[0] || {};  

  const isDoneStatus = result.status === "Done";  

  const arrival_time = isDoneStatus ? dayjs(jobOrderReport.arrival_time) : undefined;  
  const start_time = isDoneStatus ? dayjs(jobOrderReport.start_time) : undefined;  
  const end_time = isDoneStatus ? dayjs(jobOrderReport.end_time) : undefined;  

  return (  
    <div style={{ display: hide ? "none" : "block" }}>  
      {loading ? (  
        <Skeleton active paragraph={{ rows: 6 }} />  
      ) : (  
        <FormFieldInputDetailJobActivity  
          arrival_time={arrival_time}  
          start_time={start_time}  
          end_time={end_time}  
          communication_line={isDoneStatus ? jobOrderReport.communication_line : ""}  
          direct_line_number={isDoneStatus ? jobOrderReport.direct_line_number : ""}  
          simcard_provider={isDoneStatus ? jobOrderReport.simcard_provider : ""}  
          paper_supply={isDoneStatus ? jobOrderReport.paper_supply : ""}  
          merchant_pic={isDoneStatus ? jobOrderReport.merchant_pic : ""}  
          phone_provider={isDoneStatus ? jobOrderReport.merchant_pic_phone : ""}  
          swipe_cash_indication={isDoneStatus ? jobOrderReport.swipe_cash_indication : ""}  
          readOnly={isDoneStatus}  
        />  
      )}  
    </div>  
  );  
};  

export default InputDetailJobActivity;