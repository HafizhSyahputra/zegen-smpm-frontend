import React from 'react';  
import { Table } from 'antd';  
import { ColumnsType } from 'antd/es/table';  

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
    align: 'left', // Align the column to the center  
    render: (text) => (  
      <div style={{ textAlign: 'left' }}>  
        {text}  
      </div>  
    ),  
    width: '500px',
  },  
];

const data: InvoiceItem[] = [  
  { description: 'Job Order', hargaSusana: 'Rp. 19,000,000.00' },  
  { description: 'SLA Job Order', hargaSusana: 'Rp. 1,200,000.00' },  
  { description: 'Subtotal', hargaSusana: 'Rp. 17,800,000.00' },  
  { description: 'Pajak', hargaSusana: 'Rp. 1,900,000.00' },  
  { description: 'Total', hargaSusana: 'Rp. 19,700,000.00' },  
];  

const InvoiceTable: React.FC = () => {  
  return <Table columns={columns} dataSource={data} pagination={false} />;  
};  

export { columns, data };  

export default InvoiceTable;