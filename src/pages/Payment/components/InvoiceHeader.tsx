import React from 'react';  
import { Typography, Spin } from 'antd';  
import { useQuery } from '@tanstack/react-query';  

const { Title, Text } = Typography;  

interface InvoiceHeaderProps {  
  invoiceNumber: string;  
  dueDate: string;  
  billedTo: string;  
  currency: string;  
}  

// Data dummy  
const dummyHeaderData: InvoiceHeaderProps = {  
  invoiceNumber: "INV23434-10-11",  
  dueDate: "10 November 2024",  
  billedTo: "PT. PRISMA VISTA SOLUSI",  
  currency: "IDR - Indonesian Rupiah"  
};  

const InvoiceHeader: React.FC = () => {  
  const { data, isLoading, error } = useQuery({  
    queryKey: ['invoiceHeader'],  
    queryFn: async () => {    
      return dummyHeaderData;  
    },  
    initialData: dummyHeaderData,  
    gcTime: 300000,  
    staleTime: 5000, 
  });  

  if (isLoading) return <Spin />;  
  
  if (error) return <div>Error loading invoice header</div>;  

  if (!data) return null;  

  return (  
    <div className="flex justify-between mb-8">  
      <div>  
        <Title level={5}>No. Faktur: {data.invoiceNumber}</Title>  
      </div>  
      <div className="text-left w-[300px]">  
        <Text strong>Due Date</Text>  
        <Text className="block">{data.dueDate}</Text>  
        <Text strong>Subject</Text>  
        <Text className="block">-</Text>  
        <Text strong>Billed to</Text>  
        <Text className="block">{data.billedTo}</Text>  
        <Text strong>Currency</Text>  
        <Text className="block">{data.currency}</Text>  
      </div>  
    </div>  
  );  
};  

// Jika komponen ini digunakan di tempat lain dan membutuhkan Props  
export const InvoiceHeaderWithProps: React.FC<InvoiceHeaderProps> = ({   
  invoiceNumber,   
  dueDate,   
  billedTo,   
  currency   
}) => {  
  return (  
    <div className="flex justify-between mb-8">  
      <div>  
        <Title level={5}>No. Faktur: {invoiceNumber}</Title>  
      </div>  
      <div className="text-left w-[300px]">  
        <Text strong>Due Date</Text>  
        <Text className="block">{dueDate}</Text>  
        <Text strong>Subject</Text>  
        <Text className="block">-</Text>  
        <Text strong>Billed to</Text>  
        <Text className="block">{billedTo}</Text>  
        <Text strong>Currency</Text>  
        <Text className="block">{currency}</Text>  
      </div>  
    </div>  
  );  
};  

// File utama yang menggunakan komponen ini (misalnya PaymentInvoice.tsx)  
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';  

const queryClient = new QueryClient();  

export const PaymentInvoice: React.FC = () => {  
  return (  
    <QueryClientProvider client={queryClient}>  
      <div>  
        <InvoiceHeader />  
      </div>  
    </QueryClientProvider>  
  );  
};  

export default InvoiceHeader;