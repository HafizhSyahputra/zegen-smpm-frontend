import React, { useMemo, useState, useEffect } from 'react';  
import {   
    Table,   
    Button,   
    Space,   
    Popconfirm,   
    Tooltip,   
    Tag,   
    message,   
    Typography,   
    Modal,   
    Form,   
    Input,   
    Select,  
    DatePicker,  
    Upload   
} from 'antd';  
import {   
    EditOutlined,   
    DeleteOutlined,   
    DownloadOutlined,   
     UploadOutlined   
} from '@ant-design/icons';  
import { ColumnsType } from 'antd/es/table';  
import { IBeritaAcaraModel } from '@smpm/models/beritaacaramodel';  
import { IPaginationRequest } from '@smpm/models';  
import {   
    getBeritaAcaraList,   
    createBeritaAcara,   
    updateBeritaAcara,   
    deleteBeritaAcara,  
    uploadBeritaAcaraFile   
} from '@smpm/services/beritaacaraservice';  
import moment from 'moment';  

const { Text } = Typography;  
const { Option } = Select;  

interface BeritaTableProps {
    fileList: any[];
}  

interface PaginationState extends IPaginationRequest {   
    page: number;  
    take: number;  
    order: 'desc' | 'asc';  
    order_by: string;  
}  

const BeritaTable: React.FC<BeritaTableProps> = () => {  
    const [fileList, setFileList] = useState<IBeritaAcaraModel[]>([]);  
    const [loading, setLoading] = useState<boolean>(true);  
    const [pagination, setPagination] = useState<PaginationState>({  
        page: 1,  
        take: 10,  
        order: 'desc',  
        order_by: 'id_berita_acara'  
    });    
    const [modalVisible, setModalVisible] = useState<boolean>(false);  
    const [currentRecord, setCurrentRecord] = useState<IBeritaAcaraModel | null>(null);  
    const [uploadedFile, setUploadedFile] = useState<{   
        [key: number]: {   
            name: string;   
            path: string;   
            file?: File   
        }   
    }>({});    const [uploadStatus, setUploadStatus] = useState<{ [key: number]: { isUploaded: boolean; isSaved: boolean } }>({}); 
    const [form] = Form.useForm<IBeritaAcaraModel>();  
    const [totalItems, setTotalItems] = useState<number>(0);  

    const statusDescriptions: { [key: string]: string } = {  
        'Open': 'Berita Acara baru dibuat',  
        'Submitted': 'File telah diunggah',  
        'Approved': 'Berita Acara telah disetujui',  
        'Rejected': 'Berita Acara ditolak',  
        'Pending': 'Menunggu tindakan lebih lanjut'  
    };  

    const statusColorMap: { [key: string]: string } = {  
        'Open': 'blue',  
        'Submitted': 'orange',  
        'Approved': 'green',  
        'Rejected': 'red',  
        'Pending': 'gold'  
    };  

    const fetchBeritaAcaraList = async () => {  
        try {  
            setLoading(true);  
            const response = await getBeritaAcaraList(pagination);  
            
            if (response.status.code === 200) {  
                setFileList(response.result.data);  
                setTotalItems(response.result.meta?.item_count || 0);  
            } else {  
                message.error(response.message || 'Failed to fetch data');  
            }  
        } catch (error) {  
            console.error('Error fetching Berita Acara:', error);  
            message.error('Error occurred while fetching data');  
        } finally {  
            setLoading(false);  
        }  
    };  

    useEffect(() => {  
        fetchBeritaAcaraList();  
    }, [pagination.page, pagination.take]);  

    const handleTableChange = (newPagination: any) => {  
        setPagination(prev => ({  
            ...prev,  
            page: newPagination.current,  
            take: newPagination.pageSize  
        }));  
    };  

    const handleCreate = async (values: IBeritaAcaraModel) => {  
        try {  
            const submitValues = {  
                ...values,  
                tgl_submit: values.tgl_submit   
                    ? moment(values.tgl_submit).format('YYYY-MM-DD')   
                    : undefined  
            };  

            const response = await createBeritaAcara(submitValues);  
            if (response.status.code === 200) {  
                message.success('Successfully created Berita Acara');  
                setModalVisible(false);  
                fetchBeritaAcaraList();  
            } else {  
                message.error(response.message || 'Failed to create Berita Acara');  
            }  
        } catch (error) {  
            message.error('Error occurred while creating Berita Acara');  
        }  
    };  

    const handleUpdate = async (values: IBeritaAcaraModel) => {  
        if (!currentRecord?.id_berita_acara) return;  

        try {  
            const submitValues = {  
                ...values,  
                tgl_submit: values.tgl_submit   
                    ? moment(values.tgl_submit).format('YYYY-MM-DD') // Pastikan ini menghasilkan string  
                    : moment().format('YYYY-MM-DD') // Atau nilai default, jika perlu  
            };

            const response = await updateBeritaAcara(  
                currentRecord.id_berita_acara,   
                submitValues  
            );  
            if (response.status.code === 200) {  
                message.success('Successfully updated Berita Acara');  
                setModalVisible(false);  
                fetchBeritaAcaraList();  
            } else {  
                message.error(response.message || 'Failed to update Berita Acara');  
            }  
        } catch (error) {  
            message.error('Error occurred while updating Berita Acara');  
        }  
    };  

    const handleDelete = async (id: number) => {  
        try {  
            const response = await deleteBeritaAcara(id);  
            if (response.status.code === 200) {  
                message.success('Successfully deleted Berita Acara');  
                fetchBeritaAcaraList();  
            } else {  
                message.error(response.message || 'Failed to delete Berita Acara');  
            }  
        } catch (error) {  
            message.error('Error occurred while deleting Berita Acara');  
        }  
    };  

    const handleFileUpload = async (file: File, record: IBeritaAcaraModel) => {  
        try {  
            if (!record.id_berita_acara) {  
                message.error('Invalid record: No ID found');  
                return false;  
            }  
    
            if (file.type !== 'application/pdf') {  
                message.error('Only PDF files are allowed');  
                return false;  
            }  
    
            const maxSize = 10 * 1024 * 1024;
            if (file.size > maxSize) {  
                message.error('File size should not exceed 10MB');  
                return false;  
            }  
      
            setUploadedFile(prev => ({  
                ...prev,  
                [record.id_berita_acara!]: {   
                    name: file.name,   
                    path: '',   
                    file: file  
                }   
            }));  
    
            setUploadStatus(prev => ({  
                ...prev,  
                [record.id_berita_acara!]: { isUploaded: true, isSaved: false }  
            }));  
    
            return true; 
        } catch (error: any) {  
            console.error('File Upload Error:', error);  
            message.error(error.message || 'Error uploading file');  
            return false;  
        }  
    };  
    

    const handleSave = async (record: IBeritaAcaraModel) => {  
        if (!uploadStatus[record.id_berita_acara!]?.isUploaded || !record.id_berita_acara) return;  

        const fileDetails = uploadedFile[record.id_berita_acara!];  
        if (fileDetails) {  
            try {   
                const file = new File(  
                    [new Blob()], 
                    fileDetails.name,   
                    { type: 'application/pdf' }  
                );  
    
                const response = await uploadBeritaAcaraFile(record.id_berita_acara, file);   
    
                if (response.status?.code === 200) {  
                    message.success('File uploaded successfully');  
                    setUploadStatus(prev => ({  
                        ...prev,  
                        [record.id_berita_acara!]: { isUploaded: false, isSaved: true }  
                    }));  
                    fetchBeritaAcaraList(); 
                } else {  
                    message.error('Failed to upload file');  
                }  
            } catch (error) {  
                console.error('File upload error:', error);  
                message.error('Error uploading file');  
            }  
        }  
    };  
    

    const columns: ColumnsType<IBeritaAcaraModel> = useMemo(() => [  
        {  
            title: "ID Berita/Acara",  
            dataIndex: "id_berita_acara",  
            key: "subject",  
            width: 200,  
        },  
        {  
            title: "Vendor ID",  
            dataIndex: "id_vendor",  
            key: "id_vendor",  
            width: 150,  
        },  
        {  
            title: "Tanggal Unggah",  
            dataIndex: "tgl_submit",  
            key: "tgl_submit",  
            render: (date) => {  
                if (!date) {   
                    return <Tag color="red">File belum di Upload</Tag>;  
                }  
                return moment(date).format('DD/MM/YYYY');  
            },  
            width: 200,  
        },
        {  
            title: "Status",  
            dataIndex: "status",  
            key: "status",  
            render: (status) => (  
                <Tag color={statusColorMap[status] || 'default'}>  
                    {statusDescriptions[status] || status}  
                </Tag>  
            ),  
            width: 200,  
        },  
        {  
            title: "File",  
            key: "file",  
            render: (_, record) => {  
                const fileDetails = uploadedFile[record.id_berita_acara!];  
                const uploadState = uploadStatus[record.id_berita_acara!] || { isUploaded: false, isSaved: false };  

                return (  
                    <Space>  
                        {uploadState.isSaved ? (  
                        <>  
                            <Button  
                                icon={<DownloadOutlined />}  
                                onClick={() => {  
                                    if (fileDetails?.path) {  
                                        window.open(fileDetails.path, '_blank');  
                                    }  
                                }}  
                            >  
                                Download File  
                            </Button>  
                            <Text style={{ margin: '0 8px' }}>{fileDetails?.name}</Text>  
                        </>  
                        ) : uploadState.isUploaded ? (  
                        <>  
                            <Text>{fileDetails?.name}</Text>  
                            <Button type="primary" onClick={() => handleSave(record)}>  
                                Save  
                            </Button>  
                        </>  
                        ) : (  
                        <Upload  
                            accept=".pdf"  
                            showUploadList={false}  
                            beforeUpload={async (file) => {  
                                try {  
                                    await handleFileUpload(file, record);  
                                    return false; 
                                } catch (error) {  
                                    return false;  
                                }  
                            }}  
                            name="file"
                        >  
                            <Button icon={<UploadOutlined />}>  
                                Upload File  
                            </Button>  
                        </Upload>  
                        )}  
                    </Space>  
                );  
            },  
            width: 300,  
        },  
        {  
            title: "Aksi",  
            key: "actions",  
            render: (_, record) => (  
                <Space>  
                    <Tooltip title="Edit">  
                        <Button  
                            icon={<EditOutlined />}  
                            onClick={() => {  
                                setCurrentRecord(record);  
                                form.setFieldsValue({  
                                    ...record,  
                                    tgl_submit: record.tgl_submit ? moment(record.tgl_submit) : undefined  
                                });  
                                setModalVisible(true);  
                            }}  
                        />  
                    </Tooltip>  
                    <Popconfirm  
                        title="Are you sure you want to delete this?"  
                        onConfirm={() => handleDelete(record.id_berita_acara!)}  
                    >  
                        <Button  
                            icon={<DeleteOutlined />}  
                            danger  
                        />  
                    </Popconfirm>  
                </Space>  
            ),  
            width: 150,  
        }  
    ], [form, uploadedFile, uploadStatus]);  

    const renderModalForm = () => (  
        <Modal  
            title={currentRecord ? "Edit Berita Acara" : "Add Berita Acara"}  
            visible={modalVisible}  
            onCancel={() => {  
                setModalVisible(false);  
                setCurrentRecord(null);  
                form.resetFields();  
            }}  
            onOk={() => form.submit()}  
        >  
            <Form  
                form={form}  
                layout="vertical"  
                onFinish={currentRecord ? handleUpdate : handleCreate}  
            >  
                <Form.Item  
                    name="subject"  
                    label="Nama Berita/Acara"  
                    rules={[{ required: true, message: 'Nama Berita/Acara harus diisi' }]}  
                >  
                    <Input placeholder="Masukkan nama berita/acara" />  
                </Form.Item>  

                <Form.Item  
                    name="id_vendor"  
                    label="Vendor ID"  
                    rules={[{ required: true, message: 'Vendor ID harus diisi' }]}  
                >  
                    <Input   
                        type="number"   
                        placeholder="Masukkan vendor ID"  
                        min={1}  
                    />  
                </Form.Item>  

                <Form.Item  
                    name="tgl_submit"  
                    label="Tanggal Unggah"  
                    rules={[{ required: true, message: 'Tanggal harus diisi' }]}  
                >  
                    <DatePicker   
                        style={{ width: '100%' }}   
                        format="DD/MM/YYYY"  
                        placeholder="Pilih tanggal"  
                    />  
                </Form.Item>  

                <Form.Item  
                    name="status"  
                    label="Status"  
                    rules={[{ required: true, message: 'Status harus dipilih' }]}  
                >  
                    <Select placeholder="Pilih status">  
                        {Object.keys(statusDescriptions).map(status => (  
                            <Option key={status} value={status}>  
                                {statusDescriptions[status]}  
                            </Option>  
                        ))}  
                    </Select>  
                </Form.Item>  

                <Form.Item   
                    name="note"   
                    label="Catatan"  
                >  
                    <Input.TextArea   
                        placeholder="Masukkan catatan (opsional)"  
                        rows={4}   
                    />  
                </Form.Item>  
            </Form>  
        </Modal>  
    );  

    return (  
        <div className="berita-acara-container">  
            <div className="berita-acara-header" style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>  
                <Button  
                    type="primary"  
                    icon={<DownloadOutlined />} 
                    onClick={() => {  
                        const link = document.createElement('a');  
                        link.href = '/PDF/TEMPLATE BERITA ACARA (KEHILANGAN EDC).pdf';  
                        link.setAttribute('download', 'TEMPLATE BERITA ACARA (KEHILANGAN EDC).pdf'); 
                        document.body.appendChild(link);  
                        link.click();  
                        document.body.removeChild(link); 
                    }}  
                >  
                    Download Template Berita Acara  
                </Button>  
            </div>  

            <Table  
                columns={columns}  
                dataSource={fileList}  
                loading={loading}  
                pagination={{  
                    current: pagination.page,  
                    pageSize: pagination.take,  
                    total: totalItems, 
                    showSizeChanger: true,  
                    showQuickJumper: true,  
                    showTotal: (total) => `Total ${total} item`  
                }}  
                onChange={handleTableChange}  
                rowKey="id_berita_acara"  
                scroll={{ x: 'max-content' }}  
            />  

            {renderModalForm()}  
        </div>  
    );  
};  

export default BeritaTable;