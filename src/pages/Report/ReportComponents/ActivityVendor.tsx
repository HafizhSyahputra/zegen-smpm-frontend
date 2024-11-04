import DataTable from "@smpm/components/DataTable";  
import { useDebounce } from "@smpm/utils/useDebounce";  
import useTableHelper from "@smpm/utils/useTableHelper";  
import { useQuery } from "@tanstack/react-query";  
import { Badge, DatePicker, Flex, Space, Typography } from "antd";  
import { ColumnsType } from "antd/es/table";  
import * as dayjs from "dayjs";  
import { useMemo, useState, useEffect } from "react";  
import FilterTable, { TOptions } from "./FilterTable";  
 import { IActivityVendorReportModel } from "@smpm/models/activityVendorReportModel";
import { IPaginationRequest } from "@smpm/models";
import { getVendor } from "@smpm/services/vendorService";
import { getActivityVendorReport } from "@smpm/services/activityVendorReportService";
 
const { Title } = Typography;  
const { RangePicker } = DatePicker;  

const optionStatus: TOptions[] = [  
  { label: "All Status", value: "All Status" },  
  { label: "Pending", value: "Pending" },  
  { label: "Approved", value: "Approved" },  
  { label: "Rejected", value: "Rejected" },  
];  

function VendorReport() {  
  const { tableFilter, onChangeTable, onChangeSearchBy } = useTableHelper<IActivityVendorReportModel>({ pagination: true });  
  const [search, setSearch] = useState<string>("");  
  const searchValue = useDebounce(search, 500);  
  const [selectedStatus, setSelectedStatus] = useState("All Status");  
  const [selectedVendor, setSelectedVendor] = useState("All Vendor");  
  const [vendorOptions, setVendorOptions] = useState<TOptions[]>([{ label: "All Vendor", value: "All Vendor" }]);  

  useEffect(() => {  
    const fetchOptions = async () => {  
      try {  
        const vendorRequest: IPaginationRequest = {  
          page: 1,  
          take: 1000,  
          order: "asc",  
          order_by: "name",  
        };  
        const vendorResponse = await getVendor(vendorRequest);  
        setVendorOptions((prevOptions) => [  
          prevOptions[0],  
          ...vendorResponse.result.data.map((vendor) => ({  
            label: vendor.name,  
            value: vendor.id.toString(),  
          })),  
        ]);  
      } catch (error) {  
        console.error("Error fetching options:", error);  
      }  
    };  

    fetchOptions();  
  }, []);  

  const { data: vendorReports, isLoading } = useQuery({  
    queryKey: ["vendor-report", { ...tableFilter, searchValue, selectedStatus, selectedVendor }],  
    queryFn: () =>  
      getActivityVendorReport({  
        order: tableFilter.sort.order,  
        order_by: tableFilter.sort.order_by,  
        search: searchValue,  
        search_by: ["job_order.no", "job_order.type"],  
        page: Number(tableFilter.pagination.current) || 1,  
        take: Number(tableFilter.pagination.pageSize) || 10,  
      }),  
  });  

  const columns: ColumnsType<IActivityVendorReportModel> = useMemo(() => {  
    return [  
        {  
            title: "NAMA VENDOR",  
            dataIndex: ["vendor", "name"],  
            sorter: true,  
            sortDirections: ["descend", "ascend"],  
        },  
      {  
        title: "TANGGAL",  
        dataIndex: ["job_order", "date"],  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
        render: (tanggal_jo) => {  
          return dayjs(tanggal_jo).format("DD-MMM-YYYY");  
        },  
      },  
      {  
        title: "Jenis",  
        dataIndex: ["jenis"],  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
      },  
      {  
        title: "MID",  
        dataIndex: ["mid"],  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
      },  
      {  
        title: "TID",  
        dataIndex: ["tid"],  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
      },  
      {  
        title: "Location",  
        dataIndex: ["location"],  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
      },  
      {  
        title: "Deskripsi",  
        dataIndex: ["description"],  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
      },  
      {  
        title: "Jumlah Barang",  
        dataIndex: ["amount"],  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
      },  
      {  
        title: "Waktu Mulai",  
        dataIndex: ["start_time"],  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
        render: (start_time) => {  
            return dayjs(start_time).format("DD-MMM-YYYY");  
          },  
      },  
      {  
        title: "Waktu Selesai",  
        dataIndex: ["end_time"],  
        sorter: true,  
        sortDirections: ["descend", "ascend"],
        render: (end_time) => {  
            return dayjs(end_time).format("DD-MMM-YYYY");  
          },   
      },  
      {  
        title: "Petugas",  
        dataIndex: ["petugas"],  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
      },  
      {  
        title: "Status Kunjungan",  
        dataIndex: "status",  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
        render: (status:  "Done" | "Cancel", record) => (  
          <div>
          <Badge  
            color={status === 'Done' ? "green" : "red"}  
            text={status}  
          />  
           {status === "Cancel" && (  
              <div className="mt-2 text-gray-400 text-xs">  
                {record.information}  
              </div>  
            )}  
          </div>
        ),  
      },  
    ];  
  }, []);  

  return (  
    <>  
      <Flex justify="space-between" align="flex-end">  
        <Title level={3}>Activity Vendor Report</Title>  
        <Space direction="vertical" size={12}>  
          <RangePicker />  
        </Space>  
      </Flex>  
      <FilterTable  
              optionStatus={optionStatus}
              optionVendor={vendorOptions}
              hasDownloadReportOrder={false}
              handleChangeFilterStatus={(value) => setSelectedStatus(value)}
              valueStatus={selectedStatus}
              handleChangeFilterVendor={(value) => setSelectedVendor(value)}
              valueVendor={selectedVendor} handleChangeFilterWilayah={function (_key: string): void {
                  throw new Error("Function not implemented.");
              } } valueWilayah={""} optionWilayah={[]} handleChangeFilterMerchant={function (_key: string): void {
                  throw new Error("Function not implemented.");
              } } valueMerchant={""} optionMerchant={[]}      />  
      <DataTable<IActivityVendorReportModel>  
        dataSource={vendorReports?.result.data}  
        pagination={{  
          current: vendorReports?.result.meta.page,  
          pageSize: vendorReports?.result.meta.take,  
          total: vendorReports?.result.meta.item_count,  
        }}  
        loading={isLoading}  
        bordered  
        onChangeSearchBy={onChangeSearchBy}  
        onGlobalSearch={(value) => setSearch(value)}  
        columns={columns}  
        useGlobalSearchInput  
        onChange={onChangeTable}  
        scroll={{  
          x: 2500,  
        }}  
      />  
    </>  
  );  
}  

export default VendorReport;