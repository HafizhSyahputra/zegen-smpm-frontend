
import { Layout, Tabs, TabsProps, Typography, Breadcrumb } from "antd";
import React, { useState } from "react";
import JobOrder from "./ReportComponents/JobOrder";
import PreventiveMaintenance from "./ReportComponents/PreventiveMaintenance";
import Inventory from "./ReportComponents/Inventory";
import ActivityVendor from "./ReportComponents/ActivityVendor";
import PageContent from "@smpm/components/PageContent";  
import PageLabel from "@smpm/components/pageLabel";  
import Page from "@smpm/components/pageTitle"; 
import {  
  HomeOutlined,  
} from "@ant-design/icons";  
import { IconReport } from "@tabler/icons-react"

function Report() {
  const [tabActive, setTabActive] = useState<string>("1");
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "JOB ORDER REPORT",
    },
    {
      key: "2",
      label: "PREVENTIVE MAINTENANCE REPORT",
    },
    {
      key: "3",
      label: "INVENTORY REPORT",
    },
    {
      key: "4",
      label: "ACTIVITY VENDOR REPORT",
    },
  ];

  const onChange = (key: string) => {
    setTabActive(key);
  };

  return (
    <Page title={"Report"}>  
      <PageLabel  
        title={<span className="font-semibold text-2xl">Report</span>}  
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
                title: "Report"
              },
              // {  
              //   href: "#",  
              //   title: (  
              //     <div className="flex gap-0">  
              //       <IconReport className="w-5 h-[18px] mr-1"/>  
              //       <span>Report</span>  
              //     </div>  
              //   ),  
              // },  
            //   {  
            //     href: "/",  
            //     title: "Payment",  
            //   },  
            ]}  
          />  
        }  
      />  
      <PageContent> 
    <Layout
      style={{
        backgroundColor: "white",
        padding: "30px",
      }}
    >
      <Tabs defaultActiveKey={tabActive} items={items} onChange={onChange} />
      {tabActive === "1" ? (
        <JobOrder />
      ) : tabActive === "2" ? (
        <PreventiveMaintenance />
      ) : tabActive === "3" ? (
        <Inventory />
      ) : tabActive === "4" ? (
        <ActivityVendor />
      ) : (
        <Typography>Invalid Tab</Typography>
      )}
    </Layout>
    </PageContent>  
    </Page>  
  );
}

export default Report;