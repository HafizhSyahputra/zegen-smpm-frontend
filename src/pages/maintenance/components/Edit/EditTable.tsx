// src/components/Add/AddTable.tsx

import React, { useMemo, useState, useEffect } from 'react';
import DataTable from "@smpm/components/DataTable";
import { ColumnsType } from "antd/es/table";
import { Tag, Pagination, message, Popover, Descriptions, Space } from 'antd';
import { IApproveMerchantModel } from "../../../../models/merchantApproveModel";
import { getApprovalHistoryEdit } from "../../../../services/approveMerchantService";
import { InfoCircleOutlined } from '@ant-design/icons';

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
        const response = await getApprovalHistoryEdit({ type: 'Edit', page: currentPage });
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

  const expandedRowRender = (record: IApproveMerchantModel) => {
    let dataBefore: any = {};
    let dataAfter: any = {};

    try {
      dataBefore = JSON.parse(record.DataBefore);
    } catch (error) {
      console.error("Error parsing DataBefore:", error);
    }

    try {
      dataAfter = JSON.parse(record.DataAfter);
    } catch (error) {
      console.error("Error parsing DataAfter:", error);
    }

    const dataContent = (
      <div className="flex space-x-4">
        <div className="flex-1">
          <Descriptions
            title="Data Sebelum Perubahan"
            size="small"
            column={1}
            bordered
            style={{ marginBottom: 16 }}
          >
            {Object.entries(dataBefore).map(([key, value]) => (
              <Descriptions.Item key={key} label={key}>
                {typeof value === 'object' && value !== null ? JSON.stringify(value, null, 2) : value || 'N/A'}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </div>
        <div className="flex-1">
          <Descriptions
            title="Data Setelah Perubahan"
            size="small"
            column={1}
            bordered
          >
            {Object.entries(dataAfter).map(([key, value]) => (
              <Descriptions.Item key={key} label={key}>
                {typeof value === 'object' && value !== null ? JSON.stringify(value, null, 2) : value || 'N/A'}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </div>
      </div>
    );

    return dataContent;
  };

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
          expandable={{
            expandedRowRender: record => expandedRowRender(record),
            rowExpandable: record => true,
            expandRowByClick: true,
          }}
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
          pageSizeOptions={['10', '20', '50', '100']}
        />
      </div>
    </div>
  );
};

export default TableApprove;