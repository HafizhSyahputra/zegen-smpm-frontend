import React, { useCallback, useMemo, useState } from "react";  
import { useNavigate } from "react-router-dom";  
import { useMutation, useQuery } from "@tanstack/react-query";  
import { Button, Modal, Space, Tooltip } from "antd";  
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";  
import type { ColumnsType } from "antd/es/table";  

import DataTable from "@smpm/components/DataTable";  
import { IMaintenanceModel } from "@smpm/models/maintenanceModel";  
import {   
  getDataMaintenance,   
  deleteDataMaintenance   
} from "@smpm/services/maintenanceService";  
import { useDebounce } from "@smpm/utils/useDebounce";  
import useTableHelper from "@smpm/utils/useTableHelper";  

const TableView: React.FC = () => {  
  const navigate = useNavigate();  
  const { tableFilter, onChangeTable } = useTableHelper<IMaintenanceModel>();  
  const [search, setSearch] = useState<string>("");  
  const searchValue = useDebounce(search, 500);  
  const [open, setOpen] = useState<boolean>(false);  
  const [maintenanceData, setMaintenanceData] = useState<IMaintenanceModel>({});  
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);  

  const deleteMutation = useMutation({  
    mutationFn: deleteDataMaintenance,  
  });  

  const {  
    data: maintenance,  
    isLoading,  
    refetch,  
  } = useQuery({  
    queryKey: ["maintenance", { ...tableFilter, searchValue }],  
    queryFn: () =>  
      getDataMaintenance({  
        order: tableFilter.sort.order,  
        order_by: tableFilter.sort.order_by,  
        search: searchValue,  
        search_by: tableFilter.searchBy,  
        page: parseInt(tableFilter.pagination.current),  
        take: parseInt(tableFilter.pagination.pageSize),  
      }),  
  });  

  const onSearch = (value: string) => setSearch(value);  

  const showModal = (row: IMaintenanceModel) => {  
    setMaintenanceData(row);  
    setOpen(true);  
  };  

  const handleOk = () => {  
    setConfirmLoading(true);  
    deleteMutation.mutate(maintenanceData.id!, {  
      onSuccess: () => {  
        refetch();  
        setOpen(false);  
        setConfirmLoading(false);  
      },  
      onError: () => {  
        setOpen(false);  
        setConfirmLoading(false);  
      },  
    });  
  };  

  const handleCancel = () => {  
    setOpen(false);  
  };  

  const columns: ColumnsType<IMaintenanceModel> = useMemo(  
    (): ColumnsType<IMaintenanceModel> => [  
      {  
        title: "Maintenance ID",  
        dataIndex: "maintenance_id",  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
      },  
      {  
        title: "Merchant",  
        dataIndex: "merchant_name",  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
      },  
      {  
        title: "Terminal",  
        dataIndex: "terminal_id",  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
      },  
      {  
        title: "Type",  
        dataIndex: "maintenance_type",  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
      },  
      {  
        title: "Status",  
        dataIndex: "status",  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
      },  
      {  
        title: "Date",  
        dataIndex: "maintenance_date",  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
      },  
      {  
        title: "Action",  
        key: "action",  
        width: 100,  
        render: (_, record) => (  
          <Space size="small">  
            <Tooltip title="Edit">  
              <Button  
                icon={<EditOutlined />}  
                onClick={() => navigate(`/maintenance/edit/${record.id}`)}  
                size="small"  
              />  
            </Tooltip>  
            <Tooltip title="Delete">  
              <Button  
                icon={<DeleteOutlined />}  
                onClick={() => showModal(record)}  
                size="small"  
                danger  
              />  
            </Tooltip>  
          </Space>  
        ),  
      },  
    ],  
    [navigate]  
  );  

  return (  
    <>  
      <Modal  
        title="Delete Maintenance"  
        open={open}  
        onOk={handleOk}  
        confirmLoading={confirmLoading}  
        onCancel={handleCancel}  
      >  
        <p style={{ fontSize: "18px" }}>  
          Are you sure you want to delete maintenance for{" "}  
          <span style={{ fontWeight: "bold" }}>  
            {maintenanceData.merchant_name}  
          </span>  
          ?  
        </p>  
      </Modal>  
      <DataTable<IMaintenanceModel>  
        dataSource={maintenance?.result.data}  
        pagination={{  
          current: maintenance?.result.meta.page,  
          pageSize: maintenance?.result.meta.take,  
          total: maintenance?.result.meta.item_count,  
        }}  
        loading={isLoading}  
        bordered  
        onGlobalSearch={onSearch}  
        columns={columns}  
        useGlobalSearchInput  
        onChange={onChangeTable}  
      />  
    </>  
  );  
};  

export default TableView;