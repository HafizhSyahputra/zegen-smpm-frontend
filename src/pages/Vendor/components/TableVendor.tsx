
import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DataTable from "@smpm/components/DataTable"
import { IVendorModel } from "@smpm/models/vendorModel"
import { useDebounce } from "@smpm/utils/useDebounce"
import useTableHelper from "@smpm/utils/useTableHelper"
import { ColumnsType } from "antd/es/table"
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { Button, Space, Popconfirm, message, Modal, Form, Input } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getVendor, updateVendor, deleteVendor } from '@smpm/services/vendorService';
import { IPaginationRequest, IPaginationResponse, IBaseResponseService } from "@smpm/models";

interface TableVendorProps {
  onAddNewVendor: () => void;
  refreshData: () => void;
}

const TableVendor: React.FC<TableVendorProps> = ({ refreshData }) => {
  const { onChangeTable, onChangeSearchBy } = useTableHelper<IVendorModel>()
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState<string>("")
  const debouncedSearch = useDebounce(search, 500)

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingVendor, setEditingVendor] = useState<IVendorModel | null>(null);
  const [pagination, setPagination] = useState<IPaginationRequest>({
    search: '',
    page: 1,
    take: 10,
    order: 'asc',
    order_by: 'name'
  });

  const { data: vendorData, isLoading, refetch } = useQuery<IBaseResponseService<IPaginationResponse<IVendorModel>>>({
    queryKey: ['vendors', pagination, debouncedSearch],
    queryFn: () => getVendor({
      ...pagination,
      search: debouncedSearch,
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const updateVendorMutation = useMutation({
    mutationFn: (updatedVendor: Partial<IVendorModel>) => {
      const { id, ...updateData } = updatedVendor;
      return updateVendor(id!, updateData);
    },
    onSuccess: (data) => {
      if (data.status && data.result) {
        message.success('Vendor updated successfully');
        setIsEditModalVisible(false);
        queryClient.invalidateQueries({ queryKey: ['vendors'] });
        refetch();
        refreshData();
      } else {
        throw new Error('Update failed');
      }
    },
    onError: (error: any) => {
      console.error('Failed to update vendor:', error);
      message.error(`Failed to update vendor: ${error.message}`);
    },
  });

  const deleteVendorMutation = useMutation({
    mutationFn: (id: number) => deleteVendor(id),
    onSuccess: (data) => {
      if (data.status) {
        message.success('Vendor deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['vendors'] });
        refetch();
        refreshData();
      } else {
        throw new Error('Delete failed');
      }
    },
    onError: (error: any) => {
      console.error('Failed to delete vendor:', error);
      message.error(`Failed to delete vendor: ${error.message}`);
    },
  });

  const onSearch = (value: string) => setSearch(value)

  const handleEdit = (record: IVendorModel) => {
    setEditingVendor(record);
    form.setFieldsValue({
      name: record.name,
      code: record.code,
      description: record.description,
    });
    setIsEditModalVisible(true);
  };

  const handleEditModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingVendor) {
         const response = await updateVendor(editingVendor.id, values);
        if (response && response.result) {
          message.success('Vendor updated successfully');
          setIsEditModalVisible(false);
          fetchVendor();
          refreshData(); 
        } else {
          throw new Error('Update failed');
        }
         updateVendorMutation.mutate({ ...values, id: editingVendor.id });
       }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    setEditingVendor(null);
    form.resetFields();
  };

  const handleDelete = async (record: IVendorModel) => {
    try {
      await deleteVendorMutation.mutateAsync(record.id);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const columns: ColumnsType<IVendorModel> = useMemo((): ColumnsType<IVendorModel> => {
    return [
      {
        title: "ID",
        dataIndex: "id",
        sorter: true,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "NAME",
        dataIndex: "name",
        sorter: true,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "CODE",
        dataIndex: "code",
        sorter: true,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "DESCRIPTION",
        dataIndex: "description",
      },
      {
        title: "ACTION",
        key: "action",
        render: (_, record) => (
          <Space size="middle">
            <Button 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)}
            />
            <Popconfirm
              title="Are you sure to delete this vendor?"
              onConfirm={() => handleDelete(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button 
                icon={<DeleteOutlined />} 
                danger
              />
            </Popconfirm>
          </Space>
        ),
      },
    ]
  }, [])

  const handleChangeSearchBy = (value: CheckboxValueType[]) => {
    onChangeSearchBy(value as string[]);
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setPagination(prev => ({
      ...prev,
      page: pagination.current,
      take: pagination.pageSize,
      order: sorter.order === 'descend' ? 'desc' : 'asc',
      order_by: sorter.field || 'name'
    }));
    onChangeTable(pagination, filters, sorter);
  };

  return (
    <>
      <DataTable<IVendorModel>
        dataSource={vendorData?.result.data}
        pagination={{
          current: vendorData?.result.meta.page,
          pageSize: vendorData?.result.meta.take,
          total: vendorData?.result.meta.item_count,
        }}
        loading={isLoading}
        bordered
        onChangeSearchBy={handleChangeSearchBy}
        onGlobalSearch={onSearch}
        columns={columns}
        useGlobalSearchInput
        onChange={handleTableChange}
      />
      <Modal
        title="Edit Vendor"
        open={isEditModalVisible}
        onOk={handleEditModalOk}
        onCancel={handleEditModalCancel}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          name="edit_vendor_form"
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
    </>
  )
}

export default TableVendor
