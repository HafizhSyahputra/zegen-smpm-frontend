import PageContent from "@smpm/components/PageContent";  
import PageLabel from "@smpm/components/pageLabel";  
import Page from "@smpm/components/pageTitle";  
import { Breadcrumb, Button, Card, Divider, Flex, Typography } from "antd";  
import {  
  HomeOutlined,  
} from "@ant-design/icons";  
import TableVendor from "./Components/TableDocVendor";  
import { IconPlus } from "@tabler/icons-react";  
import { useNavigate } from 'react-router-dom';  
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';  

const { Title } = Typography;  

const queryClient = new QueryClient({  
  defaultOptions: {  
    queries: {  
      refetchOnWindowFocus: false,  
      retry: 1,  
      staleTime: 5 * 60 * 1000,  
    },  
  },  
});  

const FileIcon = () => (  
  <svg  
    xmlns="http://www.w3.org/2000/svg"  
    width="17"  
    height="17"   
    viewBox="0 0 24 24"  
    fill="none"  
    stroke="currentColor"  
    strokeWidth="2"  
    strokeLinecap="round"  
    strokeLinejoin="round"  
    className="icon icon-tabler icons-tabler-outline icon-tabler-file"  
  >  
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />  
    <path d="M14 3v4a1 1 0 0 0 1 1h4" />  
    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />  
  </svg>  
);  

const VendorContent = () => {  
  const navigate = useNavigate();  

  const handleAddData = () => {  
    navigate('/add-doc-vendor');  
  };  

  return (  
    <Page title={"Document Vendor"}>  
      <PageLabel  
        title={<span className="font-semibold text-2xl">Document Vendor</span>}  
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
                    <FileIcon />  
                    <span>Document</span>  
                  </div>  
                ),  
              },  
              {  
                title: "Document Vendor",  
              },  
            ]}  
          />  
        }  
      />  
      <PageContent>  
        <Card>  
          <Flex justify="space-between" align="flex-end">  
            <Title level={3}>Document Vendor</Title>  
            <Button  
              type="primary"  
              style={{  
                display: "flex",  
                alignItems: "center",  
              }}  
              onClick={handleAddData}  
            >  
              <IconPlus style={{ marginRight: "8px" }} />  
              Add Data  
            </Button>  
          </Flex>  
          <Divider />  
          <TableVendor />  
        </Card>  
      </PageContent>  
    </Page>  
  );  
};  

const Vendor = () => {  
  return (  
    <QueryClientProvider client={queryClient}>  
      <VendorContent />  
    </QueryClientProvider>  
  );  
};  

export default Vendor;