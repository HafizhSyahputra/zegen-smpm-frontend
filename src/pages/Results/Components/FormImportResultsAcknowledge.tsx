
import React from 'react';
import { InboxOutlined } from "@ant-design/icons";
import AlertValidation from "@smpm/components/AlertValidation";
import { IFormImportResultsProps, IFormInputImportResults } from "@smpm/models/resultsModel";
import { downloadTemplateResultsAcknowledge } from "@smpm/services/resultsService";
import { Button, Form, Space, Upload, message } from "antd";

const FormImportResultsAcknowledge: React.FC<IFormImportResultsProps> = ({
  onFinish,
  initialValues,
  isLoading = false,
  onReset,
}) => {
  const [form] = Form.useForm<IFormInputImportResults>();

  const reset = () => {
    if (onReset) onReset();
    form.resetFields();
  };

  return (
    <Form<IFormInputImportResults>
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onFinish}
    >
      <AlertValidation errorKey="import-results-acknowledge" />
      <Space direction="vertical" className="w-full">
        <p className="font-semibold text-lg">1. Download File Template</p>
        <Button onClick={() => downloadTemplateResultsAcknowledge()}>
          Download File Template
        </Button>
        <p className="font-semibold text-lg">2. Upload Data</p>
        <small>File sesuai dengan template dan dalam format xlsx</small>
        <Form.Item
          name="files"
          rules={[
            {
              required: true,
              message: "File tidak boleh kosong",
            },
          ]}
        >
          <Upload.Dragger
            maxCount={1}
            onChange={(info) => {
              if (!["removed", "remove"].includes(info.file.status as string)) {
                form.setFieldsValue({
                  files: info.file.originFileObj as File,
                });
              } else {
                form.setFieldsValue({
                  files: undefined,
                });
              }
            }}
            onRemove={() => {
              form.setFieldsValue({
                files: undefined,
              });
            }}
            beforeUpload={(file) => {
              const validFormat = [
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "application/vnd.ms-excel",
              ].includes(file.type);
              if (!validFormat) {
                message.error(`${file.name} is invalid format`);
                return validFormat || Upload.LIST_IGNORE;
              }
              return false;
            }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Klik atau seret file ke area ini untuk import data
            </p>
            <p className="ant-upload-hint">Support only for XLSX File</p>
          </Upload.Dragger>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Submit
            </Button>
            <Button htmlType="button" onClick={reset}>
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Space>
    </Form>
  );
};

export default FormImportResultsAcknowledge;
