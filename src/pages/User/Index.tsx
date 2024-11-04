
import React, { useState } from 'react';
import {
  CloudUploadOutlined,
  HomeOutlined,
  PlusOutlined,
} from "@ant-design/icons"
import PageContent from "@smpm/components/PageContent"
import PageLabel from "@smpm/components/pageLabel"
import Page from "@smpm/components/pageTitle"
import { IconUsers } from "@tabler/icons-react"
import { Breadcrumb, Button, Card, Space } from "antd"
import TableUser from "./components/TableUser"

const User: React.FC = () => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const handleAddUser = () => {
    setIsAddModalVisible(true);
  };

  return (
    <Page title="User">
      <PageLabel
        title={<span className="font-semibold text-2xl">User</span>}
        subtitle={
          <Breadcrumb
            items={[
              {
                href: "/",
                title: (
                  <>
                    <HomeOutlined />
                    <span>Home</span>
                  </>
                ),
              },
              {
                title: (
                  <div className="flex gap-1">
                    <IconUsers size="1rem" />
                    <span>User Management</span>
                  </div>
                ),
              },
              {
                title: "User",
              },
            ]}
          />
        }
        endSection={
          <Space>
            <Button icon={<CloudUploadOutlined />}>Export</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUser}>
              Add New User
            </Button>
          </Space>
        }
      />
      <PageContent>
        <Card>
          <TableUser isAddModalVisible={isAddModalVisible} setIsAddModalVisible={setIsAddModalVisible} />
        </Card>
      </PageContent>
    </Page>
  )
}

export default User
