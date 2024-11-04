import React from 'react';  
import {  
  HomeOutlined,  
  CloudUploadOutlined,  
} from "@ant-design/icons";  
import PageContent from "@smpm/components/PageContent";  
import PageLabel from "@smpm/components/pageLabel";  
import { Breadcrumb, Button, Card, Space } from "antd";  
import Page from '@smpm/components/pageTitle';  
import AuditTrailTable from "./Components/TableAudit";  
import { exportAuditLogs } from '@smpm/services/auditService'; 
import { message } from 'antd';

const AuditTrail = () => {  
  const handleExport = async () => {  
    try {  
      await exportAuditLogs('Autentikasi');  
      message.success('Audit logs for "Autentikasi" exported successfully');  
    } catch (error) {  
      message.error('Failed to export audit logs');  
    }  
  };
  return (  
    <Page title="Authentication Logs">  
      <PageLabel  
        title={<span className="font-semibold text-2xl">Authentication Logs</span>}  
        subtitle={  
          <Breadcrumb  
            items={[  
              {  
                href: "/dashboard",  
                title: (  
                  <>  
                    <HomeOutlined />  
                    <span>Home</span>  
                  </>  
                ),  
              },  
              {  
                href: "#",  
                title: (  
                  <div className="flex gap-1">  
                    <span>Audit</span>  
                  </div>  
                ),  
              },  
              {  
                title: "Authentication Logs",  
              },  
            ]}  
          />  
        }  
        endSection={  
          <Space>  
            <Button icon={<CloudUploadOutlined />} onClick={handleExport}>Export</Button>  
          </Space>  
        }  
      />  
      <PageContent>  
        <Card>  
          <AuditTrailTable />  
        </Card>  
      </PageContent>  
    </Page>  
  );  
};  

export default AuditTrail;