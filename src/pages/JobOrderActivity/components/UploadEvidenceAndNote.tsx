import React, { useEffect, useState } from "react";  
import FormFieldDescriptionAndEvidence from "@smpm/components/FormFields/FormFieldDescriptionAndEvidence";  
import { findJobOrder } from "@smpm/services/jobOrderService";  
import { useParams } from "react-router-dom";  
import { Typography, Skeleton } from "antd";  

const { Title } = Typography;  

type UploadEvidenceAndNoteProps = {  
  hide?: boolean;  
};  

const UploadEvidenceAndNote: React.FC<UploadEvidenceAndNoteProps> = ({ hide }) => {  
  const { no_jo } = useParams<{ no_jo?: string }>();  
  const [jobOrder, setJobOrder] = useState<any>(null);  
  const [isDoneStatus, setIsDoneStatus] = useState(false);  
  const [isLoading, setIsLoading] = useState(true);  

  useEffect(() => {  
    const fetchJobOrder = async () => {  
      try {  
        if (typeof no_jo === "string") {  
          const jobOrder = await findJobOrder(no_jo);  
          setJobOrder(jobOrder);  
          setIsDoneStatus(jobOrder.result.status === "Done");  
          setIsLoading(false);  
        } else {  
          console.error("No job order number found in the URL");  
        }  
      } catch (error) {  
        console.error("Error fetching job order:", error);  
        setIsLoading(false);  
      }  
    };  

    fetchJobOrder();  
  }, [no_jo]);  

  if (isLoading) {  
    return (  
      <div style={{ display: hide ? "none" : "block" }}>  
        <Title level={5}>  
          <Skeleton.Input active style={{ width: 200 }} />  
        </Title>  
        <Skeleton active />  
      </div>  
    );  
  }  

  if (!jobOrder) {  
    return null;  
  }  

  const jobOrderReport = jobOrder.result.JobOrderReport[0];  
  const pmReport = jobOrder.result.PreventiveMaintenanceReport[0];  

  const reportToUse = jobOrderReport && jobOrderReport.id ? jobOrderReport : pmReport;  

  const description = reportToUse ? reportToUse.information : "";  

  const proofOfVisitImages = reportToUse?.MediaJobOrderReportProofOfVisit  
    .filter((media: any) => {  
      return media.media_id;  
    })  
    .map((media: any) => {  
      const mediaId = media.media_id;  
      const path = `http://localhost:46/media/${mediaId}`;  
      return {  
        media_id: mediaId,  
        media: { path },  
      };  
    }) || [];  

  const optionalImages = reportToUse?.MediaJobOrderReportOptionalPhoto  
    .filter((media: any) => {  
      console.log("Filtering Optional Media:", media);  
      return media.media_id;  
    })  
    .map((media: any) => {  
      const mediaId = media.media_id;  
      const path = `http://localhost:46/media/${mediaId}`;  
      return {  
        media_id: mediaId,  
        media: { path },  
      };  
    }) || [];  

  return (  
    <div style={{ display: hide ? "none" : "block" }}>  
      <Title level={5}>Upload Evidence and Note</Title>  
      <FormFieldDescriptionAndEvidence  
        description={description}  
        proofOfVisitImages={proofOfVisitImages}  
        optionalImages={optionalImages}  
        isDone={isDoneStatus}  
      />  
    </div>  
  );  
};  

export default UploadEvidenceAndNote;