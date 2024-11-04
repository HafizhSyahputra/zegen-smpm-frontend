
import React, { useEffect } from "react";
import { Form, Input, Select, Row, Col } from "antd";
import { IconUser } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { getRole } from "@smpm/services/roleService";

interface IFormFieldUser {
  initialValues?: TFormFieldUser;
}

export type TFormFieldUser = {
  id?: number;
  name: string;
  email: string;
  role: string;
  status: string;
};

const FormFieldUser: React.FC<IFormFieldUser> = ({ initialValues }) => {
  const form = Form.useFormInstance();

  useEffect(() => {
    if (initialValues) {
      for (const [key, value] of Object.entries(initialValues)) {
        form.setFieldValue(key as any, value);
      }
    }
  }, [initialValues, form]);

  const { data: roles, isLoading: isLoadingRoles } = useQuery({
    queryKey: ["select-roles"],
    queryFn: getRole,
  });

  return (
    <>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Name is required",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Email is required",
                type: "email",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Role"
            name="role"
            rules={[
              {
                required: true,
                message: "Role is required",
              },
            ]}
          >
            <Select
              placeholder={
                <div className="flex items-center gap-2">
                  <IconUser size="1.2rem" />
                  <span>Select role</span>
                </div>
              }
              loading={isLoadingRoles}
              virtual={true}
            >
              {roles?.result?.data?.map((role) => (
                <Select.Option key={role.id} value={role.name}>
                  {role.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Status"
            name="status"
            rules={[
              {
                required: true,
                message: "Status is required",
              },
            ]}
          >
            <Select>
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="Inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default FormFieldUser;
