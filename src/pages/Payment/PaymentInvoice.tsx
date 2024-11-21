import React from 'react';  
import { Card, Breadcrumb, Spin } from 'antd';  
import InvoiceHeader from './components/InvoiceHeader';  
import InvoiceTable, { columns, data } from './components/InvoiceTable';  
import OrderReportButton from './components/OrderReportButton';  
import PageLabel from "@smpm/components/pageLabel";  
import Page from "@smpm/components/pageTitle";   
import { HomeOutlined } from "@ant-design/icons";  
import { IconCurrencyDollar } from "@tabler/icons-react";  
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';  

const queryClient = new QueryClient({  
  defaultOptions: {  
    queries: {  
      staleTime: 5000,  
      gcTime: 300000,  
    },  
  },  
});  

// Data dummy  
const dummyInvoiceData = {  
  invoiceNumber: "INV23434-10-11",  
  dueDate: "10 November 2024",  
  billedTo: "PT. PRISMA VISTA SOLUSI",  
  currency: "IDR - Indonesian Rupiah",  
  items: data   
};  

const PaymentInvoiceContent: React.FC = () => {  
  // Implementasi React Query  
  const { data: invoiceData, isLoading, error } = useQuery({  
    queryKey: ['paymentInvoice'],  
    queryFn: async () => {  
      // Simulasi API call  
      return dummyInvoiceData;  
      
      // Untuk implementasi API actual nantinya:  
      // const response = await fetch('/api/payment-invoice');  
      // return response.json();  
    },  
    initialData: dummyInvoiceData  
  });  

  if (isLoading) {  
    return (  
      <Page title="Payment">  
        <div className="flex justify-center items-center h-[50vh]">  
          <Spin size="large" />  
        </div>  
      </Page>  
    );  
  }  

  if (error) {  
    return (  
      <Page title="Payment">  
        <div className="text-red-500">Error loading invoice data</div>  
      </Page>  
    );  
  }  

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
            ]}  
          />  
        }  
      />  
      <Card   
        className='mt-3 ml-3 mr-3'  
        title="Preview"   
      >  
        <InvoiceHeader  
          invoiceNumber={invoiceData.invoiceNumber}  
          dueDate={invoiceData.dueDate}  
          billedTo={invoiceData.billedTo}  
          currency={invoiceData.currency}  
        />  
        <InvoiceTable />  
        <OrderReportButton   
          columns={columns}   
          data={invoiceData.items}   
        />   
      </Card>  
    </Page>  
  );  
};  

// Wrapper component dengan QueryClientProvider  
const PaymentInvoice: React.FC = () => {  
  return (  
    <QueryClientProvider client={queryClient}>  
      <PaymentInvoiceContent />  
    </QueryClientProvider>  
  );  
};  

export default PaymentInvoice;