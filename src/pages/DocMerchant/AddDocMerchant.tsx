import React, { useEffect, useRef, useState } from 'react';  
import { Card, Form, Button, Breadcrumb, notification, Select } from 'antd';  
import { FileAddOutlined, HomeOutlined, InboxOutlined } from '@ant-design/icons';  
import PageContent from '@smpm/components/PageContent';  
import PageLabel from '@smpm/components/pageLabel';  
import Page from '@smpm/components/pageTitle';  
import { getAllMerchant } from '@smpm/services/merchantService';  
import { createDocumentMerchant } from '@smpm/services/docmerchantService';  
import { IMerchantModel } from '@smpm/models/merchantModel';  
import Dragger from 'antd/es/upload/Dragger';  
import { useNavigate } from 'react-router-dom'; // Import useHistory  

const { Option } = Select;  

const AddNewDocumentVendor: React.FC = () => {  
  const [form] = Form.useForm();  
  const [merchants, setMerchants] = useState<IMerchantModel[]>([]);  
  const [filteredMerchants, setFilteredMerchants] = useState<IMerchantModel[]>([]);  
  const [address, setAddress] = useState<string>('');  
  const [latitude, setLatitude] = useState<string>('');  
  const [longitude, setLongitude] = useState<string>('');  
  const inputRef = useRef<HTMLInputElement | null>(null);  

  const [fileDoc1, setFileDoc1] = useState<File | null>(null);  
  const [fileDoc2, setFileDoc2] = useState<File | null>(null);  
  const navigate = useNavigate();

  useEffect(() => {  
    const fetchMerchants = async () => {  
      try {  
        const response = await getAllMerchant();  
        setMerchants(response);  
        setFilteredMerchants(response);  
      } catch (error) {  
        console.error('Error fetching merchants:', error);  
      }  
    };  
    fetchMerchants();  
  }, []);  

  const onFinish = async (values: any) => {  
    if (!fileDoc1) {  
      notification.error({  
        message: 'Error',  
        description: 'File Dokumen PKS is required.',  
        placement: 'topRight',  
      });  
      return;  
    }  

    try {  
       const response = await createDocumentMerchant(  
        values.merchant_name,    
        address,  
        latitude,  
        longitude,  
        fileDoc1,  
        fileDoc2  
      );  
  
      console.log('Document Merchant Created:', response);  
       navigate(-1);   
  
       form.resetFields();  
      setFileDoc1(null);  
      setFileDoc2(null);  
      setAddress('');  
      setLatitude('');  
      setLongitude('');  
    } catch (error: any) {  
      console.error('Error creating Document Merchant:', error);  
      notification.error({  
        message: 'Error',  
        description: 'There was an error creating the document merchant. Please try again.',  
        placement: 'topRight',  
      });  
    }  
  };  

  const handleMerchantChange = (_value: string) => {  
    // Optionally update any state based on the selected merchant here  
  };  

  const handleSearch = (value: string) => {  
    const filteredData = merchants.filter((merchant) =>  
      merchant.name.toLowerCase().includes(value.toLowerCase())  
    );  
    setFilteredMerchants(filteredData);  
  };  

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {  
    setAddress(event.target.value);  
  };  

  useEffect(() => {  
    const loadGoogleMapsScript = (callback: () => void) => {  
      const script = document.createElement('script');  
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC3np82jBuQ10QjCxwQtbNTZtSQ2aDgDOc&libraries=places`; // Replace with your API Key  
      script.async = true;  
      script.onload = callback;  
      document.body.appendChild(script);  
    };  

    loadGoogleMapsScript(() => {  
      if (inputRef.current) {  
        const autocomplete = new (window as any).google.maps.places.Autocomplete(inputRef.current);  
        autocomplete.addListener('place_changed', () => {  
          const place = autocomplete.getPlace();  
          if (place && place.formatted_address) {  
            setAddress(place.formatted_address);  
            setLatitude(place.geometry?.location?.lat().toString() || '');  
            setLongitude(place.geometry?.location?.lng().toString() || '');  
          }  
        });  
      }  
    });  
  }, []);  

  return (  
    <Page title={'Merchant'}>  
      <PageLabel  
        title={<span className="font-semibold text-2xl">Add Document Merchant</span>}  
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
                title: <div className="flex gap-1"><span>Document</span></div>,  
              },  
              {  
                href: '/document/DocMerchant',  
                title: <div className="flex gap-1"><span>Document Merchant</span></div>,  
              },  
              {  
                href: '#',  
                title: (  
                  <div className="flex gap-1">  
                    <FileAddOutlined />  
                    <span>Add Document Merchant</span>  
                  </div>  
                ),  
              },  
            ]}  
          />  
        }  
      />  
      <PageContent>  
        <Card title="Add New Document Vendor" className="w-full bg-white shadow-md rounded-lg">  
          <Form form={form} layout="vertical" onFinish={onFinish} className="grid grid-cols-1 md:grid-cols-2 gap-6">  
            <Form.Item name="merchant_name" label="Nama Merchant" rules={[{ required: true }]}>  
              <Select  
                showSearch  
                placeholder="Search merchant"  
                onSearch={handleSearch}  
                onChange={handleMerchantChange}  
                style={{ width: '100%' }}  
                className="h-10"  
              >  
                {filteredMerchants.map((merchant) => (  
                  <Option key={merchant.id} value={merchant.name}>  
                    {merchant.name}  
                  </Option>  
                ))}  
              </Select>  
            </Form.Item>  

            <Form.Item label="Lokasi" required>  
              <input  
                ref={inputRef}  
                onChange={handleInputChange}  
                placeholder="Search Places..."  
                className="border-solid border border-[#d9d9d9] h-10 w-full rounded-md px-3 py-[0.65rem] focus:outline-none"  
              />  
            </Form.Item>  

            <Form.Item label="File Dokumen PKS" required>  
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

            <Form.Item label="File Dokumen Optional">  
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

            <div className="col-span-1 md:col-span-2">  
              <Button  
                type="primary"  
                htmlType="submit"  
                className="bg-cyan-800 hover:bg-cyan-700 text-white font-medium py-2 px-6 rounded"  
              >  
                Submit  
              </Button>  
            </div>  
          </Form>  
        </Card>  
      </PageContent>  
    </Page>  
  );  
};  

export default AddNewDocumentVendor;