
import React, { useState } from 'react';
import {
  CloudUploadOutlined,
  HomeOutlined,
  PlusOutlined,
} from "@ant-design/icons"
import PageContent from "@smpm/components/PageContent"
import PageLabel from "@smpm/components/pageLabel"
import Page from "@smpm/components/pageTitle"
import { IconUsersGroup } from "@tabler/icons-react"
import { Breadcrumb, Button, Card, Space, Modal, Form, Input, message, Select } from "antd"
import TableRole from "./components/TableRole"
import { createRole } from "@smpm/services/roleService"
import { useQueryClient } from '@tanstack/react-query';

const { Option } = Select;

const Role: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleCreate = async () => {
    try {
      const values = await  form.validateFields();
      const response = await createRole(values);
      if (response.status && response.result) {
        message.success('Role created successfully');
        setIsModalVisible(false);
        form.resetFields();
        // Refetch the roles data
        queryClient.invalidateQueries({ queryKey: ['roles'] });
      } else {
        throw new Error(response.message || 'Creation failed');
      }
    } catch (error) {
      console.error('Failed to create role:', error);
      if (error instanceof Error) {
        message.error(`Failed to create role: ${error.message}`);
      } else {
        message.error('An unexpected error occurred while creating the role');
      }
    }
  };

  return (
    <Page title="Role">
      <PageLabel
        title={<span className="font-semibold text-2xl">Role</span>}
        subtitle={
          <Breadcrumb
            items={[
              {
                href: "/dashboard",
                title: (
                  <>
                    <HomeOutlined />
                    <span>Home</span>
                  </>
                ),
              },
              {
                href: "#",
                title: (
                  <div className="flex gap-1">
                    <IconUsersGroup size="1rem" />
                    <span>User Management</span>
                  </div>
                ),
              },
              {
                title: "Role",
              },
            ]}
          />
        }
        endSection={
          <Space>
            <Button icon={<CloudUploadOutlined />}>Export</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
              Buat Role Baru
            </Button>
          </Space>
        }
      />
      <PageContent>
        <Card>
          <TableRole />
        </Card>
      </PageContent>
      <Modal
        title="Buat Role Baru"
        open={isModalVisible}
        onOk={handleCreate}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input the name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="code"
            label="Code"
            rules={[{ required: true, message: 'Please input the code!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: 'Please select the type!' }]}
          >
            <Select placeholder="Select a type">
              <Option value="PUSAT">PUSAT</Option>
              <Option value="VENDOR">VENDOR</Option>
              <Option value="WILAYAH">WILAYAH</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input the description!' }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </Page>
  )
}

export default Role
