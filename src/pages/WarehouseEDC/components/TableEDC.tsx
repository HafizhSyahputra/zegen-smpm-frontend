// src/components/TableEDC.tsx

import React, { useMemo, useState, useEffect } from 'react';
import DataTable from "@smpm/components/DataTable";
import { ElectronicDataCaptureMachine } from "@smpm/models/edcModel";
import { getDataEDC, updateDataEDC, deleteDataEDC, getEDCById } from "@smpm/services/edcService";
import { useDebounce } from "@smpm/utils/useDebounce";
import useTableHelper from "@smpm/utils/useTableHelper";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnsType } from "antd/es/table";
import EDCDetail from './EDCDetail';
import { Button, Modal, Form, Input, Select, Switch, message, Popconfirm, Spin, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const { Option } = Select;

const TableEDC = () => {
  const { tableFilter } = useTableHelper<ElectronicDataCaptureMachine>({ pagination: true });

  const [search, setSearch] = useState<string>("");
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingRecordId, setEditingRecordId] = useState<number | null>(null);
  const [loadingEdit, setLoadingEdit] = useState<boolean>(false);
  const [currentStatusEDC, setCurrentStatusEDC] = useState<string>('');

  const searchValue = useDebounce(search, 500);
  const queryClient = useQueryClient();

  const onSearch = (value: string) => setSearch(value);

  const { data: edc, isLoading } = useQuery({
    queryKey: ["edc", { ...tableFilter }],
    queryFn: () =>
      getDataEDC({
        order: tableFilter.sort.order,
        order_by: tableFilter.sort.order_by,
        search: searchValue,
        search_by: tableFilter.searchBy,
        page: Number(tableFilter.pagination.current),
        take: Number(tableFilter.pagination.pageSize),
      }),
  });

  const getAllowedStatuses = (currentStatus: string): string[] => {
    switch (currentStatus) {
      case 'Pemeriksaan':
        return ['Perbaikan', 'Tersedia'];
      case 'Tersedia':
        return ['Perbaikan', 'Rusak', 'Hilang'];
      case 'Terpasang':
        return ['Hilang'];
      case 'Perbaikan':
        return ['Gagal', 'Tersedia'];
      default:
        return [];
    }
  };

  const statusColorMapping: { [key: string]: string } = {
    'Pemeriksaan': 'blue',
    'Perbaikan': 'orange',
    'Tersedia': 'green',
    'Rusak': 'red',
    'Hilang': 'gray',
    'Terpasang': 'cyan',
    'Gagal': 'volcano',
  };

  useEffect(() => {
    const fetchEditingRecord = async () => {
      if (editingRecordId !== null) {
        setLoadingEdit(true);
        try {
          const recordData = await getEDCById(editingRecordId);
          form.setFieldsValue(recordData);
          setCurrentStatusEDC(recordData.status_edc);
        } catch (error) {
          console.error("Error fetching EDC by ID:", error);
          message.error('Gagal mengambil data untuk di-edit.');
        } finally {
          setLoadingEdit(false);
        }
      }
    };

    if (isModalVisible) {
      fetchEditingRecord();
    }
  }, [editingRecordId, isModalVisible]);

  const updateMutation = useMutation({
    mutationFn: (updatedData: { id: number; data: any }) => updateDataEDC(updatedData.id, updatedData.data),
    onSuccess: () => {
      message.success('Data EDC berhasil diperbarui.');
      queryClient.invalidateQueries({ queryKey: ['edc'] });
    },
    onError: () => {
      message.error('Gagal memperbarui data EDC.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteDataEDC(id),
    onSuccess: () => {
      message.success('Data EDC berhasil dihapus.');
      queryClient.invalidateQueries({ queryKey: ['edc'] });
    },
    onError: () => {
      message.error('Gagal menghapus data EDC.');
    },
  });

  const onExpand = (expanded: boolean, record: ElectronicDataCaptureMachine) => {
    if (expanded) {
      setExpandedRowKeys([record.id]);
    } else {
      setExpandedRowKeys([]);
    }
  };

  const columns: ColumnsType<ElectronicDataCaptureMachine> =
    useMemo((): ColumnsType<ElectronicDataCaptureMachine> => {
      return [
        {
          title: "Serial Number",
          dataIndex: "serial_number",
          sorter: true,
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "TID",
          dataIndex: "tid",
          sorter: true,
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "Merk EDC",
          dataIndex: "brand",
          sorter: true,
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "Tipe EDC",
          dataIndex: "brand_type",
          sorter: true,
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "Wilayah",
          dataIndex: "region",
          sorter: true,
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "Status Kepemilikan",
          dataIndex: "status_owner",
          sorter: true,
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "Kelengkapan",
          dataIndex: "status_owner_desc",
          sorter: true,
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "Kondisi Mesin",
          dataIndex: "status_machine",
          sorter: true,
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "Detail Kondisi",
          dataIndex: "status_machine_desc",
          sorter: true,
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "Provider",
          dataIndex: "simcard_provider",
          sorter: true,
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "No Simcard",
          dataIndex: "simcard_number",
          sorter: true,
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "Tanggal Masuk",
          dataIndex: "created_at",
          render: (date: Date) => new Date(date).toLocaleString(),
          sorter: true,
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "Status EDC",
          dataIndex: "status_edc",
          sorter: true,
          sortDirections: ["descend", "ascend"],
          render: (status: string) => {
            const color = statusColorMapping[status] || 'default';
            return <Tag color={color}>{status}</Tag>;
          },
        },
        {
          title: "Aksi",
          key: "action",
          render: (_, record) => {
            const isExpanded = expandedRowKeys.includes(record.id);
            return (
              <div style={{ display: 'flex', gap: '8px' }}>
                {/* Tombol Toggle Detail */}
                <Button
                  icon={isExpanded ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                  onClick={() => {
                    setExpandedRowKeys(prev =>
                      prev.includes(record.id) ? [] : [record.id]
                    );
                  }}
                  type="text"
                  title={isExpanded ? "Sembunyikan Detail" : "Tampilkan Detail"}
                />

                {/* Tombol Edit */}
                <Button
                  icon={<EditOutlined />}
                  onClick={() => {
                    setEditingRecordId(record.id);
                    setIsModalVisible(true);
                  }}
                  type="text"
                  title="Edit"
                />

                {/* Tombol Delete dengan Popconfirm */}
                <Popconfirm
                  title="Apakah Anda yakin ingin menghapus data ini?"
                  onConfirm={() => deleteMutation.mutate(record.id)}
                  okText="Ya"
                  cancelText="Tidak"
                >
                  <Button
                    icon={<DeleteOutlined />}
                    type="text"
                    danger
                    title="Hapus"
                  />
                </Popconfirm>
              </div>
            );
          },
          sorter: false,
        },
      ];
    }, [deleteMutation, expandedRowKeys, statusColorMapping]);

  const expandedRowRender = (record: ElectronicDataCaptureMachine) => (
    <EDCDetail record={record} />
  );

  const [form] = Form.useForm();

  const handleEditOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (editingRecordId !== null) {
          updateMutation.mutate({
            id: editingRecordId,
            data: {
              ...values,
              status_edc: values.status_edc || currentStatusEDC,
            },
          });
          setIsModalVisible(false);
          setEditingRecordId(null);
          setCurrentStatusEDC('');
          form.resetFields();
        }
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleEditCancel = () => {
    setIsModalVisible(false);
    setEditingRecordId(null);
    setCurrentStatusEDC('');
    form.resetFields();
  };

  const allowedStatuses = useMemo(() => getAllowedStatuses(currentStatusEDC), [currentStatusEDC]);
  const isStatusEDCDisabled = allowedStatuses.length === 0;

  return (
    <>
      <DataTable<ElectronicDataCaptureMachine>
        dataSource={edc?.result.data}
        pagination={{
          current: edc?.result.meta.page,
          pageSize: edc?.result.meta.take,
          total: edc?.result.meta.item_count,
        }}
        loading={isLoading}
        bordered
        onGlobalSearch={onSearch}
        columns={columns}
        useGlobalSearchInput
        expandable={{
          expandedRowRender,
          rowExpandable: (record) =>
            record.ReceivedIn.length > 0 ||
            record.ReceivedOut.length > 0 ||
            record.ActivityVendorReport.length > 0 ||
            record.owner !== null ||
            record.merchant !== null,
          // Hilangkan ikon ekspansi default dengan mengatur expandIcon ke null
          expandIcon: () => null,
          expandedRowKeys,
          onExpand,
        }}
      />

      <Modal
        title="Edit Electronic Data Capture Machine"
        visible={isModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        okText="Simpan"
        cancelText="Batal"
        destroyOnClose
      >
        {loadingEdit ? (
          <Spin />
        ) : (
          <Form
            form={form}
            layout="vertical"
            initialValues={editingRecordId ? {} : {}}
          >
            <Form.Item
              name="mid"
              label="MID"
              rules={[{ required: true, message: 'MID harus diisi.' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="tid"
              label="TID"
              rules={[{ required: true, message: 'TID harus diisi.' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="brand"
              label="Merk"
              rules={[{ required: true, message: 'Merk harus diisi.' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="brand_type"
              label="Tipe"
              rules={[{ required: true, message: 'Tipe harus diisi.' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="serial_number"
              label="Serial Number"
              rules={[{ required: true, message: 'Serial Number harus diisi.' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="status_owner"
              label="Status Kepemilikan"
              rules={[{ required: true, message: 'Status Kepemilikan harus diisi.' }]}
            >
              <Select placeholder="Pilih Status Kepemilikan">
                <Option value="Milik">Milik</Option>
                <Option value="Sewa">Sewa</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="status_owner_desc"
              label="Deskripsi Kepemilikan"
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="status_machine"
              label="Status Mesin"
              rules={[{ required: true, message: 'Status Mesin harus diisi.' }]}
            >
              <Select placeholder="Pilih Status Mesin">
                <Option value="Bagus">Bagus</Option>
                <Option value="Rusak">Rusak</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="status_machine_desc"
              label="Deskripsi Status Mesin"
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="status_active"
              label="Status Aktif"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="simcard_provider"
              label="Provider SIM Card"
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="simcard_number"
              label="Nomor SIM Card"
              rules={[{ required: true, message: 'Nomor SIM Card harus diisi.' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="status_edc"
              label="Status EDC"
              rules={[{ required: true, message: 'Status EDC harus diisi.' }]}
            >
              <Select
                placeholder="Pilih Status EDC"
                disabled={isStatusEDCDisabled}
              >
                {allowedStatuses.map(status => (
                  <Option key={status} value={status}>
                    {status}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="info"
              label="Informasi"
            >
              <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item
              name="kondisibarang"
              label="Kondisi Barang"
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="region"
              label="Wilayah"
              rules={[{ required: true, message: 'Wilayah harus diisi.' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default TableEDC;