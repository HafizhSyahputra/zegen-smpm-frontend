import React, { useState } from "react";  
import { Form, Input, Image, Button, Select } from "antd";  
import { FileOutlined } from "@ant-design/icons";  
import UploadDragger from "../UploadDragger";  

const { TextArea } = Input;  
const { Option } = Select;  

const normFile = (e: any) => {  
  if (Array.isArray(e)) {  
    return e;  
  }  
  return e?.fileList;  
};  

export type FormFieldCancelDescriptionAndEvidenceProps = {  
  description: string;   
  reasonCancel: string | undefined;   
  proofOfVisitImages: { media_id: string; media: { path: string } }[];  
  optionalImages: { media_id: string; media: { path: string } }[];  
  isDone: boolean;  
  isCancelled: boolean;  
};  

const FormFieldCancelDescriptionAndEvidence: React.FC<FormFieldCancelDescriptionAndEvidenceProps> = ({  
  isDone,  
  proofOfVisitImages,  
  optionalImages,  
  description,  
  reasonCancel,  
}) => {  
  const isImage = (filePath: string) => {  
    return /\.(jpg|jpeg|png|gif|bmp|svg)$/i.test(filePath);  
  };  

  const [cancelReason, setCancelReason] = useState<string | undefined>(reasonCancel);  
  const [cancelReasonOther, setCancelReasonOther] = useState<string>("");  

  const handleCancelReasonChange = (value: string) => {  
    setCancelReason(value);  
    if (value === "Lainnya") {  
      setCancelReasonOther("");  
    }  
  };  

  const handleCancelReasonOtherChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {  
    setCancelReasonOther(event.target.value);  
  };  

  return (  
    <div>  
      <Form.Item  
        label={"Keterangan"}  
        name={"information"}  
        initialValue={description}  
        rules={[  
          {  
            required: true,  
            message: "Dibutuhkan",  
          },  
        ]}  
      >  
        <TextArea rows={4} readOnly={isDone} />  
      </Form.Item>   
      <Form.Item label="Alasan Pembatalan">  
        <Form.Item  
          name="cancel_reason"  
          initialValue={reasonCancel}  
          rules={[  
            {  
              required: true,  
              message: "Alasan pembatalan harus dipilih",  
            },  
          ]}  
        >  
          <Select  
            value={cancelReason}  
            onChange={handleCancelReasonChange}  
            placeholder="Pilih alasan pembatalan"  
          >  
            <Option value="EDC Hilang">EDC Hilang</Option>  
            <Option value="Merchant Tutup">Merchant Tutup</Option>  
            <Option value="Ganti Job Order">Ganti Job Order</Option>  
            <Option value="Lainnya">Lainnya</Option>  
          </Select>  
        </Form.Item>  

        {cancelReason === "Lainnya" && (  
          <Form.Item  
            name="cancel_reason"  
            rules={[  
              {  
                required: true,  
                message: "Silakan isi alasan pembatalan lainnya",  
              },  
            ]}  
          >  
            <TextArea  
              rows={2}  
              placeholder="Isi alasan pembatalan lainnya"  
              value={cancelReasonOther}  
              onChange={handleCancelReasonOtherChange}  
            />  
          </Form.Item>  
        )}  
      </Form.Item>  

      {isDone ? (  
        <Form.Item label="Bukti Kunjungan">  
          {proofOfVisitImages && proofOfVisitImages.length > 0 ? (  
            proofOfVisitImages.map(({ media_id, media }, index) => {  
              const filePath = media.path;  
              return filePath ? (  
                isImage(filePath) ? (  
                  <Image  
                    key={media_id}  
                    src={filePath}  
                    alt={`evidence-${index}`}  
                    style={{ maxHeight: 100, cursor: "pointer" }}  
                    className="object-cover"  
                    crossOrigin="anonymous"  
                  />  
                ) : (  
                  <Button  
                    key={media_id}  
                    icon={<FileOutlined />}  
                    href={filePath}  
                    target="_blank"  
                    rel="noopener noreferrer"  
                  >  
                    Unduh Bukti Kunjungan {index + 1}  
                  </Button>  
                )  
              ) : null;  
            })  
          ) : (  
            <p>Tidak ada bukti kunjungan yang tersedia.</p>  
          )}  
        </Form.Item>  
      ) : (  
        <Form.Item  
          name="evidence"  
          valuePropName="evidence"  
          getValueFromEvent={normFile}  
          rules={[  
            {  
              required: true,  
              message: "Dibutuhkan",  
            },  
          ]}  
        >  
          <UploadDragger uploadText="Klik atau Tarik File untuk Upload Bukti Kunjungan" />  
        </Form.Item>  
      )}  

      {isDone ? (  
        <Form.Item label="Foto Opsional">  
          {optionalImages && optionalImages.length > 0 ? (  
            optionalImages.map(({ media_id, media }, index) => {  
              const optionalFilePath = media.path;  
              return optionalFilePath ? (  
                isImage(optionalFilePath) ? (  
                  <Image  
                    key={media_id}  
                    src={optionalFilePath}  
                    alt={`optional-${index}`}  
                    style={{ maxHeight: 100, cursor: "pointer" }}  
                    className="object-cover"  
                    crossOrigin="anonymous"  
                  />  
                ) : (  
                  <Button  
                    key={media_id}  
                    icon={<FileOutlined />}  
                    href={optionalFilePath}  
                    target="_blank"  
                    rel="noopener noreferrer"  
                  >  
                    Unduh File Opsional {index + 1}  
                  </Button>  
                )  
              ) : null;  
            })  
          ) : (  
            <p>Tidak ada foto opsional yang tersedia.</p>  
          )}  
        </Form.Item>  
      ) : (  
        <Form.Item  
          name="optional"  
          valuePropName="optional"  
          getValueFromEvent={normFile}  
        >  
          <UploadDragger uploadText="Klik atau Tarik File untuk Upload Foto Opsional" />  
        </Form.Item>  
      )}  
    </div>  
  );  
};  

export default FormFieldCancelDescriptionAndEvidence;