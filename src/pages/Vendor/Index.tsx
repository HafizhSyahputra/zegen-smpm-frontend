
import React, { useState, useCallback } from 'react';
import {
  CloudUploadOutlined,
  HomeOutlined,
  PlusOutlined,
} from "@ant-design/icons"
import PageContent from "@smpm/components/PageContent"
import PageLabel from "@smpm/components/pageLabel"
import Page from "@smpm/components/pageTitle"
import { IconBuildingStore } from "@tabler/icons-react"
import { Breadcrumb, Button, Card, Space, Modal, Form, Input, message } from "antd"
import TableVendor from "./components/TableVendor"
import { createVendor } from '@smpm/services/vendorService';
import { useQueryClient } from '@tanstack/react-query';

const Vendor: React.FC = () => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [refreshKey, setRefreshKey] = useState(0);
  const queryClient = useQueryClient();

  const showAddModal = () => {
    setIsAddModalVisible(true);
  };

  const handleAddModalOk = async () => {
    try {
      const values = await form.validateFields();
      const response = await createVendor(values);
      if (response.status && response.result) {
        message.success('Vendor added successfully');
        setIsAddModalVisible(false);
        form.resetFields();
        setRefreshKey(prevKey => prevKey + 1); 
        queryClient.invalidateQueries({ queryKey: ['vendors'] }); 
       } else {
        throw new Error(response.message || 'Failed to add vendor');
      }
    } catch (error) {
      console.error('Failed to add vendor:', error);
      message.error('Failed to add vendor: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleAddModalCancel = () => {
    setIsAddModalVisible(false);
    form.resetFields();
  };

  const refreshData = useCallback(() => {
    setRefreshKey(prevKey => prevKey + 1);
    queryClient.invalidateQueries({ queryKey: ['vendors'] }); // Invalidate and refetch vendors query
  }, [queryClient]);

  return (
    <Page title="Vendor">
      <PageLabel
        title={<span className="font-semibold text-2xl">Vendor</span>}
        subtitle={
          <Breadcrumb
            items={[
              {
                href: "/",
                title: (
                  <>
                    <HomeOutlined />
                    <span>Home</span>
                  </>
                ),
              },
              {
                title: (
                  <div className="flex gap-1">
                    <IconBuildingStore size="1rem" />
                    <span>Vendor Management</span>
                  </div>
                ),
              },
              {
                title: "Vendor",
              },
            ]}
          />
        }
        endSection={
          <Space>
            <Button icon={<CloudUploadOutlined />}>Export</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
              Add New Vendor
            </Button>
          </Space>
        }
      />
      <PageContent>
        <Card>
          <TableVendor key={refreshKey} onAddNewVendor={showAddModal} refreshData={refreshData} />
        </Card>
      </PageContent>
      <Modal
        title="Add New Vendor"
        open={isAddModalVisible}
        onOk={handleAddModalOk}
        onCancel={handleAddModalCancel}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          name="add_vendor_form"
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input the vendor name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="code"
            label="Code"
            rules={[{ required: true, message: 'Please input the vendor code!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </Page>
  )
}

export default Vendor
