import React, { useState } from "react";
import { Button, List, Spin, Typography, Modal, Input } from "antd";
import { ReceivedInItem } from "@smpm/models/receivedInModel";

const { Text } = Typography;

interface ListNeedApprovalProps {
  data: ReceivedInItem[];
  loading: boolean;
  onApprove: (id: number, petugas: string, kondisibarang: string) => void;
}

const ListNeedApproval: React.FC<ListNeedApprovalProps> = ({ data, loading, onApprove }) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [petugasName, setPetugasName] = useState<string>("");
  const [kondisiBarang, setKondisiBarang] = useState<string>("");

  const handleApproveClick = (id: number): void => {
    setSelectedItemId(id);
    setIsModalVisible(true);
  };

  const handleOk = (): void => {
    if (selectedItemId !== null) {
      onApprove(selectedItemId, petugasName, kondisiBarang);
    }
    setIsModalVisible(false);
    setPetugasName("");
    setKondisiBarang("");
  };

  const handleCancel = (): void => {
    setIsModalVisible(false);
    setPetugasName("");
    setKondisiBarang("");
  };

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
          renderItem={(item: ReceivedInItem) => (
            <List.Item
              key={item.id}
              className="p-3 mb-2 bg-white rounded-lg shadow-sm"
            >
              <div className="flex flex-col w-full">
                <div className="flex-grow mb-2">
                  <div className="font-semibold">
                    {item.joborder.type} - {item.joborder.merchant_name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {item.serial_number} | TID: {item.tid}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Region: {item.region.name} | Vendor: {item.vendor.name}
                  </div>
                  <Button type="primary" onClick={() => handleApproveClick(item.id)}>
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
      <Modal
        title="Approval Details"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Approve"
        cancelText="Cancel"
        className="approval-modal"
      >
        <div className="space-y-4">
          <div>
            <Text strong>Nama Petugas</Text>
            <Input
              placeholder="Masukkan nama petugas"
              value={petugasName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPetugasName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Text strong>Kondisi Barang</Text>
            <Input.TextArea
              placeholder="Deskripsikan kondisi barang"
              value={kondisiBarang}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setKondisiBarang(e.target.value)}
              className="mt-1"
              rows={4}
            />
          </div>
        </div>
      </Modal>
     
    </div>
  );
};

export default ListNeedApproval;