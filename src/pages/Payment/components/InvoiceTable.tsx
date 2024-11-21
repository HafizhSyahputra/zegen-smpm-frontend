import React from 'react';  
import { Table } from 'antd';  
import { ColumnsType } from 'antd/es/table';  
import { useQuery } from '@tanstack/react-query';  

interface InvoiceItem {  
  description: string;  
  hargaSusana: string;  
}  

const columns: ColumnsType<InvoiceItem> = [  
  {  
    title: 'Description',  
    dataIndex: 'description',  
    key: 'description',  
  },  
  {  
    title: 'Harga Susana',  
    dataIndex: 'hargaSusana',  
    key: 'hargaSusana',  
    align: 'left',  
    render: (text) => (  
      <div style={{ textAlign: 'left' }}>  
        {text}  
      </div>  
    ),  
    width: '500px',  
  },  
];  

// Data dummy untuk fallback  
const dummyData: InvoiceItem[] = [  
  { description: 'Job Order', hargaSusana: 'Rp. 19,000,000.00' },  
  { description: 'SLA Job Order', hargaSusana: 'Rp. 1,200,000.00' },  
  { description: 'Subtotal', hargaSusana: 'Rp. 17,800,000.00' },  
  { description: 'Pajak', hargaSusana: 'Rp. 1,900,000.00' },  
  { description: 'Total', hargaSusana: 'Rp. 19,700,000.00' },  
];  

const InvoiceTable: React.FC = () => {  
  const { data = dummyData } = useQuery({  
    queryKey: ['invoiceItems'],  
    queryFn: async () => dummyData,  
    gcTime: 300000, // Mengganti cacheTime dengan gcTime  
    staleTime: 5000,  
    initialData: dummyData  
  });  

  return <Table   
    columns={columns}   
    dataSource={data}   
    pagination={false}  
    rowKey={(record) => record.description}  
  />;  
};  

export { columns, dummyData as data };  

export default InvoiceTable;