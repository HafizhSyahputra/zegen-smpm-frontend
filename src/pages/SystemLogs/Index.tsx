import {  
    HomeOutlined,  
    CloudUploadOutlined,  
  } from "@ant-design/icons";  
  import PageContent from "@smpm/components/PageContent";  
  import PageLabel from "@smpm/components/pageLabel";  
  import { IconUsersGroup } from "@tabler/icons-react";  
  import { Breadcrumb, Button, Card, Space, message } from "antd";  
  import Page from '@smpm/components/pageTitle';  
  import AuditTrailTable from "./Components/TableSystemLogs";
  import { exportSystemAuditLogs } from '@smpm/services/auditService'; 
   
  const SystemLogs = () => { 
    const handleExport = async () => {  
      try {  
        await exportSystemAuditLogs();  
        message.success('Audit logs exported successfully');  
      } catch (error) {  
        message.error('Failed to export audit logs');  
      }  
    }; 
    return (  
      <Page title="System Logs">  
        <PageLabel  
          title={<span className="font-semibold text-2xl">System Logs</span>}  
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
                      <IconUsersGroup size="1rem" />  
                      <span>Audit</span>  
                    </div>  
                  ),  
                },  
                {  
                  title: "System Logs",  
                },  
              ]}  
            />  
          }  
          endSection={  
            <Space>  
              {/* <Button icon={<CloudUploadOutlined />}>Export</Button> */}
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
  
  export default SystemLogs;