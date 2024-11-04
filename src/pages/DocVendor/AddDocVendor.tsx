import React, { useState, useEffect } from 'react';  
import { Card, Form, Button, Breadcrumb, Select, Input, DatePicker, notification, Spin } from 'antd';  
import { FileAddOutlined, HomeOutlined, InboxOutlined } from '@ant-design/icons';  
import PageContent from '@smpm/components/PageContent';  
import PageLabel from '@smpm/components/pageLabel';  
import Page from '@smpm/components/pageTitle';  
import { Document } from '@smpm/models/jobOrderModel';  
import Dragger from 'antd/es/upload/Dragger';  
import { getAllJO, getJobOrderDetails } from '@smpm/services/jobOrderService';  
import { createDocumentVendor } from '@smpm/services/docvendorService';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;  

const FileIcon = () => (  
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-file">  
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />  
    <path d="M14 3v4a1 1 0 0 0 1 1h4" />  
    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />  
  </svg>  
);  

const AddNewDocumentVendor: React.FC = () => {  
  const [form] = Form.useForm();  
  const [jobOrders, setJobOrders] = useState<Document[]>([]);  
  const [selectedJobOrder, setSelectedJobOrder] = useState<string | null>(null);  
  const [fileDoc1, setFileDoc1] = useState<File | null>(null);  
  const [fileDoc2, setFileDoc2] = useState<File | null>(null);  
  const [loading, setLoading] = useState(false);  
  const navigate = useNavigate();
  useEffect(() => {  
    const fetchJobOrders = async () => {  
      try {  
        const response = await getAllJO();  
         const doneJobOrders = response.result.filter((jobOrder: { status: string; }) => jobOrder.status === 'Done');  
        setJobOrders(doneJobOrders);  
        setSelectedJobOrder(doneJobOrders[0]?.no);  
      } catch (error) {  
        console.error('Error fetching job orders:', error);  
      }  
    };  
    fetchJobOrders();  
  }, []);  
  useEffect(() => {  
    const fetchJobOrderDetails = async () => {  
      if (selectedJobOrder) {  
        setLoading(true);  
        try {  
          const response = await getJobOrderDetails(selectedJobOrder);  
          let edc_brand = '';  
          let edc_type = '';  

           if (response.result?.PreventiveMaintenanceReport.length > 0) {  
            edc_brand = response.result.PreventiveMaintenanceReport[0].edc_brand || '';  
            edc_type = response.result.PreventiveMaintenanceReport[0].edc_brand_type || '';  
          } else {  
            edc_brand = response.result.JobOrderReport[0]?.edc_brand || '';  
            edc_type = response.result.JobOrderReport[0]?.edc_brand_type || '';  
          }  

          form.setFieldsValue({  
            edc_brand,  
            type: response.result.type || '',  
            edc_type,  
            vendor_name: response.result.vendor?.name || '',  
          });  
        } catch (error) {  
          console.error('Error fetching job order details:', error);  
        } finally {  
          setLoading(false);  
        }  
      }  
    };  
    fetchJobOrderDetails();  
  }, [selectedJobOrder, form]);  

  const handleJobOrderChange = (value: string | null) => {  
    setSelectedJobOrder(value);  
  };  

  const onFinish = async (values: any) => {  
    const { edc_brand, type, edc_type, vendor_name, vendor_agreement_date } = values;  

     const formattedDate = vendor_agreement_date.toISOString();  

     if (!fileDoc1) {  
        notification.error({  
            message: 'Error',  
            description: 'File Dokumen PKS is required.',  
        });  
        return;  
    }  

    try {  
        setLoading(true);  

        await createDocumentVendor(  
            selectedJobOrder as string,  
            edc_brand,  
            edc_type,  
            type,  
            vendor_name,  
            formattedDate, 
            fileDoc1,  
            fileDoc2  
        );  

        notification.success({  
            message: 'Success',  
            description: 'Document Vendor added successfully!',  
        });  

        form.resetFields();  
        setFileDoc1(null);  
        setFileDoc2(null);  
        setSelectedJobOrder(jobOrders[0]?.no || null);  
        navigate(-1);
    } catch (error) {  
        notification.error({  
            message: 'Error',  
            description: 'Failed to add Document Vendor.',  
        });  
        console.error('Error in onFinish:', error);  
    } finally {  
        setLoading(false);  
    }  
};

  return (  
    <Page title={'Merchant'}>  
      <PageLabel  
        title={<span className="font-semibold text-2xl">Add Document Vendor</span>}  
        subtitle={  
          <Breadcrumb  
            items={[  
              {  
                href: '/dashboard',  
                title: (  
                  <>  
                    <HomeOutlined />  
                    <span>Home</span>  
                  </>  
                ),  
              },  
              {  
                href: '#',  
                title: (  
                  <div className="flex gap-1">  
                    <FileIcon />  
                    <span>Document</span>  
                  </div>  
                ),  
              },  
              {  
                href: '/document/DocVendor',  
                title: (  
                  <div className="flex gap-1">  
                    <FileIcon />  
                    <span>Document Vendor</span>  
                  </div>  
                ),  
              },  
              {  
                href: '#',  
                title: (  
                  <div className="flex gap-1">  
                    <FileAddOutlined />  
                    <span>Add Document Vendor</span>  
                  </div>  
                ),  
              },  
            ]}  
          />  
        }  
      />  
      <PageContent>  
        <Card  
          title="Add New Document Vendor"  
          className="w-full bg-white shadow-md rounded-lg"  
        >  
          {loading ? (  
            <div className="flex justify-center items-center h-64">  
              <Spin size="large" />  
            </div>  
          ) : (  
            <Form  
              form={form}  
              layout="vertical"  
              onFinish={onFinish}  
              className="grid grid-cols-1 md:grid-cols-2 gap-6"  
            >  
              <Form.Item  
                name="job_order_no"  
                label="No Job Order"  
                rules={[{ required: true, message: 'Please select a job order' }]}  
              >  
                <Select  
                  placeholder="Select job order"  
                  onChange={handleJobOrderChange}  
                  value={selectedJobOrder}  
                >  
                  <Option value={null} disabled>Select No Job Order</Option>  
                  {jobOrders && jobOrders.map((jobOrder) => (  
                    <Option key={jobOrder.no} value={jobOrder.no}>  
                      {jobOrder.no}  
                    </Option>  
                  ))}  
                </Select>  
              </Form.Item>  

              <Form.Item  
                name="edc_brand"  
                label="Merk Edc"  
                rules={[{ required: true, message: 'Please enter the EDC brand' }]}  
              >  
                <Input  
                  className={`bg-gray-100 ${form.getFieldValue('edc_brand') ? 'text-black' : 'text-gray-500'}`}  
                  readOnly  
                />  
              </Form.Item>  

              <Form.Item  
                name="type"  
                label="Jenis Job Order"  
                rules={[{ required: true, message: 'Please enter the job order type' }]}  
              >  
                <Input  
                  className={`bg-gray-100 ${form.getFieldValue('type') ? 'text-black' : 'text-gray-500'}`}  
                  readOnly  
                />  
              </Form.Item>  

              <Form.Item  
                name="edc_type"  
                label="Tipe Edc"  
                rules={[{ required: true, message: 'Please enter the EDC type' }]}  
              >  
                <Input  
                  className={`bg-gray-100 ${form.getFieldValue('edc_type') ? 'text-black' : 'text-gray-500'}`}  
                  readOnly  
                />  
              </Form.Item>  

              <Form.Item  
                name="vendor_name"  
                label="Nama Vendor"  
                rules={[{ required: true, message: 'Please enter the vendor name' }]}  
              >  
                <Input  
                  className={`bg-gray-100 ${form.getFieldValue('vendor_name') ? 'text-black' : 'text-gray-500'}`}  
                  readOnly  
                />  
              </Form.Item>  

              <Form.Item  
                name="vendor_agreement_date"  
                label="Tanggal Perjanjian Kerja Sama"  
                rules={[{ required: true, message: 'Please enter the vendor agreement date' }]}  
              >  
                <DatePicker className='w-full h-[2.03rem]' />  
              </Form.Item>  

              <Form.Item label="File Dokumen PKS" required>  
                <Dragger  
                  name="file1"  
                  multiple={false}  
                  showUploadList={true}  
                  beforeUpload={(file) => {  
                    setFileDoc1(file);  
                    return false; // Prevent upload  
                  }}  
                >  
                  <p className="ant-upload-drag-icon">  
                    <InboxOutlined />  
                  </p>  
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>  
                  <p className="ant-upload-hint">Word, PDF, JPEG, PNG (Max 6 mb)</p>  
                </Dragger>  
              </Form.Item>  

              <Form.Item label="File Dokumen Optional">  
                <Dragger  
                  name="file2"  
                  multiple={false}  
                  showUploadList={true}  
                  beforeUpload={(file) => {  
                    setFileDoc2(file);  
                    return false; // Prevent upload  
                  }}  
                >  
                  <p className="ant-upload-drag-icon">  
                    <InboxOutlined />  
                  </p>  
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>  
                  <p className="ant-upload-hint">Word, PDF, JPEG, PNG (Max 6 mb)</p>  
                </Dragger>  
              </Form.Item>  

              <div className="col-span-1 md:col-span-2 mt-4">  
                <Button  
                  type="primary"  
                  htmlType="submit"  
                  className="bg-cyan-800 hover:bg-cyan-700 text-white font-medium py-2 px-6 rounded"  
                >  
                  Submit  
                </Button>  
              </div>  
            </Form>  
          )}  
        </Card>  
      </PageContent>  
    </Page>  
  );  
};  

export default AddNewDocumentVendor;