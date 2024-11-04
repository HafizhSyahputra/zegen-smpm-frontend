import { Checkbox, Col, Form, Row, Skeleton } from "antd";  
import { findJobOrder } from "@smpm/services/jobOrderService";  
import { useParams } from "react-router-dom";  
import { useEffect, useState } from "react";  

const CheckboxGroup = Checkbox.Group;  

const EDC_DONGLE_CHECKLIST = [  
  { label: "Tutup Baterai", value: "battery_cover" },  
  { label: "Baterai", value: "battery" },  
  { label: "Adaptor EDC", value: "edc_adapter" },  
  { label: "Bracket EDC", value: "edc_bracket" },  
  { label: "Dudukan EDC", value: "edc_holder" },  
  { label: "Dudukan Dongle", value: "dongle_holder" },  
  { label: "Adaptor Dongle", value: "dongle_adapter" },  
  { label: "Kabel ECR", value: "cable_ecr" },  
  { label: "Kabel LAN", value: "cable_lan" },  
  { label: "Kabel Line Telepon", value: "cable_telephone_line" },  
  { label: "Label MID/TID", value: "mid_tid" },  
  { label: "Magic Box", value: "magic_box" },  
  { label: "Panduan Transaksi", value: "transaction_guide" },  
  { label: "Pin Cover", value: "pin_cover" },  
  { label: "Spliter Line Telepon", value: "telephone_line_splitter" },  
  { label: "Sticker Bank", value: "sticker_bank" },  
  { label: "Sticker Dongle", value: "sticer_dongle" },  
  { label: "Sticker GPN", value: "sticer_gpn" },  
  { label: "Sticker QR Code", value: "sticker_qrcode" },  
];  

const PROMOTIONAL_MATERIAL_CHECKLIST = [  
  { label: "Flayer", value: "flyer" },  
  { label: "Tendcard", value: "tent_card" },  
  { label: "Card Holder", value: "holder_card" },  
  { label: "Pen Holder", value: "holder_pen" },  
  { label: "Bill Holder", value: "holder_bill" },  
  { label: "Sign Pad", value: "sign_pad" },  
  { label: "Pen", value: "pen" },  
  { label: "Acrylic Open Close", value: "acrylic_open_close" },  
  { label: "Sticker Logo", value: "logo_sticker" },  
  { label: "Banner", value: "banner" },  
];  

const TRAINING_MATERIAL_CHECKLIST = [  
  { label: "Fraud Awareness", value: "fraud_awareness" },  
  { label: "Sale/Void/Settlement/Logon", value: "sale_void_settlement_logon" },  
  { label: "Installment", value: "installment" },  
  { label: "Audit Report", value: "audit_report" },  
  { label: "Top Up", value: "top_up" },  
  { label: "Redeem Point", value: "redeem_point" },  
  { label: "Cardver/Pre Auth/Offline", value: "cardverif_preauth_offline" },  
  { label: "Manual Key In", value: "manual_key_in" },  
  { label: "Tips and Adjust", value: "tips_adjust" },  
  { label: "Mini ATM", value: "mini_atm" },  
  { label: "Fare & Non Fare", value: "fare_non_fare" },  
  { label: "DCC/Download BIN", value: "dcc_download_bin" },  
  { label: "First Level Maintenance", value: "first_level_maintenance" },  
  {  
    label: "Penyimpanan Struk Transaksi",  
    value: "transaction_receipt_storage",  
  },  
];  

type JobChecklistProps = {  
  hide?: boolean;  
};  

