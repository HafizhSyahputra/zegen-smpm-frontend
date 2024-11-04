// src/pages/ReceiveOut/components/ListNeedApprovalOut.tsx

import React from "react";
import { Button, List, Spin, Typography } from "antd";
import { ReceivedOutItem } from "@smpm/models/receivedOutModel";

const { Text } = Typography;

interface ListNeedApprovalOutProps {
  data: ReceivedOutItem[];
  loading: boolean;
  onApprove: (id: number) => void;
}

const ListNeedApprovalOut: React.FC<ListNeedApprovalOutProps> = ({
  data,
  loading,
  onApprove,
}) => {
  console.log("ReceivedOut Data:", data); // Debugging

  return (
    <div className="max-w-4xl p-4 mx-auto">
      {loading ? (
        <div className="flex justify-center">
          <Spin size="large" />
        </div>
      ) : data && data.length > 0 ? (
        <List
          itemLayout="vertical"
          dataSource={data}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              className="p-3 mb-2 bg-white rounded-lg shadow-sm"
            >
              <div className="flex flex-col w-full">
                <div className="flex-grow mb-2">
                  <div className="font-semibold">
                    {item.joborder?.type ?? "N/A"} - {item.joborder?.merchant_name ?? "N/A"}
                  </div>
                  <div className="text-sm text-gray-600">
                    {item.serial_number ?? "N/A"} | TID: {item.tid ?? "N/A"}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Region: {item.region?.name ?? "N/A"} | Vendor: {item.vendor?.name ?? "N/A"}
                  </div>
                  <Button type="primary" onClick={() => onApprove(item.id)}>
                    Approve
                  </Button>
                </div>
              </div>
            </List.Item>
          )}
        />
      ) : (
        <div className="mt-4 text-center text-gray-500">
          Tidak ada item yang perlu disetujui.
        </div>
      )}
    </div>
  );
};

export default ListNeedApprovalOut;