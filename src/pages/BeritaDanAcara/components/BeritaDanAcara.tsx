import  { useMemo } from 'react';
import { Table, Button, Space, Popconfirm, Tooltip, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';

interface IRoleModel {
  id: number;
  name: string;
  uploadDate: string;
  status: string;
  fileUrl?: string; // Properti opsional untuk URL file
  [key: string]: any; // Untuk mendukung properti lain jika ada
}

const BeritaTable = ({ fileList, onEdit, onDelete, onDownload }: { fileList: IRoleModel[], onEdit: (record: IRoleModel) => void, onDelete: (key: number) => void, onDownload: (record: IRoleModel) => void }) => {
  const statusDescriptions: { [key: string]: string } = {
    'Dilaporkan Hilang': 'EDC telah dilaporkan hilang, dan dalam proses pelaporan lebih lanjut.',
    'Dalam Pencarian': 'Proses pencarian atau investigasi sedang dilakukan.',
    'Tidak Ditemukan': 'Setelah dilakukan pencarian, EDC tidak ditemukan.',
    'Ditemukan': 'EDC telah ditemukan.',
    'Pending': 'Menunggu konfirmasi dari pihak terkait atau langkah selanjutnya.',
  };

  const renderStatus = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'Dilaporkan Hilang': 'red',
      'Dalam Pencarian': 'orange',
      'Tidak Ditemukan': 'gray',
      'Ditemukan': 'green',
      'Pending': 'blue',
    };

    return (
      <Tag color={colorMap[status] || 'red'}>
        {statusDescriptions[status] || 'Dilaporkan Hilang'}
      </Tag>
    );
  };

  const columns: ColumnsType<IRoleModel> = useMemo((): ColumnsType<IRoleModel> => {
    return [
      {
        title: "Nama Berita/Acara",
        dataIndex: "name",
        key: "name",
        sorter: true,
      },
      {
        title: "Tanggal Unggah",
        dataIndex: "uploadDate",
        key: "uploadDate",
        sorter: true,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: renderStatus,
        sorter: true,
      },
      {
        title: "Aksi",
        key: "actions",
        render: (_, record) => (
          <Space size="small">
            <Popconfirm
              title="Are you sure you want to edit this item?"
              onConfirm={() => onEdit(record)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Edit">
                <Button 
                  type="text" // Menggunakan tipe "text" untuk tampilan minimalis
                  icon={<EditOutlined />} 
                  size="small" 
                />
              </Tooltip>
            </Popconfirm>
            <Popconfirm
              title="Are you sure to delete this item?"
              onConfirm={() => onDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Hapus">
                <Button 
                  type="text" // Menggunakan tipe "text" untuk tampilan minimalis
                  icon={<DeleteOutlined />} 
                  size="small" 
                  danger // Warna merah untuk tombol hapus
                />
              </Tooltip>
            </Popconfirm>
          </Space>
        ),
      },
      {
        title: "Unduh File",
        key: "download",
        render: (_, record) => (
          <Tooltip title="Unduh">
            <Button 
              type="text" // Menggunakan tipe "text" untuk tampilan minimalis
              icon={<DownloadOutlined />} 
              size="small" 
              onClick={() => onDownload(record)} 
            />
          </Tooltip>
        ),
      },
    ];
  }, [onEdit, onDelete, onDownload]);

  return (
    <Table
      dataSource={fileList}
      columns={columns}
      pagination={false}
    />
  );
};

export default BeritaTable;