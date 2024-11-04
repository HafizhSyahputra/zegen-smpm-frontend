import React, { useState, useRef } from "react";  
import { Button, Pagination, Typography, message, Popconfirm, Tooltip } from "antd";  
import { DownloadOutlined, UploadOutlined, DeleteOutlined, EnvironmentOutlined } from "@ant-design/icons";  
import DataTable from "@smpm/components/DataTable";  
import { findAll, download, update, deleteFile } from "@smpm/services/docmerchantService";  
import { useDebounce } from "@smpm/utils/useDebounce";  
import useTableHelper from "@smpm/utils/useTableHelper";  
import { ColumnsType, TablePaginationConfig } from "antd/es/table";  
import { useQuery } from "@tanstack/react-query";  
import { SorterResult } from "antd/es/table/interface";  
import { DocMerchantModel } from "@smpm/models/documentModel";  

const { Text } = Typography;  

const TableDocMerchant: React.FC = () => {  
  const { tableFilter, onChangeTable } = useTableHelper<DocMerchantModel>({ pagination: true });  
  const [search, setSearch] = useState<string>("");  
  const searchValue = useDebounce(search, 500);  
  const [currentPage, setCurrentPage] = useState<number>(1);  
  const [fileUploads, setFileUploads] = useState<{ [key: string]: { file: File; name: string } }>({});  
  const [pageSize, setPageSize] = useState<number>(10);  
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: { file: File | string; name: string } }>({});  
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});  

  const onSearch = (value: string) => setSearch(value);  

  const handleDownloadFile = async (id: number, fileKey: 'file1' | 'file2') => {  
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

  const handleDeleteFile = async (id: number, fileKey: 'file1' | 'file2') => {  
    try {  
      await deleteFile(id, fileKey);  
      message.success("File deleted successfully.");  
      await refetch();  

      // Perbarui `uploadedFiles` setelah file dihapus  
      setUploadedFiles((prev) => ({  
        ...prev,  
        [`${id}-${fileKey}`]: { file: '', name: '' },  
      }));  
    } catch (error) {  
      message.error("Failed to delete file.");  
    }  
  };  

  const handleFileChange = (recordId: number, fileKey: 'file1' | 'file2', event: React.ChangeEvent<HTMLInputElement>) => {  
    const file = event.target.files?.[0];  
    if (file) {  
      setFileUploads((prev) => ({  
        ...prev,  
        [`${recordId}-${fileKey}`]: { file, name: file.name },  
      }));  
      setUploadedFiles((prev) => ({  
        ...prev,  
        [`${recordId}-${fileKey}`]: { file: `${recordId}-${fileKey}`, name: file.name },  
      }));  
    } else {  
      // Hapus entri terkait dari `uploadedFiles`  
      setUploadedFiles((prev) => ({  
        ...prev,  
        [`${recordId}-${fileKey}`]: { file: '', name: '' },  
      }));  
    }  
  };  

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

  const { data: merchantData, isLoading, refetch } = useQuery({  
    queryKey: ["merchant-data", { ...tableFilter, searchValue, page: currentPage, pageSize }],  
    queryFn: () => findAll({  
      order: tableFilter.sort.order,  
      order_by: tableFilter.sort.order_by,  
      search: searchValue,  
      page: currentPage,  
      take: pageSize,  
    }),  
  });  

  const triggerFileInput = (recordId: number, fileKey: 'file1' | 'file2') => {  
    const inputRef = fileInputRefs.current[`${recordId}-${fileKey}`];  
    if (inputRef) {  
      inputRef.click();  
    }  
  };  

  const columns: ColumnsType<DocMerchantModel> = [  
    {  
      title: "Merchant Name",  
      dataIndex: "merchant_name",  
      sorter: true,  
      sortDirections: ["descend", "ascend"],  
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
                onClick={() => handleDownloadFile(record.id, 'file1')}  
              >  
                Download File  
              </Button>  
              <Tooltip title={uploadedFiles[`${record.id}-file1`]?.name || text.substring(text.lastIndexOf('/') + 27)}>  
                  <Text className="min-w-[210px] overflow-hidden text-ellipsis whitespace-nowrap">  
                    {uploadedFiles[`${record.id}-file1`]?.name || text.substring(text.lastIndexOf('/') + 27).slice(0, 30) + "..."}  
                  </Text>  
              </Tooltip>    
            </div>  
            <Popconfirm  
              title="Are you sure you want to delete this file?"  
              onConfirm={() => handleDeleteFile(record.id, 'file1')}  
              okText="Yes"  
              cancelText="No"  
            >  
              <Button  
                type="primary"    
                icon={<DeleteOutlined />}  
                shape="circle"  
              />  
            </Popconfirm>  
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
              {uploadedFiles[`${record.id}-file1`]?.name || "Upload File 1"}  
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
                onClick={() => handleDownloadFile(record.id, 'file2')}  
              >  
                Download File  
              </Button>  
              <Tooltip title={uploadedFiles[`${record.id}-file2`]?.name || text.substring(text.lastIndexOf('/') + 27)}>  
                  <Text className="min-w-[210px] overflow-hidden text-ellipsis whitespace-nowrap">  
                    {uploadedFiles[`${record.id}-file2`]?.name || text.substring(text.lastIndexOf('/') + 27).slice(0, 30) + "..."}  
                  </Text>  
              </Tooltip>    
            </div>  
            <Popconfirm  
              title="Are you sure you want to delete this file?"  
              onConfirm={() => handleDeleteFile(record.id, 'file2')}  
              okText="Yes"  
              cancelText="No"  
            >  
              <Button  
                type="primary"    
                icon={<DeleteOutlined />}  
                shape="circle"  
              />  
            </Popconfirm>  
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
              {uploadedFiles[`${record.id}-file2`]?.name || "Upload File Optional"}  
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
      title: "Location",  
      dataIndex: "location",  
      ellipsis: true,  
      width: 500,  
      render: (text, record) => (  
        <div className="flex flex-col items-center text-center">  
          <Tooltip  
            title={`${text}\n ${record.latitude}\n ${record.longitude}`}  
          >  
            <Text style={{ whiteSpace: "pre-line" }} ellipsis={{ tooltip: text }}>  
              {text}  
            </Text>  
          </Tooltip>  
          <a  
            href={`https://www.google.com/maps?q=${record.latitude},${record.longitude}`}  
            target="_blank"  
            rel="noopener noreferrer"  
            style={{ marginLeft: 8 }}  
          >  
            <EnvironmentOutlined/>  
          </a>  
        </div>  
      ),  
    },  
  ];  

  const handlePageChange = (page: number, pageSize?: number) => {  
    setCurrentPage(page);  
    setPageSize(pageSize || 10);  
    onChangeTable(  
      { current: page, pageSize: pageSize || 10 },  
      {},  
      { order: tableFilter.sort.order === 'desc' ? 'descend' : 'ascend', field: tableFilter.sort.order_by }  
    );  
  };  

  const handleTableChange = (pagination: TablePaginationConfig, filters: {}, sorter: SorterResult<DocMerchantModel> | SorterResult<DocMerchantModel>[]) => {  
    onChangeTable(pagination, filters, sorter);  
  };  

  return (  
    <div>  
      <div>  
        <DataTable<DocMerchantModel>  
          dataSource={merchantData?.result?.data ?? []}  
          pagination={false}  
          loading={isLoading}  
          bordered  
          onGlobalSearch={onSearch}  
          columns={columns}  
          useGlobalSearchInput  
          className="overflow-x-auto"  
          onChange={handleTableChange}  
        />  
      </div>  
      <div className="flex flex-col gap-4 mt-4">  
        <Pagination  
          current={currentPage}  
          pageSize={pageSize}  
          total={merchantData?.result?.meta?.item_count ?? 0}  
          onChange={handlePageChange}  
          className="self-end"  
        />  
      </div>  
    </div>  
  );  
};  

export default TableDocMerchant;