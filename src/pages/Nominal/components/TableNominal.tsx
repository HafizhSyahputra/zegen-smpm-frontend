import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import DataTable from "@smpm/components/DataTable"
import { deleteNominal, getNominal, updateNominal } from "@smpm/services/nominalService"
import { getVendor } from "@smpm/services/vendorService"
import { useDebounce } from "@smpm/utils/useDebounce"
import useTableHelper from "@smpm/utils/useTableHelper"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button, Form, Input, message, Modal, Select, Space } from "antd"
import { ColumnsType } from "antd/es/table"
import { useMemo, useState } from "react"

interface IVendor {
    id: number
    name: string
}

export interface INominalModel {
    id: number
    nominal: number | string
    jenis: string
    vendor_id: number
    vendor: IVendor
    tipe: string
}

interface ITableNominalProps {
    filter?: any
}

const TableNominal: React.FC<ITableNominalProps> = ({ filter }) => {
    const [form] = Form.useForm();
    const { tableFilter, onChangeTable, onChangeSearchBy } =
        useTableHelper<INominalModel>({ pagination: true })

    const [search, setSearch] = useState<string>("")
    const [selectedVendor, setSelectedVendor] = useState<number | undefined>()
    const [isEditModalVisible, setIsEditModalVisible] = useState(false)
    const [editingRecord, setEditingRecord] = useState<INominalModel | null>(null)
    const queryClient = useQueryClient();

    const updateMutation = useMutation({
        mutationFn: (data: { id: number; values: Partial<INominalModel> }) =>
            updateNominal(data.id, data.values),
        onSuccess: () => {
            message.success('Data berhasil diupdate');
            queryClient.invalidateQueries({ queryKey: ["nominal-list"] });
            setIsEditModalVisible(false);
            setEditingRecord(null);
            form.resetFields();
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Gagal mengupdate data';

            if (errorMessage.includes('Kombinasi Vendor dan Jenis Job Order sudah ada')) {
                message.error('Kombinasi Vendor dan Jenis Job Order sudah ada. Silakan gunakan kombinasi yang berbeda.');
            } else {
                message.error(errorMessage);
            }

            console.error('Update error details:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
        }
    });


    const jenisOptions = [
        { value: 'New Installation', label: 'New Installation' },
        { value: 'Withdrawal', label: 'Withdrawal' },
        { value: 'CM Replace', label: 'CM Replace' },
        { value: 'CM Re-init', label: 'CM Re-init' },
        { value: 'Preventive Maintenance', label: 'Preventive Maintenance' },
    ];

    const tipeOptions = [
        { value: 'Unit', label: 'Unit' },
        { value: 'Month', label: 'Month' },
        { value: 'Year', label: 'Year' },
    ];

    const searchValue = useDebounce(search, 500)
    const onSearch = (value: string) => setSearch(value)

    const { data: vendorsData } = useQuery({
        queryKey: ["vendor"],
        queryFn: () =>
            getVendor({
                page: 1,
                take: 100,
                order: "desc",
                order_by: "name",
            }),
    })

    const { data: nominalData, isLoading } = useQuery({
        queryKey: ["nominal-list", { ...tableFilter, searchValue, ...filter }],
        queryFn: () => {
            return getNominal({
                order: tableFilter.sort.order,
                order_by: tableFilter.sort.order_by,
                search: searchValue,
                search_by: tableFilter.searchBy,
                page: 1,
                take: 1000,
                ...filter,
            })
        },
    })

    const handleVendorChange = (value: number | undefined) => {
        setSelectedVendor(value)
    }

    const handleEdit = (record: INominalModel) => {
        setEditingRecord(record)
        form.setFieldsValue({
            nominal: record.nominal,
            jenis: record.jenis,
            vendor_id: record.vendor_id,
            tipe: record.tipe
        })
        setIsEditModalVisible(true)
    }

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteNominal(id),
        onSuccess: () => {
            message.success('Data berhasil dihapus');
            queryClient.invalidateQueries({ queryKey: ["nominal-list"] });
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Gagal menghapus data';
            message.error(errorMessage);
            console.error('Delete error details:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
        }
    });

    const handleDelete = (record: INominalModel) => {
        Modal.confirm({
            title: 'Konfirmasi Hapus',
            content: 'Apakah anda yakin ingin menghapus data ini?',
            okText: 'Ya',
            cancelText: 'Tidak',
            onOk: () => {
                deleteMutation.mutate(record.id);
            }
        });
    };

    const handleEditModalOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingRecord?.id) {
                const updateData = {
                    nominal: String(values.nominal),
                    jenis: String(values.jenis),
                    vendor_id: values.vendor_id,
                    tipe: String(values.tipe)
                };

                const changedData = Object.fromEntries(
                    Object.entries(updateData).filter(([_, value]) =>
                        value !== undefined &&
                        value !== null &&
                        value !== ''
                    )
                );

                console.log('Data yang akan dikirim:', changedData);

                updateMutation.mutate({
                    id: editingRecord.id,
                    values: changedData
                });
            }
        } catch (error) {
            if (error instanceof Error) {
                message.error('Validasi form gagal: ' + error.message);
            }
            console.error('Form validation failed:', error);
        }
    };


    const handleEditModalCancel = () => {
        setIsEditModalVisible(false)
        setEditingRecord(null)
        form.resetFields()
    }

    const filteredData = useMemo(() => {
        if (!nominalData?.result.data) return []

        if (selectedVendor) {
            return nominalData.result.data.filter(
                (item) => item.vendor_id === selectedVendor
            )
        }

        return nominalData.result.data
    }, [nominalData, selectedVendor])

    const columns: ColumnsType<INominalModel> = useMemo((): ColumnsType<INominalModel> => {
        return [
            {
                title: "NOMINAL",
                dataIndex: "nominal",
                sorter: true,
                sortDirections: ["descend", "ascend"],
                width: 200,
                render: (nominal) => {
                    return typeof nominal === "number"
                        ? nominal.toLocaleString("id-ID")
                        : nominal
                },
            },
            {
                title: "JENIS",
                dataIndex: "jenis",
                sorter: true,
                sortDirections: ["descend", "ascend"],
                width: 200,
            },
            {
                title: "VENDOR",
                dataIndex: "vendor",
                sorter: true,
                sortDirections: ["descend", "ascend"],
                width: 200,
                render: (_, record) => record.vendor?.name || "-",
            },
            {
                title: "TIPE",
                dataIndex: "tipe",
                sorter: true,
                sortDirections: ["descend", "ascend"],
                width: 200,
            },
            {
                title: "ACTION",
                key: "action",
                fixed: 'right',
                width: 150,
                render: (_, record) => (
                    <Space size="middle">
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                        />
                        <Button
                            danger
                            type="primary"
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record)}
                        />
                    </Space>
                ),
            }
        ]
    }, [])

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <span>Pilih Vendor : </span>
                <Select
                    style={{ width: 200 }}
                    placeholder="Filter Vendor"
                    allowClear
                    onChange={handleVendorChange}
                    options={
                        vendorsData?.result.data.map((vendor) => ({
                            label: vendor.name,
                            value: vendor.id,
                        })) || []
                    }
                />
            </div>

            <DataTable<INominalModel>
                dataSource={filteredData}
                pagination={{
                    current: tableFilter.pagination.current,
                    pageSize: tableFilter.pagination.pageSize,
                    total: filteredData.length,
                    onChange: (page, pageSize) => {
                        onChangeTable({
                            pagination: {
                                current: page,
                                pageSize: pageSize,
                            },
                        })
                    },
                }}
                loading={isLoading}
                bordered
                onChangeSearchBy={onChangeSearchBy}
                searchByOptions={[
                    {
                        name: "ID",
                        value: "id",
                    },
                    {
                        name: "Nominal",
                        value: "nominal",
                    },
                    {
                        name: "Jenis",
                        value: "jenis",
                    },
                    {
                        name: "Vendor",
                        value: "vendor.name",
                    },
                    {
                        name: "Tipe",
                        value: "tipe",
                    },
                ]}
                onGlobalSearch={onSearch}
                columns={columns}
                useGlobalSearchInput
                onChange={onChangeTable}
                scroll={{
                    x: 1000,
                }}
            />

            <Modal
                title="Edit Nominal"
                open={isEditModalVisible}
                onOk={handleEditModalOk}
                onCancel={handleEditModalCancel}
                confirmLoading={updateMutation.isPending}
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        name="nominal"
                        label="Nominal"
                        rules={[{ required: true, message: 'Please input nominal!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="jenis"
                        label="Jenis"
                        rules={[{ required: true, message: 'Please input jenis!' }]}
                    >
                        <Select
                            placeholder="Pilih Jenis"
                            optionFilterProp="children"
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={jenisOptions}
                        />
                    </Form.Item>

                    <Form.Item
                        name="vendor_id"
                        label="Vendor"
                        rules={[{ required: true, message: 'Please select vendor!' }]}
                    >
                        <Select
                            placeholder="Pilih Vendor"
                            optionFilterProp="children"
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={
                                vendorsData?.result.data.map((vendor) => ({
                                    label: vendor.name,
                                    value: vendor.id,
                                })) || []
                            }
                        />
                    </Form.Item>

                    <Form.Item
                        name="tipe"
                        label="Tipe"
                        rules={[{ required: true, message: 'Please input tipe!' }]}
                    >
                        <Select
                            placeholder="Pilih Tipe"
                            optionFilterProp="children"
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={tipeOptions}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default TableNominal