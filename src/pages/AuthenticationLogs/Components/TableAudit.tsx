import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { IAuditTrail } from "@smpm/models/auditModel";
import { getAuditTrails } from '@smpm/services/auditService';
import { useQuery } from '@tanstack/react-query';
import { Table, Tag, message } from 'antd';
import { ColumnsType } from "antd/es/table";
import React, { useMemo, useState } from 'react';

const AuditTrailTable: React.FC = () => {  
  const [expandedRowKey, setExpandedRowKey] = useState<string | null>(null);  

  const { data: auditTrails, isLoading } = useQuery({  
    queryKey: ['auditTrails', 'auth'],  
    queryFn: async () => {  
      try {  
        const data = await getAuditTrails();  
        if (data && data.result && Array.isArray(data.result.result)) {  
          return data.result.result.filter((trail: IAuditTrail) =>  
            trail.MenuName === "Autentikasi"  
          );  
        } else {  
          console.error('Unexpected data format:', data);  
          message.error('Received unexpected data format');  
          return [];  
        }  
      } catch (error) {  
        console.error('Error fetching audit trails:', error);  
        message.error('Failed to fetch audit trails');  
        throw error;  
      }  
    }  
  });  

  const expandedRowRender = (record: IAuditTrail) => {  
    const columns: ColumnsType<any> = [  
      { title: 'Info', dataIndex: 'info', key: 'info' },  
      { title: 'Value Before', dataIndex: 'valueBefore', key: 'valueBefore' },  
      { title: 'Value After', dataIndex: 'valueAfter', key: 'valueAfter' },  
    ];  

    let dataBefore: Record<string, any> = {};  
    let dataAfter: Record<string, any> = {};  

    if (record.DataBefore && record.DataBefore.trim() !== '') {  
      try {  
        dataBefore = JSON.parse(record.DataBefore);  
      } catch (error) {  
        console.error('Error parsing DataBefore:', error);  
        dataBefore = {};  
      }  
    }  

    if (record.DataAfter && record.DataAfter.trim() !== '') {  
      try {  
        dataAfter = JSON.parse(record.DataAfter);  
      } catch (error) {  
        console.error('Error parsing DataAfter:', error);  
        dataAfter = {};  
      }  
    }  

    const allKeys = new Set([...Object.keys(dataBefore), ...Object.keys(dataAfter)]);  

    const formatDate = (date: any) => {  
      const d = new Date(date);  
      return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('id-ID');  
    };  

    const data = Array.from(allKeys)  
      .filter(key => key !== 'relation')  
      .map(key => ({  
        key,  
        info: key,  
        valueBefore: dataBefore[key] !== undefined && dataBefore[key] !== null && dataBefore[key] !== ''  
          ? (typeof dataBefore[key] === 'string' && !isNaN(new Date(dataBefore[key]).getTime())  
            ? formatDate(dataBefore[key])  
            : dataBefore[key])  
          : '-',  
        valueAfter: dataAfter[key] !== undefined && dataAfter[key] !== null && dataAfter[key] !== ''  
          ? (typeof dataAfter[key] === 'string' && !isNaN(new Date(dataAfter[key]).getTime())  
            ? formatDate(dataAfter[key])  
            : dataAfter[key])  
          : '-',  
      }));  

    return <Table columns={columns} dataSource={data} pagination={false} />;  
  };  

  const columns: ColumnsType<IAuditTrail> = useMemo((): ColumnsType<IAuditTrail> => {  
    return [  
      {  
        title: "URL",  
        dataIndex: "Url",  
        key: "Url",  
        ellipsis: true,  
      },  
      {  
        title: "Action",  
        dataIndex: "ActionName",  
        key: "ActionName",  
      },  
      {  
        title: "Menu",  
        dataIndex: "MenuName",  
        key: "MenuName",  
      },  
      {  
        title: "User",  
        dataIndex: "UserName",  
        key: "UserName",  
      },  
      {  
        title: "IP Address",  
        dataIndex: "IpAddress",  
        key: "IpAddress",  
      },  
      {  
        title: "Date",  
        dataIndex: "ActivityDate",  
        key: "ActivityDate",  
        render: (date: string) => {  
          const d = new Date(date);  
          return isNaN(d.getTime()) ? 'Invalid Date' : d.toLocaleString();  
        },  
      },  
      {  
        title: "Browser",  
        dataIndex: "Browser",  
        key: "Browser",  
      },  
      {  
        title: "OS",  
        dataIndex: "OS",  
        key: "OS",  
      },  
      {  
        title: "App Source",  
        dataIndex: "AppSource",  
        key: "AppSource",  
        render: (source: string) => <Tag color="blue">{source}</Tag>,  
      },  
      {  
        title: "Actions",  
        key: "actions",  
        width: 50,  
        render: (_, record) => (  
          <div style={{ display: 'flex', justifyContent: 'center' }}>  
            <a onClick={() => handleRowExpand(record)}>  
              {expandedRowKey === record.id.toString() ? <MinusOutlined /> : <PlusOutlined />}  
            </a>  
          </div>  
        ),  
      },  
    ];  
  }, [expandedRowKey]);  

  const handleRowExpand = (record: IAuditTrail) => {  
    setExpandedRowKey(expandedRowKey === record.id.toString() ? null : record.id.toString());  
  };  

  return (  
    <Table<IAuditTrail>  
      dataSource={auditTrails || []}  
      columns={columns}  
      loading={isLoading}  
      bordered  
      rowKey={(record) => record.id.toString()}  
      scroll={{ x: 'max-content' }}  
      expandable={{  
        expandedRowRender,  
        expandedRowKeys: [expandedRowKey],  
        onExpand: (_expanded, record) => handleRowExpand(record),  
        rowExpandable: (record) => record.DataBefore !== '{}' && record.DataAfter !== '{}',  
        expandIconColumnIndex: -1, 
      }}  
    />  
  );  
};  

export default AuditTrailTable;