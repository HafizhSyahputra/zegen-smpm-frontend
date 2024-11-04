import { Alert, Button, Space } from "antd";
import React from "react";

type AlertMoveProps = {
  onMoveEDC: () => void;
};

const AlertMove: React.FC<AlertMoveProps> = ({ onMoveEDC }) => {
  return (
    <Alert
      message="Move EDC"
      description="Move Some EDC to New Warehouse"
      type="info"
      closeIcon={false}
      action={
        <Space direction="vertical">
          <Button size="small" type="primary" onClick={onMoveEDC}>
            Move EDC Now
          </Button>
        </Space>
      }
      closable
    />
  );
};

export default AlertMove;