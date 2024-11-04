import { Col, Row, Typography } from "antd";
import React from "react";

const { Title } = Typography;

type SectionHeaderProps = {
  title: string;
  action?: React.ReactNode;
};

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, action }) => {
  return (
    <Row justify={"space-between"}>
      <Col xs={24} md={12}>
        <Title level={4} style={{ marginTop: 0 }}>
          {title}
        </Title>
      </Col>
      <Col xs={24} md={12}>
        {action}
      </Col>
    </Row>
  );
};

export default SectionHeader;
