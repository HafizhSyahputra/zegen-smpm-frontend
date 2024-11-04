
import React from "react";
import AlertValidation from "@smpm/components/AlertValidation";
import { IFormSignIn } from "@smpm/models/authModel";
import { Button, Form, Input } from "antd";

const FormSignIn: React.FC<IFormSignIn> = ({
  onFinish,
  initialValues,
  isLoading = false,
}) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onFinish}
      className="w-full max-w-md mx-auto px-4 sm:px-6 md:px-8"
    >
      <AlertValidation errorKey="sign-in" />
      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input placeholder="Masukkan username" className="w-full" />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input.Password placeholder="Masukkan password" className="w-full" />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          loading={isLoading}
          htmlType="submit"
          className="w-full sm:w-auto"
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormSignIn;
