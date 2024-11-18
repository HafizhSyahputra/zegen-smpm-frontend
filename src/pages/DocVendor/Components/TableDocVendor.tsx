import { DeleteOutlined, DownloadOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";
import DataTable from "@smpm/components/DataTable";
import { DocVendorModel } from "@smpm/models/documentModel";
import { IVendorModel } from "@smpm/models/vendorModel";
import { deleteFile, download, findAll, remove, update } from "@smpm/services/docvendorService";
import { getAllVendor } from "@smpm/services/vendorService";
import useTableHelper from "@smpm/utils/useTableHelper";
import { useQuery } from "@tanstack/react-query";
import { Button, Form, message, Modal, Pagination, Popconfirm, Select, Tooltip, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import * as dayjs from "dayjs";
import React, { useEffect, useMemo, useRef, useState } from "react";

const { Text } = Typography;  

const TableDocVendor: React.FC = () => {  
  const { tableFilter, onChangeTable } = useTableHelper<DocVendorModel>({ pagination: true });  
  const [_search, setSearch] = useState<string>("");  
  const [fileUploads, setFileUploads] = useState<{ [key: string]: { file: File; name: string } }>({});  
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: { file: string; name: string } }>({});  
  const [currentPage, setCurrentPage] = useState<number>(1);  
  const [pageSize, setPageSize] = useState<number>(10);  
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [isModalVisible, setIsModalVisible] = useState(false);  
  const [editingVendorName, setEditingVendorName] = useState('');  
  const [editingRecordId, setEditingRecordId] = useState<number | null>(null);
  const [vendors, setVendors] = useState<IVendorModel[]>([]);  
  const [vendorsLoading, setVendorsLoading] = useState(false);      
  const [editingVendor, setEditingVendor] = useState<IVendorModel | null>(null);

  const onSearch = (value: string) => setSearch(value);  

  const downloadFile = async (id: number, fileKey: 'file1' | 'file2') => {  
    try {  
        const { data, fileName } = await download(id, fileKey);  
        const url = window.URL.createObjectURL(data);  
        const link = document.createElement('a');  
        link.href = url;  

         link.setAttribute('download', fileName);  

        document.body.appendChild(link);  
        link.click();  
        link.remove();  
    } catch (error) {  
        message.error("Error downloading file.");  
    }  
  };

  const {  
    data: activityJobOrder,  
    isLoading,  
    refetch,  
  } = useQuery({  
    queryKey: ["document-vendor"],  
    queryFn: () => findAll(), // Tidak perlu kirim parameter  
    refetchInterval: 1000, // Auto refetch setiap 1 detik  
    refetchIntervalInBackground: false, // Hanya refetch saat tab aktif  
    staleTime: 0, // Data selalu dianggap stale (perlu diperbarui)  
  }); 

  const handleFileUpload = async (id: number, fileKey: 'file1' | 'file2') => {  
    const file = fileUploads[`${id}-${fileKey}`]?.file;  
    if (!file) {  
      message.error("No file selected for upload.");  
      return;  
    }  

    const formData = new FormData();  
    formData.append(fileKey, file);  

    try {  
      await update(id, formData);  
      message.success("File uploaded successfully.");  
      setFileUploads((prev) => {  
        const updatedFiles = { ...prev };  
        delete updatedFiles[`${id}-${fileKey}`];  
        return updatedFiles;  
      });  
      setUploadedFiles((prev) => ({  
        ...prev,  
        [`${id}-${fileKey}`]: { file: `${id}-${fileKey}`, name: file.name },  
      }));  
      await refetch(); 
    } catch (error) {  
      message.error("File upload failed.");  
    }  
  };  

  const triggerFileInput = (recordId: number, fileKey: 'file1' | 'file2') => {  
    const inputRef = fileInputRefs.current[`${recordId}-${fileKey}`];  
    if (inputRef) {  
      inputRef.click();  
    }  
  };  

  const handleEdit = async (id: number, vendorName: string) => {  
    const vendor = await getVendorById(id);  
    setEditingRecordId(id);  
    setEditingVendor(vendor);  
    setEditingVendorName(vendorName);  
    setIsModalVisible(true);  
  };
  
  const getVendorById = async (id: number): Promise<IVendorModel | null> => {  
    try {  
      const response = await getAllVendor();  
      return response.result.find((vendor) => vendor.id === id) || null;  
    } catch (error) {  
      console.error('Error fetching vendor:', error);  
      return null;  
    }  
  };

  useEffect(() => {  
    const fetchVendors = async () => {  
      setVendorsLoading(true);  
      try {  
        const response = await getAllVendor();  
        setVendors(response.result);  
      } catch (error) {  
        console.error('Error fetching vendors:', error);  
      } finally {  
        setVendorsLoading(false);  
      }  
    };  
  
    fetchVendors();  
  }, []);

  const handleModalOk = async () => {  
    if (editingRecordId !== null) {  
      try {  
        const formData = new FormData();  
        formData.append('vendor_name', editingVendorName);  
  
        await update(editingRecordId, formData);  
        message.success("Vendor data updated successfully.");  
        await refetch(); // Refresh the data after update  
        setIsModalVisible(false);  
      } catch (error) {  
        message.error("Failed to update vendor data.");  
      }  
    }  
  };

  const handleModalCancel = () => {  
    setIsModalVisible(false);  
  }; 
  
  const handleDelete = async (id: number) => {  
    try {  
      await remove(id);  
      message.success("Record deleted successfully.");  
      await refetch(); // Refresh the data after delete  
    } catch (error) {  
      message.error("Failed to delete record.");  
    }  
  };  

  const handleFileChange = (recordId: number, fileKey: 'file1' | 'file2', event: React.ChangeEvent<HTMLInputElement>) => {  
    const file = event.target.files?.[0];  
    if (file) {  
      setFileUploads((prev) => ({  
        ...prev,  
        [`${recordId}-${fileKey}`]: { file, name: file.name },  
      }));  
    }  
  };  

  const handleDeleteFile = async (id: number, fileKey: 'file1' | 'file2') => {  
    try {  
      await deleteFile(id, fileKey);  
      message.success("File deleted successfully.");  
      setUploadedFiles((prev) => {  
        const updatedFiles = { ...prev };  
        delete updatedFiles[`${id}-${fileKey}`];  
        return updatedFiles;  
      });  
      await refetch();  
    } catch (error) {  
      message.error("Failed to delete file.");  
    }  
  };  

  const columns: ColumnsType<DocVendorModel> = useMemo(  
    (): ColumnsType<DocVendorModel> => [  
      {  
        title: "Nama Vendor",  
        dataIndex: "vendor_name",  
        width: 250,  
      },    
      {  
        title: "Tanggal Perjanjian",  
        dataIndex: "tanggal_perjanjian",  
        width: 150,  
        render: (tanggal_perjanjian) => {  
          return dayjs(tanggal_perjanjian).format("DD-MMM-YYYY");  
        },   
      },  
      {  
        title: "No. Perjanjian Kerjasama",  
        dataIndex: "no_perjanjian_kerjasama",  // Diubah dari no_perjanjian  
        width: 200,  
      },  
      {  
        title: "File 1",  
        dataIndex: "file1",  
        width: 500,  
        render: (text, record) => (  
          text ? (  
            <div className="flex items-center justify-between">  
              <div className="flex items-center">  
                <Button  
                  type="primary"  
                  icon={<DownloadOutlined />}  
                  className="min-w-[110px] mr-2"  
                  onClick={() => downloadFile(record.id, 'file1')}  
                >  
                  Download File  
                </Button>  
                <Tooltip title={uploadedFiles[`${record.id}-file1`]?.name || text.substring(text.lastIndexOf('/') + 25)}>  
                  <Text className="min-w-[210px] overflow-hidden text-ellipsis whitespace-nowrap">  
                    {uploadedFiles[`${record.id}-file1`]?.name || text.substring(text.lastIndexOf('/') + 25).slice(0, 30) + "..."}  
                  </Text>  
                </Tooltip>  
              </div>  
              <div className="relative">  
                <Popconfirm  
                  title="Are you sure you want to delete this file?"  
                  onConfirm={() => handleDeleteFile(record.id, 'file1')}  
                  okText="Yes"  
                  cancelText="No"  
                >  
                  <Button  
                    type="primary"  
                    danger  
                    icon={<DeleteOutlined />}  
                    shape="circle"  
                  />  
                </Popconfirm>  
              </div>  
            </div>  
          ) : (  
            <>  
              <input  
                type="file"  
                ref={(el) => fileInputRefs.current[`${record.id}-file1`] = el}  
                style={{ display: 'none' }}  
                onChange={(e) => handleFileChange(record.id, 'file1', e)}  
              />  
              <Button type="primary" icon={<UploadOutlined />} onClick={() => triggerFileInput(record.id, 'file1')}>  
                {fileUploads[`${record.id}-file1`]?.name || "Upload File 1"}  
              </Button>  
              {fileUploads[`${record.id}-file1`] && (  
                <Button type="primary" className="ml-2" onClick={() => handleFileUpload(record.id, 'file1')}>  
                  Save  
                </Button>  
              )}  
            </>  
          )  
        ),  
      },  
      {  
        title: "File 2",  
        dataIndex: "file2",  
        width: 500,  
        render: (text, record) => (  
          text ? (  
            <div className="flex items-center justify-between">  
              <div className="flex items-center">  
                <Button  
                  type="primary"  
                  icon={<DownloadOutlined />}  
                  className="min-w-[110px] mr-2"  
                  onClick={() => downloadFile(record.id, 'file2')}  
                >  
                  Download File  
                </Button>  
                <Tooltip title={uploadedFiles[`${record.id}-file2`]?.name || text.substring(text.lastIndexOf('/') + 25)}>  
                  <Text className="min-w-[210px] overflow-hidden text-ellipsis whitespace-nowrap">  
                    {uploadedFiles[`${record.id}-file2`]?.name || text.substring(text.lastIndexOf('/') + 25).slice(0, 30) + "..."}  
                  </Text>  
                </Tooltip>  
              </div>  
              <div className="relative">  
                <Popconfirm  
                  title="Are you sure you want to delete this file?"  
                  onConfirm={() => handleDeleteFile(record.id, 'file2')}  
                  okText="Yes"  
                  cancelText="No"  
                >  
                  <Button  
                    type="primary"  
                    danger  
                    icon={<DeleteOutlined />}  
                    shape="circle"  
                  />  
                </Popconfirm>  
              </div>  
            </div>  
          ) : (  
            <>  
              <input  
                type="file"  
                ref={(el) => fileInputRefs.current[`${record.id}-file2`] = el}  
                style={{ display: 'none' }}  
                onChange={(e) => handleFileChange(record.id, 'file2', e)}  
              />  
              <Button type="primary" icon={<UploadOutlined />} onClick={() => triggerFileInput(record.id, 'file2')}>  
                {fileUploads[`${record.id}-file2`]?.name || "Upload File Optional"}  
              </Button>  
              {fileUploads[`${record.id}-file2`] && (  
                <Button type="primary" className="ml-2" onClick={() => handleFileUpload(record.id, 'file2')}>  
                  Save  
                </Button>  
              )}  
            </>  
          )  
        ),  
      },  
      {  
        title: "Actions",  
        key: "actions",  
        width: 200,  
        render: (_text, record) => (  
          <div className="flex items-center justify-center gap-2">  
            <Button  
              type="default"  
              icon={<EditOutlined />}  
              onClick={() => handleEdit(record.id, record.vendor_name)}  
            />  
            <Popconfirm  
              title="Apakah Anda yakin ingin menghapus rekaman ini?"  
              onConfirm={() => handleDelete(record.id)}  
              okText="Ya"  
              cancelText="Tidak"  
            >  
              <Button type="default" icon={<DeleteOutlined />} />  
            </Popconfirm>  
          </div>  
        ),  
      },
    ],  
    [fileUploads, uploadedFiles]  
  );  

  const handlePageChange = (page: number, size?: number) => {  
    setCurrentPage(page);  
    setPageSize(size || 10);  
    onChangeTable({ current: page, pageSize: size || 10 }, {}, { order: tableFilter.sort.order === 'desc' ? 'descend' : 'ascend', field: tableFilter.sort.order_by });  
  };  

  const dataSource = useMemo(() => {  
    const activityData = activityJobOrder?.result.data || [];  
    return activityData.map((item: any) => ({  
        id: item.id,  
        name: item.name,  // Disesuaikan  
        vendor_name: item.vendor_name,  
        tanggal_perjanjian: item.tanggal_perjanjian,  // Diubah dari tanggal_masuk  
        no_perjanjian_kerjasama: item.no_perjanjian_kerjasama,  // Diubah dari no_perjanjian  
        file1: item.file1,  
        file2: item.file2,  
    }));  
}, [currentPage, pageSize, activityJobOrder]);  

  return (  
    <div>  
      <div>  
        <DataTable<DocVendorModel>  
          dataSource={dataSource}  
          loading={isLoading}  
          bordered  
          onGlobalSearch={onSearch}  
          columns={columns}  
          useGlobalSearchInput  
          className="overflow-x-auto"  
          onChange={onChangeTable}  
          scroll={{ x: 'max-content' }}  
          pagination={false}  
        />  
        <Modal  
                title="Edit Vendor Name"  
                visible={isModalVisible}  
                onOk={handleModalOk}  
                onCancel={handleModalCancel}  
            >  
               <Form.Item  
                name="vendor_name"  
                label="Nama Vendor"  
                rules={[{ required: true, message: 'Please select a vendor' }]}  
              >  
                  <Select  
                      loading={vendorsLoading}  
                      placeholder="Pilih Vendor"  
                      optionFilterProp="children"  
                      showSearch  
                      filterOption={(input: any, option: any) =>  
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())  
                      }  
                      options={vendors.map((vendor) => ({  
                        value: vendor.id,  
                        label: vendor.name,  
                      }))}  
                      value={editingVendor?.id}  
                      onChange={(value: any) => {  
                        const selectedVendor = vendors.find((v) => v.id === value);  
                        if (selectedVendor) {  
                          setEditingVendorName(selectedVendor.name);  
                        }  
                      }}  
                    />
              </Form.Item>
          </Modal>
      </div>  
      <div className="flex flex-col gap-4 mt-4">  
        <Pagination  
          current={currentPage}  
          pageSize={pageSize}  
          total={activityJobOrder?.result.meta.item_count || 0}  
          onChange={handlePageChange}  
          className="self-end"  
        />  
      </div>  
    </div>  
  );  
};  

export default TableDocVendor;