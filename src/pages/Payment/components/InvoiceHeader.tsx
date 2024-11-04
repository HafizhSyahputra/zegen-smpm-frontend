import React from 'react';  
import { Typography } from 'antd';  

const { Title, Text } = Typography;  

interface InvoiceHeaderProps {  
  invoiceNumber: string;  
  dueDate: string;  
  billedTo: string;  
  currency: string;  
}  

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ invoiceNumber, dueDate, billedTo, currency }) => {  
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

export default InvoiceHeader;