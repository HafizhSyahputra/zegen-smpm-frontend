import { Button, Form, Space, Input, Table, Select, message, Modal } from "antd";  
import React, { useState, useEffect } from "react";  
import { uploadNominal, getNominal, update } from "@smpm/services/nominalService";  
import { AxiosError } from "axios";  
import { IFormInputNominal, IUpdateInputNominal } from "@smpm/models/nominalModel";  
import { formatPrice } from "@smpm/utils/priceUtils";  

const { Option } = Select;  

const FormImportNominal: React.FC = () => {  
  const [form] = Form.useForm();  
  const [dataSource, setDataSource] = useState<IFormInputNominal[]>([]);  
  const [isLoading, setIsLoading] = useState<boolean>(false);  
  const [isModalVisible, setIsModalVisible] = useState(false);  
  const [updatingEntry, setUpdatingEntry] = useState<IFormInputNominal | null>(null);  
  const [updatingNominal, setUpdatingNominal] = useState<number | null>(null);  
  const [updatingTipe, setUpdatingTipe] = useState<string | null>(null);  

  useEffect(() => {  
    fetchNominalData();  
  }, []);  

  const fetchNominalData = async () => {  
    setIsLoading(true);  
    try {  
      const response = await getNominal({  
        order: 'asc',  
        order_by: 'nominal',  
        page: 1,  
        take: 10,  
      });  
      setDataSource(response.result.data);  
    } catch (error) {  
      console.error('Error fetching nominal data:', error);  
    } finally {  
      setIsLoading(false);  
    }  
  };  

  const handleFinish = async (values: any) => {  
    const newEntry = {  
      nominal: values.harga || "",  
      jenis: values.jenisJobOrder || "",  
      tipe: values.tipe || "",  
    };  
  
    if (!newEntry.nominal || !newEntry.jenis || !newEntry.tipe) {  
      message.error("Pastikan semua field diisi dengan benar!");  
      return;  
    }  
  
     const existingEntry = dataSource.find((entry) => entry.jenis === newEntry.jenis);  
    if (existingEntry) {  
       setUpdatingEntry(existingEntry);  
      setUpdatingNominal(newEntry.nominal);  
      setUpdatingTipe(newEntry.tipe);  
      setIsModalVisible(true);  
      return;  
    }  
  
    try {  
      await uploadNominal(newEntry);  
      message.success("Data berhasil diupload");  
      form.resetFields();  
      fetchNominalData();  
    } catch (error) {  
      const axiosError = error as AxiosError;  
      if (axiosError.response && axiosError.response.data) {  
        const errorResponse = axiosError.response.data as {  
          status: { code: number; description: string };  
          result: { errors: { [key: string]: string[] } };  
        };  
  
        if (errorResponse.status.code === 422) {  
          const errors = errorResponse.result.errors;  
          if (errors) {  
            const errorMessages = Object.values(errors).flat().join(", ");  
            message.error(`Gagal mengupload data: ${errorMessages}`);  
          } else {  
            message.error("Gagal mengupload data: Response error");  
          }  
        } else {  
          message.error("Gagal mengupload data");  
        }  
      } else {  
        message.error("Gagal mengupload data");  
      }  
    }  
  };

  const handleUpdateConfirm = async () => {  
    if (updatingEntry && updatingNominal !== null && updatingTipe !== null) {  
      try {  
        const payload: Partial<IUpdateInputNominal> = {  
          nominal: updatingNominal,  
          tipe: updatingTipe,  
        };  
  
         if (updatingEntry.jenis !== updatingEntry.jenis) {  
          payload.jenis = updatingEntry.jenis;  
        }  
  
        await update(updatingEntry.id, payload);  
        message.success("Data berhasil diperbarui");  
        setIsModalVisible(false);  
        setUpdatingEntry(null);  
        setUpdatingNominal(null);  
        setUpdatingTipe(null);  
        fetchNominalData();  
      } catch (error) {  
        const axiosError = error as AxiosError;  
        if (axiosError.response && axiosError.response.data) {  
          const errorResponse = axiosError.response.data as {  
            status: { code: number; description: string };  
            result: { errors: { [key: string]: string[] } };  
          };  
  
          if (errorResponse.status.code === 422) {  
            const errors = errorResponse.result.errors;  
            if (errors) {  
              const errorMessages = Object.values(errors).flat().join(", ");  
              message.error(`Gagal mengupdate data: ${errorMessages}`);  
            } else {  
              message.error("Gagal mengupdate data: Response error");  
            }  
          } else {  
            message.error("Gagal mengupdate data");  
          }  
        } else {  
          message.error("Gagal mengupdate data");  
        }  
      }  
    }  
  };

  const handleCancel = () => {  
    setIsModalVisible(false);  
    setUpdatingEntry(null);  
    setUpdatingNominal(null);  
    setUpdatingTipe(null);  
  };  

  const columns = [  
    {  
      title: "No",  
      dataIndex: "index",  
      key: "index",  
      render: (_: any, _record: any, index: number) => index + 1,  
    },  
    {  
      title: "Nominal",  
      dataIndex: "nominal",  
      key: "nominal",  
      render: (value: number) => formatPrice(value),  
    },  
    {  
      title: "Jenis",  
      dataIndex: "jenis",  
      key: "jenis",  
    },  
    {  
      title: "Tipe",  
      dataIndex: "tipe",  
      key: "tipe",  
    },  
  ];  

  return (  
    <div>  
      <Form form={form} layout="vertical" onFinish={handleFinish}>  
        <Space direction="vertical" className="w-full">  
          <p className="font-semibold text-lg">Input Nominal Job Order</p>  
          <Form.Item  
            name="jenisJobOrder"  
            label="Jenis Job Order"  
            rules={[  
              { required: true, message: "Jenis job order tidak boleh kosong" },  
            ]}  
          >  
            <Select placeholder="Pilih jenis job order">  
              <Option value="New Installation">New Installation</Option>  
              <Option value="Withdrawal">Withdrawal</Option>  
              <Option value="CM Replace">CM Replace</Option>  
              <Option value="CM Re-init">CM Re-init</Option>  
              <Option value="Preventive Maintenance">Preventive Maintenance</Option>  
            </Select>  
          </Form.Item>  
          <Form.Item  
            name="harga"  
            label="Nominal"  
            rules={[  
              { required: true, message: "Nominal tidak boleh kosong" },  
            ]}  
          >  
            <Input placeholder="Masukkan nominal" />  
          </Form.Item>  
          <Form.Item  
            name="tipe"  
            label="Tipe"  
            rules={[  
              { required: true, message: "Tipe tidak boleh kosong" },  
            ]}  
          >  
            <Select placeholder="Pilih tipe">  
              <Option value="Unit">Unit</Option>  
              <Option value="Month">Month</Option>  
              <Option value="Year">Year</Option>  
            </Select>  
          </Form.Item>  
          <Form.Item>  
            <Space>  
              <Button type="primary" htmlType="submit" loading={isLoading}>  
                Tambah  
              </Button>  
            </Space>  
          </Form.Item>  
        </Space>  
      </Form>  

      <Table  
        dataSource={dataSource}  
        columns={columns}  
        rowKey={(record) => `${record.nominal}-${record.jenis}`}  
        pagination={false}  
      />  

      <Modal  
        title="Konfirmasi Update"  
        visible={isModalVisible}  
        onOk={handleUpdateConfirm}  
        onCancel={handleCancel}  
      >  
        <p>  
          Data dengan Jenis "{updatingEntry?.jenis}" sudah ada. Apakah Anda ingin  
          memperbarui Nominal menjadi {formatPrice(updatingNominal || 0)} dan Tipe  
          menjadi "{updatingTipe}"?  
        </p>  
      </Modal>  
    </div>  
  );  
};  

export default FormImportNominal;