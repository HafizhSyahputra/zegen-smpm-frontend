
import React, { useRef, useState } from "react";
import { Button, Form, Modal, Upload, message } from "antd";
import { InboxOutlined, VerticalAlignBottomOutlined } from "@ant-design/icons";
import { RcFile } from "antd/lib/upload";

const { Dragger } = Upload;

interface ModalUploadProps {
  isModalVisible: boolean;
  handleCancel: () => void;
  onUploadSuccess: () => void;
}

const ModalUpload: React.FC<ModalUploadProps> = ({ 
  isModalVisible, 
  handleCancel, 
  onUploadSuccess 
}) => {
  const formRef = useRef<any>(null);
  const [fileList, setFileList] = useState<RcFile[]>([]);

  const handleFinish = async (values: any) => {
    try {
      // Here you would typically send the file to your server
      // For example:
      // const formData = new FormData();
      // formData.append('file', fileList[0]);
      // await uploadMaintenanceData(formData);

      message.success("Maintenance data uploaded successfully");
      onUploadSuccess();
      handleCancel();
    } catch (error) {
      message.error("Failed to upload maintenance data");
    }
  };

  const handleChange = (info: any) => {
    const { fileList } = info;
    setFileList(fileList);
  };

  const downloadTemplate = () => {
    // Implement the logic to download the template
    // For example:
    // window.open('/api/maintenance/template', '_blank');
    message.info("Downloading maintenance template...");
  };

  return (
    <Modal
      visible={isModalVisible}
      onCancel={handleCancel}
      footer={null}
      width={1000}
      title="Upload Maintenance Data"
    >
      <Form
        ref={formRef}
        layout="vertical"
        name="maintenance_upload"
        onFinish={handleFinish}
      >
        <Form.Item
          name="file"
          rules={[{ required: true, message: "Please upload a file" }]}
        >
          <Dragger
            name="file"
            multiple={false}
            fileList={fileList}
            onChange={handleChange}
            beforeUpload={() => false} // Prevent auto upload
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag maintenance data file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single Excel file upload.
            </p>
          </Dragger>
        </Form.Item>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button 
            onClick={downloadTemplate}
            icon={<VerticalAlignBottomOutlined />}
          >
            Download Maintenance Template
          </Button>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Upload Maintenance Data
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalUpload;
