// src/components/Add/AddTable.tsx

import React, { useMemo, useState, useEffect } from 'react';
import DataTable from "@smpm/components/DataTable";
import { ColumnsType } from "antd/es/table";
import { Tag, Pagination, message } from 'antd';
import { IApproveMerchantModel } from "../../../../models/merchantApproveModel";
import { getApprovalHistoryDelete } from "../../../../services/approveMerchantService";

const TableApprove: React.FC = () => {
  const [data, setData] = useState<IApproveMerchantModel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // **Change the type from 'Add' to 'Delete'**
        const response = await getApprovalHistoryDelete({ type: 'Delete', page: currentPage });
        console.log("Approval History Response:", response); // Debugging
        if (response.result && Array.isArray(response.result.items)) {
          setData(response.result.items);
          setTotalItems(response.result.meta.item_count);
        } else {
          setData([]);
          setTotalItems(0);
        }
      } catch (error) {
        console.error("Fetch Approval History Error:", error);
        message.error('Failed to fetch approval history.');
      }
      setIsLoading(false);
    };
    fetchData();
  }, [currentPage]);

  const columns = useMemo((): ColumnsType<IApproveMerchantModel> => {
    return [
      {
        title: "MID",
        dataIndex: ["merchant", "mid"],
        sorter: true,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "Nama Merchant",
        dataIndex: ["merchant", "name"],
        sorter: true,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "Kategori Merchant",
        dataIndex: ["merchant", "category"],
        sorter: true,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "Status",
        dataIndex: "status",
        sorter: true,
        sortDirections: ["descend", "ascend"],
        render: (status: string) => {
          let color = 'blue';
          if (status === 'Approved') color = 'green';
          if (status === 'Rejected') color = 'red';
          return (
            <Tag color={color} className={`bg-${color} text-${color}`}>
              {status.toUpperCase()}
            </Tag>
          );
        },
      },
    ];
  }, []);

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setPageSize(pageSize);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-auto">
        <DataTable<IApproveMerchantModel>
          dataSource={data}
          columns={columns}
          bordered
          loading={isLoading}
          pagination={false}
        />
      </div>
      <div className="flex justify-end mt-4">
        <Pagination
          current={currentPage}
          total={totalItems}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger
          showQuickJumper
        />
      </div>
    </div>
  );
};

export default TableApprove;