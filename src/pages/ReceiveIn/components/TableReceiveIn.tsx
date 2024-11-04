import DataTable from "@smpm/components/DataTable";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import moment from "moment";
import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { receivedInService } from "@smpm/services/receivedInService";
import { ReceivedInItem } from "@smpm/models/receivedInModel";
import { message, Spin } from "antd";
import { SorterResult } from "antd/es/table/interface";

interface TableReceiveInProps {
  data: ReceivedInItem[];
  loading: boolean;
}

const TableReceiveIn: React.FC<TableReceiveInProps> = ({ data, loading }) => {
  const columns: ColumnsType<ReceivedInItem> = useMemo((): ColumnsType<ReceivedInItem> => {
    return [
      {
        title: "TID",
        dataIndex: ["edc", "tid"],
        sorter: true,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "Merk",
        dataIndex: ["edc", "brand"],
        sorter: true,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "Jenis Merk",
        dataIndex: ["edc", "brand_type"],
        sorter: true,
        sortDirections: ["descend", "ascend"],
      },
      
      {
        title: "Petugas",
        dataIndex: "petugas",
        sorter: true,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "Kondisi Barang",
        dataIndex: "kondisibarang",
        sorter: true,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "Approved At",
        dataIndex: "updated_at",
        sorter: true,
        sortDirections: ["descend", "ascend"],
        render: (value: string) => {
          return moment(value).format("DD MMMM YYYY");
        },
      },
    ];
  }, []);

  return (
    <div>
      {loading ? (
        <Spin size="large" />
      ) : (
        <DataTable
          dataSource={data}
          columns={columns}
          pagination={{
            current: 1,
            pageSize: 10,
            total: data.length,
          }}
          useGlobalSearchInput
          rowKey="id"
          bordered
        />
      )}
    </div>
  );
};

export default TableReceiveIn;