
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DataTable from "@smpm/components/DataTable"
import { IUserModel, userSearchColumn } from "@smpm/models/userModel"
import { IRoleModel } from "@smpm/models/roleModel"
import { IVendorModel } from "@smpm/models/vendorModel"
import { useDebounce } from "@smpm/utils/useDebounce"
import useTableHelper from "@smpm/utils/useTableHelper"
import { ColumnsType } from "antd/es/table"
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { Button, Space, Popconfirm, Tag, message, Modal, Form, Input, Select, DatePicker } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getUser, deleteUser, updateUser, createUser } from '@smpm/services/userService';
import { getRole } from '@smpm/services/roleService';
import { getVendor } from '@smpm/services/vendorService';
import { IPaginationRequest, IPaginationResponse, IBaseResponseService } from "@smpm/models";
import moment from 'moment';

const { Option } = Select;

interface TableUserProps {
  isAddModalVisible: boolean;
  setIsAddModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const TableUser: React.FC<TableUserProps> = ({ isAddModalVisible, setIsAddModalVisible }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { onChangeTable, onChangeSearchBy } = useTableHelper<IUserModel>({pagination: true})
  const queryClient = useQueryClient();

  const [search, setSearch] = useState<string>("")
  const debouncedSearch = useDebounce(search, 500)

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<IUserModel | null>(null);
  const [pagination, setPagination] = useState<IPaginationRequest>({
    search: '',
    page: 1,
    take: 10,
    order: 'asc',
    order_by: 'id'
  });

  const { data: userData, isLoading } = useQuery<IBaseResponseService<IPaginationResponse<IUserModel>>>({
    queryKey: ['users', pagination, debouncedSearch],
    queryFn: () => getUser({ ...pagination, search: debouncedSearch }),
  });

  const { data: rolesData } = useQuery<IBaseResponseService<IPaginationResponse<IRoleModel>>>({
    queryKey: ['roles'],
    queryFn: () => getRole({ page: 1, take: 100, order: 'asc', order_by: 'name' }),
  });

  const { data: vendorsData } = useQuery<IBaseResponseService<IPaginationResponse<IVendorModel>>>({
    queryKey: ['vendors'],
    queryFn: () => getVendor({ page: 1, take: 100, order: 'asc', order_by: 'name' }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      message.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error('Error deleting user:', error);
      message.error('Failed to delete user');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; userData: Partial<IUserModel> }) => 
      updateUser(data.id, data.userData),
    onSuccess: () => {
      message.success('User updated successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsEditModalVisible(false);
      form.resetFields();
    },
    onError: (error: any) => {
      console.error('Error updating user:', error);
      if (error.response?.data?.result?.errors) {
        const errors = error.response.data.result.errors;
        for (const key in errors) {
          form.setFields([
            {
              name: key,
              errors: Array.isArray(errors[key]) ? errors[key] : [errors[key]],
            },
          ]);
        }
      } else {
        message.error('Failed to update user');
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      message.success('User created successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsAddModalVisible(false);
      form.resetFields();
    },
    onError: (error: any) => {
      console.error('Error creating user:', error);
      if (error.response?.data?.result?.errors) {
        const errors = error.response.data.result.errors;
        for (const key in errors) {
          form.setFields([
            {
              name: key,
              errors: Array.isArray(errors[key]) ? errors[key] : [errors[key]],
            },
          ]);
        }
      } else {
        message.error('Failed to create user');
      }
    },
  });

  const onSearch = (value: string) => setSearch(value)

  const handleEdit = (record: IUserModel) => {
    setEditingUser(record);
    form.setFieldsValue({
      ...record,
      dob: record.dob ? moment(record.dob) : null,
      role_id: record.role_id,
      vendor_id: record.vendor_id
    });
    setIsEditModalVisible(true);
  };

  const handleDelete = async (record: IUserModel) => {
    deleteMutation.mutate(record.id);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const updatedValues = {
        ...values,
        dob: values.dob ? values.dob.format('YYYY-MM-DD') : null
      };

      if (editingUser) {
        updateMutation.mutate({ id: editingUser.id, userData: updatedValues });
      } else {
        createMutation.mutate(updatedValues);
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleModalCancel = () => {
    setIsEditModalVisible(false);
    setIsAddModalVisible(false);
    form.resetFields();
  };

  const columns: ColumnsType<IUserModel> = useMemo((): ColumnsType<IUserModel> => {
    return [
      {
        title: "NAME",
        dataIndex: "name",
        sorter: true,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "EMAIL",
        dataIndex: "email",
        sorter: true,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "ROLE",
        dataIndex: "role_id",
        render: (role_id: number) => {
          const role = rolesData?.result.data.find(r => r.id === role_id);
          return role ? <Tag color="blue">{role.name}</Tag> : '-';
        },
      },
      {
        title: "VENDOR",
        dataIndex: "vendor_id",
        sorter: true,
        sortDirections: ["descend", "ascend"],
        render: (vendor_id: number) => {
          const vendor = vendorsData?.result.data.find(v => v.id === vendor_id);
          return vendor ? vendor.name : '-';
        },
      },
      {
        title: "NPP",
        dataIndex: "npp",
        sorter: true,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "DOB",
        dataIndex: "dob",
        sorter: true,
        sortDirections: ["descend", "ascend"],
        render: (date: string) => date ? moment(date).format('DD/MM/YYYY') : '-',
      },
      {
        title: "PHONE",
        dataIndex: "phone",
        sorter: true,
        sortDirections: ["descend", "ascend"],
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
              title="Are you sure to delete this user?"
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
  }, [rolesData, vendorsData])

  const handleChangeSearchBy = (value: CheckboxValueType[]) => {
    onChangeSearchBy(value as string[]);
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const allowedOrderBy = ['id', 'name', 'email', 'npp', 'dob', 'phone'];
    const newOrderBy = allowedOrderBy.includes(sorter.field) ? sorter.field : 'id';

    setPagination(prev => ({
      ...prev,
      page: pagination.current,
      take: pagination.pageSize,
      order: sorter.order === 'descend' ? 'desc' : 'asc',
      order_by: newOrderBy
    }));
    onChangeTable(pagination, filters, sorter);
  };

  return (
    <>
      <DataTable<IUserModel>
        dataSource={userData?.result.data}
        pagination={{
          current: userData?.result.meta.page,
          pageSize: userData?.result.meta.take,
          total: userData?.result.meta.item_count,
        }}
        loading={isLoading}
        bordered
        onChangeSearchBy={handleChangeSearchBy}
        onGlobalSearch={onSearch}
        columns={columns}
        useGlobalSearchInput
        onChange={handleTableChange}
        searchColumn={userSearchColumn}
      />
      <Modal
        title={editingUser ? "Edit User" : "Add New User"}
        visible={isEditModalVisible || isAddModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical" name="userForm">
          <Form.Item
            name="vendor_id"
            label="Vendor"
            rules={[{ required: true, message: 'Please select a vendor!' }]}
          >
            <Select>
              {vendorsData?.result.data.map(vendor => (
                <Option key={vendor.id} value={vendor.id}>{vendor.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input the name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input the email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role_id"
            label="Role"
            rules={[{ required: true, message: 'Please select a role!' }]}
          >
            <Select>
              {rolesData?.result.data.map(role => (
                <Option key={role.id} value={role.id}>{role.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="npp"
            label="NPP"
            rules={[{ required: true, message: 'Please input the NPP!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="dob"
            label="Date of Birth"
            rules={[{ required: true, message: 'Please select the date of birth!' }]}
          >
            <DatePicker format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: 'Please input the phone number!' }]}
          >
            <Input />
          </Form.Item>
          {!editingUser && (
            <>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: 'Please input the password!' },
                  { min: 6, message: 'Password must be at least 6 characters long!' }
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="password_confirmation"
                label="Confirm Password"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm the password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </>
  )
}

export default TableUser
