import PageContent from "@smpm/components/PageContent";  
import PageLabel from "@smpm/components/pageLabel";  
import Page from "@smpm/components/pageTitle";  
// import { IconBuildingStore } from "@tabler/icons-react";  
import { Breadcrumb, Card, Divider, Flex, Typography } from "antd";  
import TablePayment from "./components/TablePayment";  
import {  
  HomeOutlined,  
} from "@ant-design/icons";  
import { IconCurrencyDollar } from "@tabler/icons-react"

const { Title } = Typography;  

// const FileIcon = () => (  
//   <svg  
//     xmlns="http://www.w3.org/2000/svg"  
//     width="17"  
//     height="17"  
//     viewBox="0 0 24 24"  
//     fill="none"  
//     stroke="currentColor"  
//     strokeWidth="2"  
//     strokeLinecap="round"  
//     strokeLinejoin="round"  
//     className="icon icon-tabler icons-tabler-outline icon-tabler-file"  
//   >  
//     <path stroke="none" d="M0 0h24v24H0z" fill="none" />  
//     <path d="M14 3v4a1 1 0 0 0 1 1h4" />  
//     <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />  
//   </svg>  
// );  

const Payment = () => {  
  return (  
    <Page title={"Payment"}>  
      <PageLabel  
        title={<span className="font-semibold text-2xl">Payment</span>}  
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
                    <IconCurrencyDollar className="w-5 h-[18px]"/>  
                    <span>Payment</span>  
                  </div>  
                ),  
              },  
            //   {  
            //     href: "/",  
            //     title: "Payment",  
            //   },  
            ]}  
          />  
        }  
      />  
      <PageContent>  
        <Card>  
          <Flex justify="space-between" align="flex-end">  
            <Title level={3}>Payment</Title>  
          </Flex>  
          <Divider />  
          <TablePayment />  
        </Card>  
      </PageContent>  
    </Page>  
  );  
};  

export default Payment;