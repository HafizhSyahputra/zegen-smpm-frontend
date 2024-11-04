// src/components/Add/ApproveAdd.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Button, List, message, Modal, Input, Pagination } from 'antd';
import { IApproveMerchantModel } from "../../../../models/merchantApproveModel";
import { getWaitingApprovalsEdit, approveMerchant, rejectMerchant } from "../../../../services/approveMerchantService";

const { TextArea } = Input;

const ListNeedApproval: React.FC = () => {
  const [data, setData] = useState<IApproveMerchantModel[]>([]);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState<IApproveMerchantModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getWaitingApprovalsEdit({ type: 'Edit', page });
        console.log("API Response:", response); // Debugging

        if (response.result && Array.isArray(response.result.items)) {
          if (page === 1) {
            setData(response.result.items);
          } else {
            setData(prev => [...prev, ...response.result.items]);
          }
          setTotalItems(response.result.meta.item_count);
          setHasMore(response.result.meta.has_next_page);
        } else {
          setData([]);
          setHasMore(false);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        message.error('Failed to fetch waiting approvals.');
        setData([]);
        setHasMore(false);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [page]);

  const handleApprove = async (id: number) => {
    try {
      await approveMerchant(id);
      setData(prevData =>
        prevData.filter((item) => item.id !== id)
      );
      message.success(`Item approved`);
    } catch (error) {
      console.error("Approve Error:", error);
      message.error('Failed to approve item.');
    }
  };

  const handleReject = (item: IApproveMerchantModel) => {
    setCurrentItem(item);
    setRejectModalVisible(true);
  };

  const handleRejectConfirm = async () => {
    if (currentItem) {
      try {
        await rejectMerchant(currentItem.id!, currentItem.reason || '', currentItem.info_remark || '');
        setData(prevData =>
          prevData.filter((item) => item.id !== currentItem.id)
        );
        message.success(`Item rejected`);
        setRejectModalVisible(false);
        setCurrentItem(null);
      } catch (error) {
        console.error("Reject Error:", error);
        message.error('Failed to reject item.');
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="flex flex-col h-full">
      <Button
        type="primary"
        className="mb-4 w-full bg-[#006677] hover:bg-teal-700"
        disabled={data.length === 0}
        onClick={() => data.forEach(item => handleApprove(item.id!))}
      >
        Approve All
      </Button>
      <div
        ref={listRef}
        className="flex-1 w-full ml-2 overflow-y-auto"
        style={{
          maxHeight: '400px',
        }}
      >
        <List
          itemLayout="vertical"
          dataSource={data}
          renderItem={(item) => (
            <List.Item key={item.id} className="w-full p-3 mb-2 bg-white rounded-lg shadow-sm">
              <div className="flex flex-col w-full mr-6">
                <div className="flex justify-between mb-2">
                  <div>
                    <div className="font-semibold">{item.merchant?.name}</div>
                    <div className="text-sm text-gray-600">MID: {item.merchant?.mid}</div>
                  </div>
                  <div className="text-right">
                    <div className="pt-2 text-xs text-gray-500">Status: {item.status}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <Button
                    onClick={() => handleReject(item)}
                    className="flex-1 text-red-500 bg-transparent border border-red-500"
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleApprove(item.id!)}
                    className="flex-1 text-white border border-[#006677] bg-[#006677]"
                  >
                    Approve
                  </Button>
                </div>
              </div>
            </List.Item>
          )}
          loading={isLoading}
        />
        {!hasMore && <div className="mt-4 text-center text-gray-500">No more items</div>}
      </div>

      <div className="flex justify-end mt-4">
        <Pagination
          current={page}
          total={totalItems}
          pageSize={10} // Sesuaikan dengan backend jika perlu
          onChange={handlePageChange}
          showSizeChanger={false}
          showQuickJumper
        />
      </div>

      {currentItem && (
        <Modal
          visible={rejectModalVisible}
          onCancel={() => setRejectModalVisible(false)}
          onOk={handleRejectConfirm}
          title="Reject Item"
        >
          <div className="space-y-4">
            <div>
            <div className="font-semibold">Reason</div>
              <TextArea
                rows={3}
                value={currentItem.reason}
                onChange={(e) => setCurrentItem({ ...currentItem, reason: e.target.value })}
              />

              <div className="font-semibold">Info Remark</div>
              <TextArea
                rows={3}
                value={currentItem.info_remark}
                onChange={(e) => setCurrentItem({ ...currentItem, info_remark: e.target.value })}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ListNeedApproval;