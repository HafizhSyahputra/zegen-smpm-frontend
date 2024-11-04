 import { getAllRegion } from "@smpm/services/regionService";  
import { IconMapPin2 } from "@tabler/icons-react";  
import { useQuery } from "@tanstack/react-query";  
import { Col, Form, Input, Row, Select } from "antd";  
import React, { useEffect } from "react";  

interface IFormFieldMerchant {  
  initialValues?: TFormFieldMerchant;  
}  

export type TFormFieldMerchant = {  
  id?: number;  
  region_id: { id: number };  
  mid: string;  
  name: string;  
  category: string;  
  customer_name: string;  
  telephone?: string;  
  pic: string;  
  phone1: string;  
  phone2?: string;  
  address1: string;  
  address2: string;  
  address3: string;  
  address4: string;  
  district?: string;  
  subdistrict?: string;  
  city?: string;  
  province?: string;  
  postal_code: string;  
};  

const FormFieldMerchant: React.FC<IFormFieldMerchant> = ({ initialValues }) => {  
  const form = Form.useFormInstance();  
  const isEditMode = !!initialValues?.id;  

  useEffect(() => {  
    if (initialValues) {  
      for (const [key, value] of Object.entries(initialValues)) {  
        form.setFieldValue(key as any, value);  
      }  
    }  
  }, [initialValues]);  

  const { data: region, isLoading: isLoadingRegion } = useQuery({  
    queryKey: ["select-region"],  
    queryFn: () => getAllRegion(),  
  });  

  return (  
    <>  
      <Row gutter={16}>  
        <Col xs={24} md={8}>  
          <Form.Item  
            label={"Region"}  
            name={["region_id", "id"]}  
            rules={[  
              {  
                required: true,  
                message: "Dibutuhkan",  
              },  
            ]}  
          >  
            <Select  
              className="w-full"  
              placeholder={  
                <div className="flex items-start gap-1 font-semibold">  
                  <IconMapPin2 size="1.2rem" />  
                  <span>Wilayah</span>  
                </div>  
              }  
              loading={isLoadingRegion}  
              virtual={true}  
            >  
              {region?.result.map((item) => (  
                <Select.Option value={item.id}>{item.name}</Select.Option>  
              ))}  
            </Select>  
          </Form.Item>  
        </Col>  
        <Col xs={24} md={8}>  
          <Form.Item  
            label={"MID"}  
            name={"mid"}  
            rules={[  
              {  
                required: !isEditMode,  
                message: "Dibutuhkan",  
              },  
            ]}  
          >  
            <Input disabled={isEditMode} />  
          </Form.Item>  
        </Col>  
        <Col xs={24} md={8}>  
          <Form.Item  
            label={"Merchant Name"}  
            name={"name"}  
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
      </Row>  
      <Row gutter={16}>  
        <Col xs={24} md={8}>  
          <Form.Item  
            label={"Category"}  
            name={"category"}  
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
        <Col xs={24} md={8}>  
          <Form.Item  
            label={"Customer Name"}  
            name={"customer_name"}  
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
        <Col xs={24} md={8}>  
          <Form.Item label={"Telephone"} name={"telephone"}>  
            <Input />  
          </Form.Item>  
        </Col>  
      </Row>  
      <Row gutter={16}>  
        <Col xs={24} md={8}>  
          <Form.Item  
            label={"PIC"}  
            name={"pic"}  
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
        <Col xs={24} md={8}>  
          <Form.Item  
            label={"Phone 1"}  
            name={"phone1"}  
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
        <Col xs={24} md={8}>  
          <Form.Item label={"Phone 2"} name={"phone2"}>  
            <Input />  
          </Form.Item>  
        </Col>  
      </Row>  
      <Row gutter={16}>  
        <Col xs={24} md={8}>  
          <Form.Item  
            label={"Address 1"}  
            name={"address1"}  
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
        <Col xs={24} md={8}>  
          <Form.Item label={"Address 2"} name={"address2"}>  
            <Input />  
          </Form.Item>  
        </Col>  
        <Col xs={24} md={8}>  
          <Form.Item label={"Address 3"} name={"address3"}>  
            <Input />  
          </Form.Item>  
        </Col>  
        <Col xs={24} md={8}>  
          <Form.Item label={"Address 4"} name={"address4"}>  
            <Input />  
          </Form.Item>  
        </Col>  
        <Col xs={24} md={8}>  
          <Form.Item label={"District"} name={"district"}>  
            <Input />  
          </Form.Item>  
        </Col>  
        <Col xs={24} md={8}>  
          <Form.Item label={"Sub District"} name={"subdistrict"}>  
            <Input />  
          </Form.Item>  
        </Col>  
      </Row>  
      <Row gutter={16}>  
        <Col xs={24} md={8}>  
          <Form.Item label={"City"} name={"city"}>  
            <Input />  
          </Form.Item>  
        </Col>  
        <Col xs={24} md={8}>  
          <Form.Item label={"Province"} name={"province"}>  
            <Input />  
          </Form.Item>  
        </Col>  
        <Col xs={24} md={8}>  
          <Form.Item label={"Postal Code"} name={"postal_code"}>  
            <Input />  
          </Form.Item>  
        </Col>  
      </Row>  
    </>  
  );  
};  

export default FormFieldMerchant;