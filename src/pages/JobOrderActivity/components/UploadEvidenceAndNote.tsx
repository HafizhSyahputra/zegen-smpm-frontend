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
  const [isCancelledStatus, setIsCancelledStatus] = useState(false);  
  const [isLoading, setIsLoading] = useState(true);  

  useEffect(() => {  
    const fetchJobOrder = async () => {  
      try {  
        if (typeof no_jo === "string") {  
          const jobOrder = await findJobOrder(no_jo);  
          setJobOrder(jobOrder);  
          setIsDoneStatus(jobOrder.result.status === "Done");  
          setIsCancelledStatus(jobOrder.result.status === "Cancel");  
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

  const doneJobOrderReport = jobOrder.result.JobOrderReport.find(  
    (report: any) => report.status === "Done"  
  );  
  const donePmReport = jobOrder.result.PreventiveMaintenanceReport.find(  
    (report: any) => report.status === "Done"  
  );  

  const reportToUse = doneJobOrderReport || donePmReport;  

  const description = isCancelledStatus ? "" : reportToUse ? reportToUse.information : "";  
  const proofOfVisitImages = reportToUse?.MediaJobOrderReportProofOfVisit  
    .filter((media: any) => media.media_id)  
    .map((media: any) => ({  
      media_id: media.media_id,  
      media: { path: `http://localhost:46/media/${media.media_id}` },  
    })) || [];  
  const optionalImages = reportToUse?.MediaJobOrderReportOptionalPhoto  
    .filter((media: any) => media.media_id)  
    .map((media: any) => ({  
      media_id: media.media_id,  
      media: { path: `http://localhost:46/media/${media.media_id}` },  
    })) || [];  

  return (  
    <div style={{ display: hide ? "none" : "block" }}>  
      <Title level={5}>Upload Evidence and Note</Title>  
      <FormFieldDescriptionAndEvidence  
        description={description}  
        proofOfVisitImages={isCancelledStatus ? [] : proofOfVisitImages}  
        optionalImages={isCancelledStatus ? [] : optionalImages}  
        isDone={isDoneStatus}  
        isCancelled={isCancelledStatus}  
      />  
    </div>  
  );  
};  

export default UploadEvidenceAndNote;