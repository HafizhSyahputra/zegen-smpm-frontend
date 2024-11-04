// src/pages/ReceiveOut.tsx

import React, { useEffect, useState, useCallback } from "react";
import { Modal, Input, Typography, Breadcrumb, Card, Col, Row, message } from "antd";
import { IconArrowRight } from "@tabler/icons-react";
import PageContent from "@smpm/components/PageContent";
import PageLabel from "@smpm/components/pageLabel";
import Page from "@smpm/components/pageTitle";
import TableReceiveOut from "./components/TableReceiveOut";
import ListNeedApprovalOut from "./components/ListNeedApproval"; // Ensure correct path
import { receivedOutService } from "@smpm/services/receivedOutService";
import { ReceivedOutItem } from "@smpm/models/receivedOutModel";

const { Title, Text } = Typography;

const ReceiveOut = () => {
  // State for items needing approval
  const [needApprovalData, setNeedApprovalData] = useState<ReceivedOutItem[]>([]);
  const [loadingNeedApproval, setLoadingNeedApproval] = useState<boolean>(false);

  // State for approved items
  const [approvedData, setApprovedData] = useState<ReceivedOutItem[]>([]);
  const [loadingApproved, setLoadingApproved] = useState<boolean>(false);

  // Modal state
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentApprovalId, setCurrentApprovalId] = useState<number | null>(null);
  const [petugasName, setPetugasName] = useState<string>("");
  const [kondisiBarang, setKondisiBarang] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // For disabling the OK button during submission

  // Fetch items needing approval
  const fetchNeedApprovalData = useCallback(async () => {
    setLoadingNeedApproval(true);
    try {
      const response = await receivedOutService.findWaiting({
        page: 1,
        take: 10, // Adjust as needed
        order: 'desc',
        order_by: 'id'
      });
      setNeedApprovalData(response.result.data);
    } catch (error: any) {
      console.error(error);
      message.error("Failed to fetch data for items needing approval.");
    } finally {
      setLoadingNeedApproval(false);
    }
  }, []);
  // Fetch approved items
  const fetchApprovedData = useCallback(async () => {
    setLoadingApproved(true);
    try {
      const response = await receivedOutService.findAll({
        page: 1,
        take: 10, // Adjust as needed
        order: 'desc',
        order_by: 'id'
      });
      // Filter approved items on the frontend
      const approvedItems = response.result.data.filter(item => item.status === 'approved');
      setApprovedData(approvedItems);
    } catch (error: any) {
      console.error(error);
      message.error("Failed to fetch data for approved items.");
    } finally {
      setLoadingApproved(false);
    }
  }, []);
  // Fetch data on component mount
  useEffect(() => {
    fetchNeedApprovalData();
    fetchApprovedData();
  }, [fetchNeedApprovalData, fetchApprovedData]);

  // Handle Approve button click - show modal
  const handleApprove = (id: number) => {
    setCurrentApprovalId(id);
    setIsModalVisible(true);
  };

  // Handle Modal OK
  const handleOk = async () => {
    if (currentApprovalId === null) {
      message.error("Invalid item selected for approval.");
      return;
    }

    if (!petugasName.trim()) {
      message.error("Nama Petugas tidak boleh kosong.");
      return;
    }

    if (!kondisiBarang.trim()) {
      message.error("Kondisi Barang tidak boleh kosong.");
      return;
    }

    try {
      setIsSubmitting(true);
      const userId = 1; // Replace with actual logic to get the current user's ID
      const response = await receivedOutService.approveItem(currentApprovalId, {
        approved_by: userId,
        updated_by: userId,
        petugas: petugasName,
        kondisibarang: kondisiBarang,
      });
      message.success(`Item dengan ID ${currentApprovalId} berhasil disetujui.`);

      // Update state
      setNeedApprovalData((prevData) => prevData.filter((item) => item.id !== currentApprovalId));
      setApprovedData((prevData) => [response.result, ...prevData]);

      // Reset modal state
      setIsModalVisible(false);
      setPetugasName("");
      setKondisiBarang("");
      setCurrentApprovalId(null);
    } catch (error: any) {
      console.error(error);
      message.error("Gagal menyetujui item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Modal Cancel
  const handleCancel = () => {
    setIsModalVisible(false);
    setPetugasName("");
    setKondisiBarang("");
    setCurrentApprovalId(null);
  };

  return (
    <Page title={"Receive Out"}>
      <PageLabel
        title={<span className="text-2xl font-semibold">Receive Out</span>}
        subtitle={
          <Breadcrumb
            items={[
              {
                href: "",
                title: (
                  <span>
                    <IconArrowRight />
                    <span>Receive Out</span>
                  </span>
                ),
              },
            ]}
          />
        }
      />
      <PageContent>
        <Row gutter={16}>
          <Col xs={24} md={6}>
            <Card>
              <Title level={5}>Need Approval</Title>
              <ListNeedApprovalOut
                data={needApprovalData}
                loading={loadingNeedApproval}
                onApprove={handleApprove}
              />
            </Card>
          </Col>
          <Col xs={24} md={18}>
            <Card>
              <Title level={5}>Already Approved</Title>
              <TableReceiveOut
                data={approvedData}
                loading={loadingApproved}
              />
            </Card>
          </Col>
        </Row>
      </PageContent>

      {/* Approval Modal */}
      <Modal
        title="Approval Details"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Approve"
        cancelText="Cancel"
        className="approval-modal"
        okButtonProps={{ disabled: isSubmitting }}
        cancelButtonProps={{ disabled: isSubmitting }}
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
    </Page>
  );
};

export default ReceiveOut;