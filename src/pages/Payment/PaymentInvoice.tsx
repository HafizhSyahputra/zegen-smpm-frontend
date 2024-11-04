import React from 'react';  
import { Card, Button, Space, Breadcrumb, Divider, Flex, Typography } from 'antd';  
import InvoiceHeader from './components/InvoiceHeader';  
import InvoiceTable, { columns, data } from './components/InvoiceTable';  
import OrderReportButton from './components/OrderReportButton';
import PageContent from "@smpm/components/PageContent";  
import PageLabel from "@smpm/components/pageLabel";  
import Page from "@smpm/components/pageTitle"; 
import {  
    HomeOutlined,  
  } from "@ant-design/icons";  
  import { IconCurrencyDollar, IconFileUnknown } from "@tabler/icons-react"


const PaymentInvoice: React.FC = () => {  
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
                href: "/payment/unknown/:id",  
                title: (  
                  <div className="flex gap-0">  
                    <IconCurrencyDollar className="w-5 h-[18px]"/>  
                    <span>Payment</span>  
                  </div>  
                ),  
              },  
              {
                href: "/payment/unknown/:id",
                title: (
                  <div className="flex gap-0">
                    <IconCurrencyDollar className="w-5 h-[18px]" />
                    <span>Payment Detail</span>
                  </div>
                ),
              },
              {
                title: "Payment Invoice"
              },
            //   {  
            //     href: "/",  
            //     title: "Payment",  
            //   },  
            ]}  
          />  
        }  
      />  
    <Card   
      className='mt-3 ml-3 mr-3'
      title="Preview"   
      extra={  
        <Space>  
          <Button   
            type="primary"   
            style={{ backgroundColor: '#ff9900', borderColor: '#ff9900' }}  
          >  
             <div className="flex items-center">  
                <IconFileUnknown className="mr-1 w-[16px] h-[16px] mb-1" />  
                PDF  
              </div>
          </Button>  
          {/* <Button>Email</Button>   */}
        </Space>  
      }  
    >  
      <InvoiceHeader  
        invoiceNumber="INV23434-10-11"  
        dueDate="10 November 2024"  
        billedTo="PT. PRISMA VISTA SOLUSI"  
        currency="IDR - Indonesian Rupiah"  
      />  
      <InvoiceTable />  
      <OrderReportButton columns={columns} data={data} />   
    </Card>  
    </Page>
  );  
};  

export default PaymentInvoice;