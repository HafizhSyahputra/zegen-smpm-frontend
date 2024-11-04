// src/components/Add/AddRequest.tsx

import React from 'react';
import PageContent from "@smpm/components/PageContent";
import PageLabel from "@smpm/components/pageLabel";
import Page from "@smpm/components/pageTitle";
import { Card, Col, Row, Typography } from "antd";
import ListNeedApproval from "./ApproveEdit";
import TableApprove from './EditTable';

const { Title } = Typography;

const EditRequest: React.FC = () => {
  return (
    <Page title="Approve">
      <PageContent>
        <Row gutter={16}>
          <Col xs={24} md={6}>
            <Card>
              <Title level={5}>Need Approval</Title>
              <ListNeedApproval />
            </Card>
          </Col>
          <Col xs={24} md={18}>
            <Card>
              <Title level={5}>Approval History</Title>
              <TableApprove />
            </Card>
          </Col>
        </Row>
      </PageContent>
    </Page>
  );
};

export default EditRequest;