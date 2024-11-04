// src/components/EDCDetail.tsx

import React from 'react';
import { Descriptions, List, Typography } from 'antd';
import { ElectronicDataCaptureMachine, ReceivedOut, ActivityVendorReport, ReceivedIn } from "@smpm/models/edcModel";

const { Text } = Typography;

interface EDCDetailProps {
  record: ElectronicDataCaptureMachine;
}

const EDCDetail: React.FC<EDCDetailProps> = ({ record }) => {
  return (
    <div>
      <Descriptions
        title="Detail EDC"
        bordered
        column={1}
        size="small"
      >
        <Descriptions.Item label="Owner">
          {record.owner ? (
            <>
              <Text strong>{record.owner.name}</Text>
              <br />
              <Text>Code: {record.owner.code}</Text>
              <br />
              <Text>Description: {record.owner.description || '-'}</Text>
            </>
          ) : (
            <Text>-</Text>
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Merchant">
          {record.merchant ? (
            <>
              <Text strong>{record.merchant.name}</Text>
              <br />
              <Text>Category: {record.merchant.category}</Text>
              <br />
              <Text>Customer Name: {record.merchant.customer_name}</Text>
              <br />
              <Text>Telephone: {record.merchant.telephone}</Text>
              <br />
              <Text>PIC: {record.merchant.pic}</Text>
            </>
          ) : (
            <Text>-</Text>
          )}
        </Descriptions.Item>

        {record.ReceivedIn.length > 0 && (
          <Descriptions.Item label="Received In">
            <List
              size="small"
              bordered
              dataSource={record.ReceivedIn}
              renderItem={(item: ReceivedIn) => (
                <List.Item key={item.id}>
                  <div>
                    <Text strong>ID: {item.id}</Text>
                    <br />
                    <Text>Status: {item.status}</Text>
                    <br />
                    <Text>Petugas: {item.petugas}</Text>
                    <br />
                    <Text>Kondisi Barang: {item.kondisibarang}</Text>
                    <br />
                    <Text>Approved By: {item.approved_by}</Text>
                    <br />
                    <Text>Updated At: {new Date(item.updated_at).toLocaleString()}</Text>
                  </div>
                </List.Item>
              )}
            />
          </Descriptions.Item>
        )}

        {record.ReceivedOut.length > 0 && (
          <Descriptions.Item label="Received Out">
            <List
              size="small"
              bordered
              dataSource={record.ReceivedOut}
              renderItem={(item: ReceivedOut) => (
                <List.Item key={item.id}>
                  <div>
                    <Text strong>ID: {item.id}</Text>
                    <br />
                    <Text>Status: {item.status}</Text>
                    <br />
                    <Text>Petugas: {item.petugas}</Text>
                    <br />
                    <Text>Kondisi Barang: {item.kondisibarang}</Text>
                    <br />
                    <Text>Approved By: {item.approved_by}</Text>
                    <br />
                    <Text>Updated At: {new Date(item.updated_at).toLocaleString()}</Text>
                  </div>
                </List.Item>
              )}
            />
          </Descriptions.Item>
        )}

        {record.ActivityVendorReport.length > 0 && (
          <Descriptions.Item label="Activity Vendor Report">
            <List
              size="small"
              bordered
              dataSource={record.ActivityVendorReport}
              renderItem={(item: ActivityVendorReport) => (
                <List.Item key={item.id}>
                  <div>
                    <Text strong>Job Order No:</Text> {item.job_order_no}
                    <br />
                    <Text strong>Vendor ID:</Text> {item.vendor_id}
                    <br />
                    <Text strong>Nominal:</Text> {item.nominal}
                    <br />
                    <Text strong>Status:</Text> {item.status}
                    <br />
                    <Text strong>Jenis:</Text> {item.jenis}
                    <br />
                  </div>
                </List.Item>
              )}
            />
          </Descriptions.Item>
        )}
      </Descriptions>
    </div>
  );
};

export default EDCDetail;