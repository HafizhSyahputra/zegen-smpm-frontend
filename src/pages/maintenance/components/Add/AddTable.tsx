// src/components/Add/AddTable.tsx

import React, { useMemo, useState, useEffect } from 'react';
import DataTable from "@smpm/components/DataTable";
import { ColumnsType } from "antd/es/table";
import { Tag, Pagination, message, Popover, Descriptions, Space } from 'antd'; // Import Popover dan Space
import { IApproveMerchantModel } from "../../../../models/merchantApproveModel";
import { getApprovalHistoryAdd } from "../../../../services/approveMerchantService";
import { InfoCircleOutlined } from '@ant-design/icons'; // Import ikon

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
        const response = await getApprovalHistoryAdd({ type: 'Add', page: currentPage });
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
        render: (status: string, record: IApproveMerchantModel) => {
          let color = 'blue';
          if (status === 'Approved') color = 'green';
          if (status === 'Rejected') color = 'red';

          const tag = (
            <Tag color={color} className={`bg-${color} text-${color} cursor-pointer`}>
              {status.toUpperCase()}
            </Tag>
          );

          if (status === 'Rejected') {
            const popoverContent = (
              <Descriptions
                title="Detail Penolakan"
                size="small"
                column={1}
                bordered
                style={{ maxWidth: 300 }}
              >
                <Descriptions.Item label="Alasan">
                  {record.reason || 'Tidak ada informasi'}
                </Descriptions.Item>
                <Descriptions.Item label="Catatan">
                  {record.info_remark || 'Tidak ada informasi'}
                </Descriptions.Item>
              </Descriptions>
            );

            return (
              <Popover
                content={popoverContent}
                trigger="hover"
                placement="topLeft"
                overlayStyle={{ maxWidth: 320 }}
              >
                <Space>
                  {tag}
                  <InfoCircleOutlined style={{ color: color }} />
                </Space>
              </Popover>
            );
          }

          return tag;
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