import { Button, Form, Modal, Upload } from "antd";
import { useRef, useState } from "react";
import { InboxOutlined, VerticalAlignBottomOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

const ModalUpload = ({ isModalVisible, handleCancel, ...rest }) => {
  const formRef = useRef(null);
  const [fileList, setFileList] = useState([]);

  const handleFinish = (values) => {
    // Handle your form submission here
    console.log("Form values:", values);
    handleCancel();
  };

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };

  return (
    <Modal
      visible={isModalVisible}
      onCancel={handleCancel}
      footer={null}
      width={1000}
    >
      <h4 className="text-lg mb-8 capitalize">
        <strong>Upload Data</strong>
      </h4>
      <Form
        {...rest}
        ref={formRef}
        layout="vertical"
        name="nest-message"
        onFinish={handleFinish}
      >
        <Form.Item>
          <Dragger
            name="file"
            multiple={false}
            fileList={fileList}
            onChange={handleChange}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
          </Dragger>
        </Form.Item>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button className="mt-3" icon={<VerticalAlignBottomOutlined />}>
            Download Template Excel
          </Button>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button className="mt-3" type="primary" htmlType="submit">
              Simpan
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalUpload;