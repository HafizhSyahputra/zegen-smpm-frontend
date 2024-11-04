
import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DataTable from "@smpm/components/DataTable"
import { IRoleModel } from "@smpm/models/roleModel"
import { useDebounce } from "@smpm/utils/useDebounce"
import useTableHelper from "@smpm/utils/useTableHelper"
import { getRole, updateRole, deleteRole } from "@smpm/services/roleService"
import { ColumnsType } from "antd/es/table"
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { Button, Space, Popconfirm, message, Modal, Form, Input, Select } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { IPaginationRequest, IPaginationResponse, IBaseResponseService } from "@smpm/models";

const { Option } = Select;

const TableRole: React.FC = () => {
  const [form] = Form.useForm();
  const { onChangeTable, onChangeSearchBy } = useTableHelper<IRoleModel>({pagination: true})
  const queryClient = useQueryClient();

  const [search, setSearch] = useState<string>("")
  const debouncedSearch = useDebounce(search, 500)

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<IRoleModel | null>(null);
  const [pagination, setPagination] = useState<IPaginationRequest>({
    search: '',
    page: 1,
    take: 10,
    order: 'asc',
    order_by: 'name'
  });

  const { data: rolesData, isLoading, refetch } = useQuery<IBaseResponseService<IPaginationResponse<IRoleModel>>>({
    queryKey: ['roles', pagination, debouncedSearch],
    queryFn: () => getRole({
      ...pagination,
      search: debouncedSearch,
    }),
  });

  const updateRoleMutation = useMutation({
    mutationFn: (updatedRole: { id: number; data: Partial<IRoleModel> }) => 
      updateRole(updatedRole.id, updatedRole.data),
    onSuccess: () => {
      message.success('Role updated successfully');
      setIsModalVisible(false);
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      refetch();
    },
    onError: (error: any) => {
      console.error('Failed to update role:', error);
      message.error(`Failed to update role: ${error.message}`);
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      message.success('Role deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      refetch();
    },
    onError: (error: any) => {
      console.error('Failed to delete role:', error);
      message.error(`Failed to delete role: ${error.message}`);
    },
  });

  const onSearch = (value: string) => setSearch(value)

  const handleEdit = (record: IRoleModel) => {
    setEditingRole(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    deleteRoleMutation.mutate(id);
  };

   const handleModalOk = async () => {  
    try {  
      const values = await form.validateFields();  
      if (editingRole) {  
        const { id, ...updateData } = values;  
        const response = await updateRole(editingRole.id, updateData);  
        
         if (response && response.result) {  
          message.success('Role updated successfully');  
          setIsModalVisible(false);  
          getRole;  
        } else {  
           throw new Error(response.message || 'Update failed: Unexpected response format');  
        }  
      }  
    } catch (error) {  
      console.error('Failed to update role:', error);  
      if (error instanceof Error) {  
        message.error(`Failed to update role: ${error.message}`);  
      } else {  
        message.error('An unexpected error occurred while updating the role');  
      }  
    }  
  };  
 
  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns: ColumnsType<IRoleModel> = useMemo((): ColumnsType<IRoleModel> => {
    return [
      {
        title: "ID",
        dataIndex: "id",
        sorter: true,
      },
      {
        title: "NAME",
        dataIndex: "name",
        sorter: true,
      },
      {
        title: "CODE",
        dataIndex: "code",
        sorter: true,
      },
      {
        title: "TYPE",
        dataIndex: "type",
        sorter: true,
      },
      {
        title: "DESCRIPTION",
        dataIndex: "description",
        sorter: true,
      },
      {
        title: "ACTION",
        key: "action",
        render: (_, record) => (
          <Space size="middle">
            <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
            <Popconfirm
              title="Are you sure to delete this role?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button icon={<DeleteOutlined />} danger className="border-black text-red-500 bg-red-50 hover:bg-red-100 hover:border-black focus:border-black" />
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
      <DataTable<IRoleModel>
        dataSource={rolesData?.result.data}
        pagination={{
          current: rolesData?.result.meta.page,
          pageSize: rolesData?.result.meta.take,
          total: rolesData?.result.meta.item_count,
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
        title="Edit Role"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical" name="editRoleForm">
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
    </>
  )
}

export default TableRole
