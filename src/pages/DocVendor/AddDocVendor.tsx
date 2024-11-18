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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllVendor } from "@smpm/services/vendorService";  
import { IVendorModel } from "@smpm/models/vendorModel";  

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
  const [selectedJobOrder, setSelectedJobOrder] = useState<string | null>(null);  
  const [fileDoc1, setFileDoc1] = useState<File | null>(null);  
  const [fileDoc2, setFileDoc2] = useState<File | null>(null);  
  const navigate = useNavigate();  
  const queryClient = useQueryClient();
  const [vendors, setVendors] = useState<IVendorModel[]>([]);  
  const [vendorsLoading, setVendorsLoading] = useState(false); 
  const [agreementNumber, setAgreementNumber] = useState('');  
  const [agreementYear, setAgreementYear] = useState('');    

  const { data: jobOrdersData, isLoading: jobOrdersLoading } = useQuery({  
    queryKey: ['jobOrders'],  
    queryFn: async () => {  
      const response = await getAllJO();  
      return response.result.filter((jobOrder: { status: string; }) =>   
        jobOrder.status === 'Done'  
      );  
    },  
  });  

  const handleAgreementNumberChange = (value: string) => {  
    // Hanya izinkan angka  
    const numberOnly = value.replace(/[^0-9]/g, '');  
    setAgreementNumber(numberOnly);  
    
    // Update form value dengan format lengkap  
    const fullNumber = `${numberOnly}/SPKS/PW/${agreementYear || ''}`;  
    form.setFieldValue('agreement_number', fullNumber);  
  };  
  
  const handleAgreementYearChange = (value: string) => {  
    // Hanya izinkan angka  
    const numberOnly = value.replace(/[^0-9]/g, '');  
    setAgreementYear(numberOnly);  
    
    // Update form value dengan format lengkap  
    const fullNumber = `${agreementNumber || ''}/SPKS/PW/${numberOnly}`;  
    form.setFieldValue('agreement_number', fullNumber);  
  };  
  

  const { data: jobOrderDetails, isLoading: detailsLoading } = useQuery({  
    queryKey: ['jobOrderDetails', selectedJobOrder],  
    queryFn: () => getJobOrderDetails(selectedJobOrder as string),  
    enabled: !!selectedJobOrder,  
    onSuccess: (data : any) => {  
      let edc_brand = '';  
      let edc_type = '';  

      if (data.result?.PreventiveMaintenanceReport.length > 0) {  
        edc_brand = data.result.PreventiveMaintenanceReport[0].edc_brand || '';  
        edc_type = data.result.PreventiveMaintenanceReport[0].edc_brand_type || '';  
      } else {  
        edc_brand = data.result.JobOrderReport[0]?.edc_brand || '';  
        edc_type = data.result.JobOrderReport[0]?.edc_brand_type || '';  
      }  

      form.setFieldsValue({  
        edc_brand,  
        type: data.result.type || '',  
        edc_type,  
        vendor_name: data.result.vendor?.name || '',  
      });  
    },  
  });  const createDocMutation = useMutation({  
    mutationFn: async (values: any) => {  
      const {   
        vendor_name,   
        vendor_agreement_date,  
        agreement_number   
      } = values;  
  
      const formattedDate = vendor_agreement_date.toISOString();  
  
      return await createDocumentVendor(  
        vendor_name,  
        formattedDate,  
        agreement_number,  
        fileDoc1,  
        fileDoc2  
      );  
    },   
    onSuccess: async () => {  
      notification.success({  
        message: 'Success',  
        description: 'Document Vendor added successfully!',  
      });  
  
      // Invalidate dan refetch data  
      await queryClient.invalidateQueries({   
        queryKey: ['documentVendors']   
      });  
      
      // Force refetch  
      await queryClient.refetchQueries({   
        queryKey: ['documentVendors'],  
        type: 'active'  
      });  
  
      // Reset form  
      form.resetFields();  
      setFileDoc1(null);  
      setFileDoc2(null);  
      setSelectedJobOrder(jobOrdersData?.[0]?.no || null);  
      
      // Navigate back  
      navigate(-1);  
    },  
    onError: (error) => {  
      notification.error({  
        message: 'Error',  
        description: 'Failed to add Document Vendor.',  
      });  
      console.error('Error in mutation:', error);  
    },  
  });

  const handleJobOrderChange = (value: string | null) => {  
    setSelectedJobOrder(value);  
  };  

  useEffect(() => {  
    const fetchVendors = async () => {  
      setVendorsLoading(true);  
      try {  
        const response = await getAllVendor();  
        setVendors(response.result);  
      } catch (error) {  
        console.error('Error fetching vendors:', error);  
      } finally {  
        setVendorsLoading(false);  
      }  
    };  

    fetchVendors();  
  }, []);  

  const onFinish = async (values: any) => {  
    if (!fileDoc1) {  
      notification.error({  
        message: 'Error',  
        description: 'File Dokumen PKS is required.',  
      });  
      return;  
    }  
  
    // Format nomor perjanjian  
    const formattedAgreementNumber = `${agreementNumber}/SPKS/PW/${agreementYear}`;  
    values.agreement_number = formattedAgreementNumber;  
  
    createDocMutation.mutate(values);  
  };

  const loading = jobOrdersLoading || detailsLoading || createDocMutation.isPending;  return (  
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
                    <FileAddOutlined className='mb-1' />  
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
              name="vendor_name"  
              label="Nama Vendor"  
              rules={[{ required: true, message: 'Please select a vendor' }]}  
            >  
              <Select  
                loading={vendorsLoading}  
                placeholder="Pilih Vendor"  
                optionFilterProp="children"  
                showSearch  
                filterOption={(input, option) =>  
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())  
                }  
                options={vendors.map((vendor) => ({  
                  value: vendor.name, // Using name as value since your form expects vendor_name  
                  label: vendor.name  
                }))}  
                className={`${form.getFieldValue('vendor_name') ? 'text-black' : 'text-gray-500'}`}  
              />  
            </Form.Item> 

            <Form.Item  
              name="vendor_agreement_date"  
              label="Tanggal Perjanjian Kerja Sama"  
              rules={[{ required: true, message: 'Please enter the vendor agreement date' }]}  
            >  
              <DatePicker className='w-full h-[2.03rem]' />  
            </Form.Item>   

            <Form.Item  
              name="agreement_number"  
              label="Nomor Perjanjian Kerja Sama"  
              rules={[  
                { required: true, message: 'Please enter the agreement number' },  
                () => ({  
                  validator(_, value) {  
                    if (!agreementNumber) {  
                      return Promise.reject('Please enter agreement number');  
                    }  
                    if (!agreementYear) {  
                      return Promise.reject('Please enter agreement year');  
                    }  
                    return Promise.resolve();  
                  },  
                }),  
              ]}  
            >  
              <div   
                style={{  
                  border: '1px solid #d9d9d9',  
                  borderRadius: '6px',  
                  padding: 0,  
                  transition: 'all 0.3s',  
                  overflow: 'hidden', // Tambahkan ini  
                }}  
                className="hover:border-[#4096ff] focus-within:border-[#4096ff] focus-within:shadow-[0_0_0_2px_rgba(5,145,255,0.1)]"  
              >  
                <div   
                  className="flex relative w-full"  
                  style={{   
                    height: '32px',  
                  }}  
                >  
                  <Input  
                    style={{   
                      boxShadow: 'none',  
                      border: 'none',  
                      borderRadius: 0,  
                      borderRight: 'none',  
                    }}  
                    className="w-[50px]"  
                    placeholder="045"  
                    value={agreementNumber}  
                    onChange={(e) => handleAgreementNumberChange(e.target.value)}  
                    maxLength={3}  
                  />  
                  <div   
                    className="flex items-center text-gray-500 select-none" 
                  >  
                    /SPKS/PW/  
                  </div>  
                  <Input  
                    style={{   
                      boxShadow: 'none',  
                      border: 'none',  
                      borderRadius: 0,  
                      borderLeft: 'none',  
                    }}  
                    className="w-20"  
                    placeholder="2024"  
                    value={agreementYear}  
                    onChange={(e) => handleAgreementYearChange(e.target.value)}  
                    maxLength={4}  
                  />  
                </div>  
              </div>  
            </Form.Item>

            <div className="invisible">  
              {/* Spacer div untuk menjaga alignment */}  
            </div>  

            <Form.Item   
              label="File Dokumen PKS"   
              required  
              className="mb-6"  
            >  
              <Dragger  
                name="file1"  
                multiple={false}  
                showUploadList={true}  
                beforeUpload={(file) => {  
                  setFileDoc1(file);  
                  return false;  
                }}  
              >  
                <p className="ant-upload-drag-icon">  
                  <InboxOutlined />  
                </p>  
                <p className="ant-upload-text">Click or drag file to this area to upload</p>  
                <p className="ant-upload-hint">Word, PDF, JPEG, PNG (Max 6 mb)</p>  
              </Dragger>  
            </Form.Item>  

            <Form.Item   
              label="File Dokumen Optional"  
              className="mb-6"  
            >  
              <Dragger  
                name="file2"  
                multiple={false}  
                showUploadList={true}  
                beforeUpload={(file) => {  
                  setFileDoc2(file);  
                  return false;  
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
                loading={createDocMutation.isPending}  
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