const JobChecklist: React.FC<JobChecklistProps> = ({ hide }) => {  
  const { no_jo } = useParams<{ no_jo?: string }>();  
  const [jobOrder, setJobOrder] = useState<any>(null);  
  const [isDoneStatus, setIsDoneStatus] = useState(false);  
  const [edcDongleEquipment, setEdcDongleEquipment] = useState<string[]>([]);  
  const [materialPromo, setMaterialPromo] = useState<string[]>([]);  
  const [materialTraining, setMaterialTraining] = useState<string[]>([]);  
  const [loading, setLoading] = useState(true);  

  useEffect(() => {  
    const fetchJobOrder = async () => {  
      if (typeof no_jo === "string") {  
        try {  
          const jobOrder = await findJobOrder(no_jo);  
          setJobOrder(jobOrder);  
          setIsDoneStatus(jobOrder.result.status === "Done");  

          let edcEquipment, promoMaterials, trainingMaterials;  
          if (jobOrder.result.JobOrderReport && jobOrder.result.JobOrderReport.length > 0) {  
            edcEquipment = jobOrder.result.JobOrderReport[0].JobOrderReportEdcEquipmentDongle[0];  
            promoMaterials = jobOrder.result.JobOrderReport[0].JobOrderReportMaterialPromo[0];  
            trainingMaterials = jobOrder.result.JobOrderReport[0].JobOrderReportMaterialTraining[0];  
          } else if (jobOrder.result.PreventiveMaintenanceReport && jobOrder.result.PreventiveMaintenanceReport.length > 0) {  
            edcEquipment = jobOrder.result.PreventiveMaintenanceReport[0].JobOrderReportEdcEquipmentDongle[0];  
            promoMaterials = jobOrder.result.PreventiveMaintenanceReport[0].JobOrderReportMaterialPromo[0];  
            trainingMaterials = jobOrder.result.PreventiveMaintenanceReport[0].JobOrderReportMaterialTraining[0];  
          } else {  
            console.error("No report data found in the job order");  
            return;  
          }  

          const filteredEdcDongleEquipment = Object.keys(edcEquipment).filter(key => edcEquipment[key] === true);  
          const filteredMaterialPromo = Object.keys(promoMaterials).filter(key => promoMaterials[key] === true);  
          const filteredMaterialTraining = Object.keys(trainingMaterials).filter(key => trainingMaterials[key] === true);  

          setEdcDongleEquipment(filteredEdcDongleEquipment);  
          setMaterialPromo(filteredMaterialPromo);  
          setMaterialTraining(filteredMaterialTraining);  
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

  const renderCheckboxItem = (  
    option: { label: string; value: string },  
    value: string[],  
    isDone: boolean,  
    setState: React.Dispatch<React.SetStateAction<string[]>>  
  ) => {  
    const isChecked = value.includes(option.value);  

    const labelStyle = {  
      color: isDone ? (isChecked ? "black" : "gray") : "black",  
      fontWeight: "semibold",  
    };  

    return (  
      <div key={option.value} style={{ display: "flex", alignItems: "center" }}>  
        <Checkbox  
          checked={isDone ? isChecked : isChecked}  
          disabled={isDone}  
          onChange={(e) => {  
            if (!isDone) {  
              if (e.target.checked) {  
                setState((prev) => [...prev, option.value]);  
              } else {  
                setState((prev) => prev.filter((item) => item !== option.value));  
              }  
            }  
          }}  
          style={{ marginRight: "8px" }}  
        >  
          <span style={labelStyle}>{option.label}</span>  
        </Checkbox>  
      </div>  
    );  
  };  

  return (  
    <div style={{ display: hide ? "none" : "block" }}>  
      <Row>  
        <Col xs={12} md={8}>  
          <Form.Item label={"Kelengkapan EDC Dongle"} name={"edc_dongle_equipment"}>  
            {loading ? (  
              <Skeleton active paragraph={{ rows: 6 }} />  
            ) : isDoneStatus ? (  
              EDC_DONGLE_CHECKLIST.map((option) =>  
                renderCheckboxItem(option, edcDongleEquipment, isDoneStatus, setEdcDongleEquipment)  
              )  
            ) : (  
              <CheckboxGroup options={EDC_DONGLE_CHECKLIST} style={{ display: "grid" }} />  
            )}  
          </Form.Item>  
        </Col>  
        <Col xs={12} md={8}>  
          <Form.Item label={"Material Promo"} name={"material_promo"}>  
            {loading ? (  
              <Skeleton active paragraph={{ rows: 6 }} />  
            ) : isDoneStatus ? (  
              PROMOTIONAL_MATERIAL_CHECKLIST.map((option) =>  
                renderCheckboxItem(option, materialPromo, isDoneStatus, setMaterialPromo)  
              )  
            ) : (  
              <CheckboxGroup options={PROMOTIONAL_MATERIAL_CHECKLIST} style={{ display: "grid" }} />  
            )}  
          </Form.Item>  
        </Col>  
        <Col xs={12} md={8}>  
          <Form.Item label={"Materi Training"} name={"material_training"}>  
            {loading ? (  
              <Skeleton active paragraph={{ rows: 6 }} />  
            ) : isDoneStatus ? (  
              TRAINING_MATERIAL_CHECKLIST.map((option) =>  
                renderCheckboxItem(option, materialTraining, isDoneStatus, setMaterialTraining)  
              )  
            ) : (  
              <CheckboxGroup options={TRAINING_MATERIAL_CHECKLIST} style={{ display: "grid" }} />  
            )}  
          </Form.Item>  
        </Col>  
      </Row>  
    </div>  
  );  
};  

export default JobChecklist;