// src/components/TableReceiveOut.tsx

import React, { useMemo } from "react";
import DataTable from "@smpm/components/DataTable";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import { ReceivedOutItem } from "@smpm/models/receivedOutModel";
import { Spin } from "antd";

interface TableReceiveOutProps {
  data: ReceivedOutItem[];
  loading: boolean;
}

const TableReceiveOut: React.FC<TableReceiveOutProps> = ({ data, loading }) => {
  const columns: ColumnsType<ReceivedOutItem> = useMemo((): ColumnsType<ReceivedOutItem> => {
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
        title: "Merk EDC",
        dataIndex: ["edc", "brand_type"],
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
      {
        title: "Status",
        dataIndex: "status",
        sorter: true,
        sortDirections: ["descend", "ascend"],
        render: (status: string) => status.charAt(0).toUpperCase() + status.slice(1),
      },
    ];
  }, []);

  return (
    <div>
      {loading ? (
        <div className="flex justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <DataTable
          dataSource={data}
          columns={columns}
          pagination={{
            current: 1, // Sesuaikan dengan pagination backend jika diperlukan
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

export default TableReceiveOut;