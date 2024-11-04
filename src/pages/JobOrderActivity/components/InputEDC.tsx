import FormFieldInputListEDC from "@smpm/components/FormFields/FormFieldInputListEDC";  
import FormFieldReceivedOutEDC from "@smpm/components/FormFields/FormFieldReceivedOutEdc";  
import FormFieldSerialNumberEDC from "@smpm/components/FormFields/FormFieldSerialNumberEDC";  
import { findJobOrder } from "@smpm/services/jobOrderService";  
import { Divider, Skeleton, Typography } from "antd";  
import { useEffect, useState } from "react";  
import { useParams } from "react-router-dom";  

const { Title, Text } = Typography;  

type InputEDCProps = {  
  hide?: boolean;  
};  

const InputEDC: React.FC<InputEDCProps> = ({ hide }) => {  
  const { no_jo } = useParams<{ no_jo?: string }>();  
  const [jobOrder, setJobOrder] = useState<any>(null);  
  const [isCMJobOrder, setIsCMJobOrder] = useState(false);  
  const [_isPreventiveMaintenanceJobOrder, setIsPreventiveMaintenanceJobOrder] = useState(false);  
  const [loading, setLoading] = useState(true);  

  useEffect(() => {  
    const fetchJobOrder = async () => {  
      if (typeof no_jo === "string") {  
        try {  
          const jobOrderData = await findJobOrder(no_jo);  
          setJobOrder(jobOrderData);  
          setIsCMJobOrder(jobOrderData.result.type === "CM Replace");  
          setIsPreventiveMaintenanceJobOrder(jobOrderData.result.type === "Preventive Maintenance");  
        } catch (error) {  
          console.error("Error fetching job order:", error);  
        } finally {  
          setLoading(false);  
        }  
      } else {  
        console.error("No job order number found in the URL");  
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

  const isDoneStatus = jobOrder.result.status === "Done";  
  const jobOrderReport = jobOrder.result.JobOrderReport[0] || {};  
  const preventiveMaintenanceReport = jobOrder.result.PreventiveMaintenanceReport[0] || {};  
  const reportToUse = Object.keys(jobOrderReport).length > 0 ? jobOrderReport : preventiveMaintenanceReport;  
  const products = reportToUse.JobOrderReportProduct || [];  

  return (  
    <div style={{ display: hide ? "none" : "block" }}>  
      <>  
        <Title level={5}>EDC</Title>  
        {loading ? (  
          <Skeleton active paragraph={{ rows: 3 }} />  
        ) : (  
          <FormFieldSerialNumberEDC  
            brand={isDoneStatus ? reportToUse.edc_brand : ""}  
            brand_type={isDoneStatus ? reportToUse.edc_brand_type : ""}  
            serial_number={isDoneStatus ? reportToUse.edc_serial_number : ""}  
            notes={isDoneStatus ? reportToUse.edc_note : ""}  
            action={isDoneStatus ? reportToUse.edc_action : ""}  
            status={isDoneStatus ? "done" : "editable"}  
          />  
        )}  
      </>  
      {isCMJobOrder && (  
        <>  
          <Title level={5}>Out EDC</Title>  
          {loading ? (  
            <Skeleton active paragraph={{ rows: 3 }} />  
          ) : (  
            <FormFieldReceivedOutEDC  
              isRequired={true}  
              brand={isDoneStatus ? reportToUse.edc_second_brand : ""}  
              brand_type={isDoneStatus ? reportToUse.edc_second_brand_type : ""}  
              serial_number={isDoneStatus ? reportToUse.edc_second_serial_number : ""}  
              notes={isDoneStatus ? reportToUse.edc_second_note : ""}  
              action={isDoneStatus ? reportToUse.edc_second_action : ""}  
              status={isDoneStatus ? "done" : "editable"}  
            />  
          )}  
        </>  
      )}  
      <Divider />  
      <Title level={5}>Products</Title>  
      {loading ? (  
        <Skeleton active paragraph={{ rows: 3 }} />  
      ) : isDoneStatus && products.length === 0 ? (  
        <Text type="secondary">Tidak ada data produk yang ditambahkan.</Text>  
      ) : (  
        <FormFieldInputListEDC disabled={isDoneStatus} products={products} />  
      )}  
    </div>  
  );  
};  

export default InputEDC;