import React, { useMemo, useState, useRef } from "react";  
import { Button, Typography, Pagination, message, Popconfirm, Tooltip } from "antd";  
import { DeleteOutlined, DownloadOutlined, UploadOutlined } from "@ant-design/icons";  
import DataTable from "@smpm/components/DataTable";  
import { useDebounce } from "@smpm/utils/useDebounce";  
import useTableHelper from "@smpm/utils/useTableHelper";  
import { ColumnsType } from "antd/es/table";  
import { useQuery } from "@tanstack/react-query";  
import { DocVendorModel } from "@smpm/models/documentModel";  
import { findAll, update, download, deleteFile } from "@smpm/services/docvendorService";  
import { formatDateIndo } from "@smpm/utils/dateUtils";  
import * as dayjs from "dayjs";  

const { Text } = Typography;  

const TableDocVendor: React.FC = () => {  
  const { tableFilter, onChangeTable } = useTableHelper<DocVendorModel>({ pagination: true });  
  const [search, setSearch] = useState<string>("");  
  const searchValue = useDebounce(search, 500);  
  const [fileUploads, setFileUploads] = useState<{ [key: string]: { file: File; name: string } }>({});  
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: { file: string; name: string } }>({});  
  const [currentPage, setCurrentPage] = useState<number>(1);  
  const [pageSize, setPageSize] = useState<number>(10);  
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});  

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
    queryKey: ["document-vendor", { ...tableFilter, searchValue, currentPage, pageSize }],  
    queryFn: () =>  
      findAll({  
        order: tableFilter.sort.order,  
        order_by: tableFilter.sort.order_by,  
        search: searchValue,  
        search_by: tableFilter.searchBy,  
        page: currentPage,  
        take: pageSize,  
      }),  
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
        title: "No. JO",  
        dataIndex: "name",  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
        width: 250,  
      },  
      {  
        title: "Jenis JO",  
        dataIndex: "jo_type",  
        width: 150,  
      },  
      {  
        title: "Nama Vendor",  
        dataIndex: "vendor_name",  
        width: 250,  
      },  
      {  
        title: "Merk EDC",  
        dataIndex: "edc_brand",  
        width: 150,  
      },  
      {  
        title: "Tipe EDC",  
        dataIndex: "edc_type",  
        width: 150,  
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
    return [  
      ...activityData.map((item: any) => ({  
        id: item.id,  
        name: item.job_order_no,  
        no_jo: item.job_order_no,  
        jo_type: item.jo_type,  
        vendor_name: item.vendor_name,  
        edc_brand: item.edc_brand,  
        edc_type: item.edc_type,  
        tanggal_masuk: formatDateIndo(item.tanggal_perjanjian),  
        file1: item.file1,  
        file2: item.file2, 
      })),  
    ];  
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