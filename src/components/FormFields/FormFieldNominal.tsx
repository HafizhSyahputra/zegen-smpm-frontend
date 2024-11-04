import { Col, Form, Input, Row, Select } from "antd";  
import React, { useEffect, useState } from "react";  
import { getAllVendor } from "@smpm/services/vendorService";  
import { IVendorModel } from "@smpm/models/vendorModel";  
import { INominalModel } from "@smpm/models/nominalModel";  

interface IFormFieldNominal {  
  initialValues?: INominalModel;  
}  

const FormFieldNominal: React.FC<IFormFieldNominal> = ({ initialValues }) => {  
    const form = Form.useFormInstance();  
    const isEditMode = !!initialValues?.id;  
    const [vendors, setVendors] = useState<IVendorModel[]>([]);  
    const [loading, setLoading] = useState(false); 
    
// Data options untuk dropdown Jenis  
const jenisOptions = [  
  { value: 'New Installation', label: 'New Installation' },  
  { value: 'Withdrawal', label: 'Withdrawal' },  
  { value: 'CM Replace', label: 'CM Replace' },  
  { value: 'CM Re-init', label: 'CM Re-init' },  
  { value: 'Preventive Maintenance', label: 'Preventive Maintenance' },  
];  

// Data options untuk dropdown Tipe  
const tipeOptions = [  
  { value: 'Unit', label: 'Unit' },  
  { value: 'Month', label: 'Month' },  
  { value: 'Year', label: 'Year' },  
];  

useEffect(() => {  
    const fetchVendors = async () => {  
      setLoading(true);  
      try {  
        const response = await getAllVendor();  
        setVendors(response.result || []);  
      } catch (error) {  
        console.error('Error fetching vendors:', error);  
      } finally {  
        setLoading(false);  
      }  
    };  

    fetchVendors();  
  }, []);   

  useEffect(() => {  
    const fetchVendors = async () => {  
      setLoading(true);  
      try {  
        const response = await getAllVendor();  
        setVendors(response.result);  
      } catch (error) {  
        console.error('Error fetching vendors:', error);  
      } finally {  
        setLoading(false);  
      }  
    };  

    fetchVendors();  
  }, []);  

  useEffect(() => {  
    if (initialValues) {  
      for (const [key, value] of Object.entries(initialValues)) {  
        form.setFieldValue(key as keyof INominalModel, value);  
      }  
    }  
  }, [initialValues]);  

  return (  
    <>  
      {isEditMode && (  
        <Row>  
          <Col span={24}>  
            <Form.Item  
              label="ID"  
              name="id"  
            >  
              <Input disabled />  
            </Form.Item>  
          </Col>  
        </Row>  
      )}  
      <Row gutter={16}>  
        <Col span={12}>  
          <Row gutter={[16, 16]}>  
            <Col span={24}>  
              <Form.Item  
                label="Nominal"  
                name="nominal"  
                rules={[  
                  {  
                    required: true,  
                    message: "Dibutuhkan",  
                  },  
                ]}  
              >  
                <Input />  
              </Form.Item>  
            </Col>  
            <Col span={24}>  
              <Form.Item  
                label="Vendor"  
                name="vendor_id"  
                rules={[  
                  {  
                    required: true,  
                    message: "Dibutuhkan",  
                  },  
                ]}  
              >  
                <Select  
                  loading={loading}  
                  placeholder="Pilih Vendor"  
                  optionFilterProp="children"  
                  showSearch  
                  filterOption={(input, option) =>  
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())  
                  }  
                  options={vendors.map((vendor) => ({  
                    value: vendor.id,  
                    label: vendor.name  
                  }))}  
                />  
              </Form.Item>  
            </Col>  
          </Row>  
        </Col>  
        <Col span={12}>  
          <Row gutter={[16, 16]}>  
            <Col span={24}>  
              <Form.Item  
                label="Jenis"  
                name="jenis"  
                labelAlign="right"  
                rules={[  
                  {  
                    required: true,  
                    message: "Dibutuhkan",  
                  },  
                ]}  
              >  
                <Select  
                  placeholder="Pilih Jenis"  
                  optionFilterProp="children"  
                  showSearch  
                  filterOption={(input, option) =>  
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())  
                  }  
                  options={jenisOptions}  
                />  
              </Form.Item>  
            </Col>  
            <Col span={24}>  
              <Form.Item  
                label="Tipe"  
                name="tipe"  
                labelAlign="right"  
                rules={[  
                  {  
                    required: true,  
                    message: "Dibutuhkan",  
                  },  
                ]}  
              >  
                <Select  
                  placeholder="Pilih Tipe"  
                  optionFilterProp="children"  
                  showSearch  
                  filterOption={(input, option) =>  
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())  
                  }  
                  options={tipeOptions}  
                />  
              </Form.Item>  
            </Col>  
          </Row>  
        </Col>  
      </Row>  
    </>  
  );  
};  

export type ICreateNominalDTO = Omit<INominalModel, 'id'>;  
export default FormFieldNominal;