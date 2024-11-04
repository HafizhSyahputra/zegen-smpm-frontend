import React, { useState, useRef } from "react";
import { Button, List, message, Modal, Input, Form } from "antd";
import { ApproveItem } from "@smpm/models/approveModel";
import { approveService } from "@smpm/services/approveService";

const { TextArea } = Input;

interface ListNeedApprovalProps {
  data: ApproveItem[];
  onApprove: () => void;
}

const ListNeedApproval: React.FC<ListNeedApprovalProps> = ({
  data,
  onApprove,
}) => {
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<ApproveItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const [form] = Form.useForm();

  const handleApprove = async (id: number) => {
    try {
      await approveService.approveItem(id);
      message.success(`Item approved successfully`);
      onApprove();
    } catch (error) {
      message.error("Failed to approve item");
    }
  };

  const handleReject = (item: ApproveItem) => {
    setCurrentItem(item);
    setRejectModalVisible(true);
  };

  const handleRejectConfirm = async () => {
    if (currentItem) {
      try {
        const { reason, info_remark } = await form.validateFields();
        const rejectDto = {
          reason,
          info_remark,
        };

        await approveService.rejectedItem(currentItem.id, rejectDto);
        message.success(`Item with TID ${currentItem.jobOrder.tid} rejected`);
        setRejectModalVisible(false);
        setCurrentItem(null);
        form.resetFields();
        onApprove();
      } catch (error) {
        message.error("Failed to reject item");
      }
    }
  };

  const handleApproveAll = async () => {
    try {
      const result = await approveService.bulkApprove(
        pendingItems.map((item) => item.id)
      );
      message.success(`${result.result.count} items approved`);
      onApprove();
    } catch (error) {
      message.error("Failed to approve all items");
    }
  };

  const pendingItems = data.filter((item) => item.status === "Waiting");

  const filteredItems = pendingItems.filter(
    (item) =>
      item.jobOrder.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jobOrder.merchant_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.jobOrder.no.toString().includes(searchTerm)
  );

  return (
    <div className="max-w-2xl mx-auto" ref={listRef}>
      <Input
        placeholder="Search.."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <Button
        type="primary"
        onClick={handleApproveAll}
        className="mb-4 w-full bg-[#006677] hover:bg-teal-700"
        disabled={filteredItems.length === 0}
      >
        Approve All
      </Button>
      <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 rounded-lg">
        <List
          itemLayout="vertical"
          dataSource={filteredItems}
          renderItem={(item) => (
            <List.Item className="bg-white shadow-sm rounded-lg mb-2 p-3 w-11/12 mx-auto">
              <div className="flex flex-col w-full">
                <div className="flex justify-between mb-2">
                  <div>
                    <div className="font-semibold">{item.jobOrder.type}</div>
                    <div className="text-sm text-gray-600">
                      {item.jobOrder.merchant_name}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 pt-2">
                      {item.jobOrder.no}
                    </div>
                    <div className="text-xs text-gray-500">
                      MID: {item.jobOrder.mid}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center space-x-2">
                  <Button
                    onClick={() => handleReject(item)}
                    className="flex-1 text-red-500 border border-red-500 bg-transparent"
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleApprove(item.id)}
                    className="flex-1 text-white border border-[#006677] bg-[#006677]"
                  >
                    Approve
                  </Button>
                </div>
              </div>
            </List.Item>
          )}
        />
      </div>
      {filteredItems.length === 0 && (
        <div className="text-center text-gray-500 mt-4">
          No items left to approve
        </div>
      )}

      <Modal
        visible={rejectModalVisible}
        onCancel={() => {
          setRejectModalVisible(false);
          form.resetFields();
        }}
        onOk={handleRejectConfirm}
        title="Reject Item"
        okText="Confirm"
        cancelText="Cancel"
        width={500}
        centered
      >
        <Form form={form} layout="vertical" requiredMark={false}>
          <Form.Item
            name="reason"
            label="Reason"
            rules={[{ required: true, message: "Please input the reason" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="info_remark"
            label="Info Remark"
            rules={[
              { required: true, message: "Please input the info remark" },
            ]}
          >
            <TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ListNeedApproval;
