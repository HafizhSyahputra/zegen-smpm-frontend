import React from "react";  
import { Form, Input, Image, Button } from "antd";  
import { FileOutlined } from "@ant-design/icons";  
import UploadDragger from "../UploadDragger";  

const { TextArea } = Input;  

const normFile = (e: any) => {  
  if (Array.isArray(e)) {  
    return e;  
  }  
  return e?.fileList;  
};  

export type FormFieldDescriptionAndEvidenceProps = {  
  description: string;  
  proofOfVisitImages: { media_id: string; media: { path: string } }[];  
  optionalImages: { media_id: string; media: { path: string } }[];  
  isDone: boolean;  
};  

const FormFieldDescriptionAndEvidence: React.FC<FormFieldDescriptionAndEvidenceProps> = ({  
  isDone,  
  proofOfVisitImages,  
  optionalImages,  
  description,  
}) => {  

  // Helper function to check if a file is an image
  const isImage = (filePath: string) => {
    return /\.(jpg|jpeg|png|gif|bmp|svg)$/i.test(filePath);
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

export default FormFieldDescriptionAndEvidence;
