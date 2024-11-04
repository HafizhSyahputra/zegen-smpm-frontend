import React from "react";  
import PageContent from "@smpm/components/PageContent";  
import PageLabel from "@smpm/components/pageLabel";  
import Page from "@smpm/components/pageTitle";  
import { Breadcrumb } from "antd";  
import { HomeOutlined } from "@ant-design/icons";  
import { IconCurrencyDollar } from "@tabler/icons-react";  
import PaymentDetail from "./components/PaymentDetail";  

const PaymentDetailPages: React.FC = () => {  
  return (  
    <Page title="Payment Detail">  
      <PageLabel  
        title={<span className="font-semibold text-2xl">Payment Detail</span>}  
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
                href: "/payment",  
                title: (  
                  <div className="flex gap-0">  
                    <IconCurrencyDollar className="w-5 h-[18px]" />  
                    <span>Payment</span>  
                  </div>  
                ),  
              },  
              {  
                title: "Payment Detail"  
              },  
            ]}  
          />  
        }  
      />  

      <PageContent>  
        <PaymentDetail />   
      </PageContent>  
    </Page>  
  );  
};  

export default PaymentDetailPages;