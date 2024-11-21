import React, { useMemo, useState } from "react";  
import { Pagination, Button, Tag } from "antd";  
import DataTable from "@smpm/components/DataTable";  
import { IVendorModel } from "@smpm/models/vendorModel";  
import { IBaseResponseService, IPaginationResponse } from "@smpm/models";  
import { useDebounce } from "@smpm/utils/useDebounce";  
import useTableHelper from "@smpm/utils/useTableHelper";  
import { ColumnsType } from "antd/es/table";  
import { getDataPayment } from "@smpm/services/paymentService";  
import { getVendor } from "@smpm/services/vendorService";  
import { useQuery } from "@tanstack/react-query";  
import * as dayjs from "dayjs";  
import { useNavigate } from "react-router-dom";  
import { PaymentEntity } from "@smpm/models/paymentModel";  

const TablePayment: React.FC = () => {  
  const { tableFilter, onChangeTable } = useTableHelper<PaymentEntity>({ pagination: true });  
  const [search, setSearch] = useState<string>("");  
  const searchValue = useDebounce(search, 500);  
  const [currentPage, setCurrentPage] = useState<number>(1);  
  const [pageSize, setPageSize] = useState<number>(10);  
  const navigate = useNavigate();  

  const onSearch = (value: string) => setSearch(value);  

  const { data: payment, isLoading: paymentLoading, error: paymentError } = useQuery({  
    queryKey: ["payment", { ...tableFilter, search, page: currentPage, pageSize }],  
    queryFn: () =>  
      getDataPayment({  
        order: tableFilter.sort.order,  
        order_by: tableFilter.sort.order_by,  
        search: searchValue,  
        search_by: tableFilter.searchBy,  
        page: currentPage,  
        take: pageSize,  
      }),  
  });  

  // Fetch vendor data for the "Nama Vendor" and "Tipe Vendor" columns  
  const { data: vendorData, isLoading: vendorLoading } = useQuery<  
    IBaseResponseService<IPaginationResponse<IVendorModel>>  
  >({  
    queryKey: ["vendors"],  
    queryFn: () =>  
      getVendor({  
        page: 1,  
        take: 1000,  
        order: "asc",  
        order_by: "name",  
      }),  
  });  

  const columns: ColumnsType<PaymentEntity> = useMemo(  
    (): ColumnsType<PaymentEntity> => [  
      // {  
      //   title: "Kode Invoice",  
      //   dataIndex: "invoice_code",  
      //   sorter: true,  
      //   sortDirections: ["descend", "ascend"],  
      // },  
      {  
        title: "Nama Vendor",  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
        render: (record) => {  
          const vendor = vendorData?.result.data.find((v) => v.id === record.id_vendor);  
          return vendor?.name || "";  
        },  
      },  
      {  
        title: "Kode Vendor", // New column for Vendor Code  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
        render: (record) => {  
          const vendor = vendorData?.result.data.find((v) => v.id === record.id_vendor);  
          return vendor?.code || ""; // Display the vendor code  
        },  
      },
      // {  
      //   title: "Tipe Vendor",  
      //   sorter: true,  
      //   sortDirections: ["descend", "ascend"],  
      //   render: (record) => {  
      //     const vendor = vendorData?.result.data.find((v) => v.id === record.id_vendor);  
      //     return vendor?.jenis || "";  
      //   },  
      // },  
      {  
        title: "Tanggal Submit",  
        dataIndex: "tgl_submit",  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
        render: (date) => {  
          if (!date) {  
            return (  
              <Tag color="red" style={{ padding: "4px 8px" }}>  
                Kolom belum diisi  
              </Tag>  
            );  
          }  
          return dayjs(date).format("DD-MMM-YYYY");  
        },  
      },  
      {  
        title: "Tanggal Approve",  
        dataIndex: "tgl_approve",  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
        render: (date) => {  
          if (!date) {  
            return (  
              <Tag color="red" style={{ padding: "4px 8px" }}>  
                Kolom belum diisi  
              </Tag>  
            );  
          }  
          return dayjs(date).format("DD-MMM-YYYY");  
        },  
      },  
      // {  
      //   title: "Harga Total",  
      //   dataIndex: "harga_total",  
      //   sorter: true,  
      //   sortDirections: ["descend", "ascend"],  
      // },    
      {  
        title: "Status",  
        dataIndex: "status",  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
        render: (status, record) => {  
          let color;  
          let borderColor;  
          switch (status) {  
            case "Not Open":  
              color = "#006677";  
              borderColor = "#006677";  
              break;  
            case "Pending":  
              color = "#1890FF";  
              borderColor = "#1890FF";  
              break;  
            case "Approved":  
              color = "#52C41A";  
              borderColor = "#52C41A";  
              break;  
            case "Rejected":  
              color = "#FF4D4F";  
              borderColor = "#FF4D4F";  
              break;  
            default:  
              color = "#5E5E5E";  
              borderColor = "#5E5E5E";  
          }  
          return (  
            <Button  
              type="default"  
              onClick={() => handleStatusClick(record.id_payment)}  
              style={{  
                color: color,  
                backgroundColor: "transparent",  
                border: `1px solid ${borderColor}`,  
                borderRadius: "4px",  
                padding: "4px 12px",  
                fontWeight: "normal",  
                fontSize: "14px",  
              }}  
            >  
              {status}  
            </Button>  
          );  
        },  
      },      
    ],  
    [vendorData]  
  );  

  const handlePageChange = (page: number, pageSize?: number) => {  
    setCurrentPage(page);  
    setPageSize(pageSize || 10);  
  };  

  const handleStatusClick = (id: number) => {  
    navigate(`/payment/unknown/${id}`);  
  };  

  if (paymentLoading || vendorLoading) {  
    return <div>Loading...</div>;  
  }  

  if (!payment?.result) {  
    return <div>No data available.</div>;  
  }  

  if (paymentError) {  
    return <div>Error: {paymentError.message}</div>;  
  }  

  return (  
    <div>  
      <div>  
        <DataTable<PaymentEntity>  
          dataSource={payment.result}  
          pagination={false}  
          loading={paymentLoading || vendorLoading}  
          bordered  
          onGlobalSearch={onSearch}  
          columns={columns}  
          useGlobalSearchInput  
          className="overflow-x-auto"  
          onChange={onChangeTable}  
        />  
      </div>  
      <div className="flex flex-col gap-4 mt-4">  
        {payment?.meta && (  
          <Pagination  
            current={currentPage}  
            pageSize={pageSize}  
            total={payment.meta.item_count}  
            onChange={handlePageChange}  
            className="self-end"  
          />  
        )}  
      </div>  
    </div>  
  );  
};  

export default TablePayment;