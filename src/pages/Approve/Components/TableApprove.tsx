import React, { useMemo, useState, useEffect } from 'react';  
import DataTable from "@smpm/components/DataTable";  
import { ApproveItem } from '@smpm/models/approveModel';  
import { approveService } from '@smpm/services/approveService';  
import { useDebounce } from "@smpm/utils/useDebounce";  
import useTableHelper from "@smpm/utils/useTableHelper";  
import { useQuery } from "@tanstack/react-query";  
import { Badge } from 'antd';  
import { ColumnsType } from "antd/es/table";  
import * as dayjs from "dayjs";  
import { CheckboxValueType } from 'antd/es/checkbox/Group';  

interface TableApproveProps {  
  refetchData: () => void;  
}  

const TableApprove: React.FC<TableApproveProps> = ({ refetchData }) => {  
  const { tableFilter, onChangeTable, onChangeSearchBy } = useTableHelper<ApproveItem>({ pagination: true });  
  const [search, setSearch] = useState<string>("");  
  const searchValue = useDebounce(search, 500);  

  const onSearch = (value: string) => setSearch(value);  

  const { data: approveData, isLoading, isSuccess } = useQuery({  
    queryKey: ["approve-data", { ...tableFilter, searchValue }],  
    queryFn: () => approveService.findAll({  
      order: tableFilter.sort.order,  
      order_by: tableFilter.sort.order_by,  
      search: searchValue,  
      search_by: tableFilter.searchBy,  
      page: Number(tableFilter.pagination.current) || 1,  
      take: Number(tableFilter.pagination.pageSize) || 5, 
    }),  
  });  

  useEffect(() => {  
    if (isSuccess) {  
      refetchData();  
    }  
  }, [isSuccess, refetchData]);  

  const handleChangeSearchBy = (value: CheckboxValueType[]) => {  
    onChangeSearchBy(value as string[]);  
  };  

  const columns: ColumnsType<ApproveItem> = useMemo((): ColumnsType<ApproveItem> => {  
    return [  
      {  
        title: "NO. JO",  
        dataIndex: ["jobOrder", "no"],  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
      },  
      {  
        title: "JENIS JO",  
        dataIndex: ["jobOrder", "type"],  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
      },  
      {  
        title: "TANGGAL",  
        dataIndex: ["jobOrder", "date"],  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
        render: (date) => dayjs(date).format("DD-MMM-YYYY"),  
      },  
      {  
        title: "MID",  
        dataIndex: ["jobOrder", "mid"],  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
      },  
      {  
        title: "TID",  
        dataIndex: ["jobOrder", "tid"],  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
      },  
      {  
        title: "NAMA MERCHANT",  
        dataIndex: ["jobOrder", "merchant_name"],  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
      },  
      {  
        title: "KATEGORI MERCHANT",  
        dataIndex: ["jobOrder", "merchant_category"],  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
      },  
      {  
        title: "KATEGORI SEWA/MILIK",  
        dataIndex: ["jobOrder", "ownership"],  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
        render: (ownership) => (  
          <Badge color={ownership === "Milik" ? "orange" : "cyan"} text={ownership} />  
        ),  
      },  
      {  
        title: "VENDOR",  
        dataIndex: ["vendor", "name"],  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
      },  
      {  
        title: "REGION",  
        dataIndex: ["region", "name"],  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
      },  
      {  
        title: "STATUS",  
        dataIndex: "status",  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
        render: (status) => (  
          <Badge  
            color={status === 'Waiting' ? "blue" : status === 'Approved' ? "green" : "red"}  
            text={status}  
          />  
        ),  
      },  
    ];  
  }, []);  

  return (  
    <div className="p-4 max-w-full mx-auto">  
      <DataTable<ApproveItem>  
        dataSource={approveData?.result?.data ?? []}  
        pagination={{  
          current: approveData?.result?.meta?.page ?? 1,  
          pageSize: approveData?.result?.meta?.take ?? 5,  
          total: approveData?.result?.meta?.item_count ?? 0,  
          showSizeChanger: true,   
          pageSizeOptions: [5, 10, 20, 50],   
        }}  
        loading={isLoading}  
        bordered  
        onChangeSearchBy={handleChangeSearchBy}  
        searchByOptions={[  
          { name: "NO. JO", value: "jobOrder.no" },  
          { name: "Jenis", value: "jobOrder.type" },  
          { name: "MID", value: "jobOrder.mid" },  
          { name: "TID", value: "jobOrder.tid" },  
          { name: "Nama Merchant", value: "jobOrder.merchant_name" },  
          { name: "Kategori Merchant", value: "jobOrder.merchant_category" },  
          { name: "Kategori Sewa/Milik", value: "jobOrder.ownership" },  
          { name: "Vendor", value: "vendor.name" },  
          { name: "Region", value: "region.name" },  
          { name: "Status", value: "status" },  
        ]}  
        onGlobalSearch={onSearch}  
        columns={columns}  
        useGlobalSearchInput  
        onChange={onChangeTable}  
        scroll={{ x: 2000 }}  
      />  
    </div>  
  );  
};  

export default TableApprove;