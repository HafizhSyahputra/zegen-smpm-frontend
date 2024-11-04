// src/pages/ReceiveIn.tsx

import React, { useEffect, useState, useCallback } from "react";
import PageContent from "@smpm/components/PageContent";
import PageLabel from "@smpm/components/pageLabel";
import Page from "@smpm/components/pageTitle";
import { IconArrowDown } from "@tabler/icons-react";
import { Breadcrumb, Card, Col, Row, Typography, message } from "antd";
import TableReceiveIn from "./components/TableReceiveIn";
import ListNeedApproval from "./components/ListNeedApproval";
import { receivedInService } from "@smpm/services/receivedInService";
import { ReceivedInItem } from "@smpm/models/receivedInModel";

const { Title } = Typography;

const ReceiveIn = () => {
  const [needApprovalData, setNeedApprovalData] = useState<ReceivedInItem[]>([]);
  const [loadingNeedApproval, setLoadingNeedApproval] = useState<boolean>(false);
  const [approvedData, setApprovedData] = useState<ReceivedInItem[]>([]);
  const [loadingApproved, setLoadingApproved] = useState<boolean>(false);

  const fetchNeedApprovalData = useCallback(async () => {
    setLoadingNeedApproval(true);
    try {
      const response = await receivedInService.findAll({
        status: "waiting",
        page: 1,
        take: 10,
        order: "desc",
        order_by: "id"
      });
      setNeedApprovalData(response.result.data);
    } catch (error: any) {
      console.error(error);
      message.error("Failed to fetch data for items needing approval.");
    } finally {
      setLoadingNeedApproval(false);
    }
  }, []);

  const fetchApprovedData = useCallback(async () => {
    setLoadingApproved(true);
    try {
      const response = await receivedInService.findAll({
        status: "approved",
        page: 1,
        take: 10,
        order: "desc",
        order_by: "id"
      });
      setApprovedData(response.result.data);
    } catch (error: any) {
      console.error(error);
      message.error("Failed to fetch data for approved items.");
    } finally {
      setLoadingApproved(false);
    }
  }, []);

  useEffect(() => {
    fetchNeedApprovalData();
    fetchApprovedData();
  }, [fetchNeedApprovalData, fetchApprovedData]);

  const handleApprove = async (id: number, petugas: string, kondisibarang: string) => {
    try {
      const userId = 1; // Replace with logic to get the real user ID
      const response = await receivedInService.approveItem(id, {
        approved_by: userId,
        updated_by: userId,
        petugas, // Pass the petugas name
        kondisibarang,
      });
      message.success(`Item with ID ${id} approved successfully.`);
  
      // Update the states after approval
      fetchNeedApprovalData();
      fetchApprovedData();
    } catch (error: any) {
      console.error(error);
      message.error("Failed to approve item.");
    }
  };

  return (
    <Page title={"Receive In"}>
      <PageLabel
        title={<span className="text-2xl font-semibold">Receive In</span>}
        subtitle={
          <Breadcrumb
            items={[
              {
                href: "",
                title: (
                  <span>
                    <IconArrowDown />
                    <span>Receive In</span>
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
              <ListNeedApproval
                data={needApprovalData}
                loading={loadingNeedApproval}
                onApprove={handleApprove}
              />
            </Card>
          </Col>
          <Col xs={24} md={18}>
            <Card>
              <Title level={5}>Already Approved</Title>
              <TableReceiveIn
                data={approvedData}
                loading={loadingApproved}
              />
            </Card>
          </Col>
        </Row>
      </PageContent>
    </Page>
  );
};

export default ReceiveIn;