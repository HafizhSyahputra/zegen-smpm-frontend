import { getBrand, getBrandType } from "@smpm/services/edcService";  
import { useQuery } from "@tanstack/react-query";  
import { Col, Form, Input, Row, Select } from "antd";  
import { useState } from "react";  

export type FormFieldReceivedOutEDCProps = {  
    isRequired: boolean;  
    status?: string;  
    brand?: string;  
    brand_type?: string;  
    serial_number?: string;  
    notes?: string;  
    action?: string;  
};  

const FormFieldReceivedOutEDC: React.FC<FormFieldReceivedOutEDCProps> = ({  
    isRequired,  
    status,  
    brand,  
    brand_type,  
    serial_number,  
    notes,  
    action,  
}) => {  
    const [selectedBrand, setSelectedBrand] = useState(brand || "");  

    const { data: brandData, isLoading: isLoadingBrand } = useQuery({  
        queryKey: ["select-brand"],  
        queryFn: () => getBrand(),  
    });  

    const { data: brandType, isLoading: _isLoadingBrandType } = useQuery({  
        queryKey: ["select-brand-type", selectedBrand],  
        queryFn: () => getBrandType({ brand: selectedBrand }),  
    });  

    return (  
        <Row gutter={16}>  
            <Col xs={24} md={4}>  
                <Form.Item  
                    label={"Merk EDC"}  
                    name={"edc_second_brand"}  
                    initialValue={brand}  
                    rules={[{ required: isRequired, message: "Dibutuhkan" }]}  
                >  
                    {status === "done" ? (  
                        <Input value={brand} readOnly />  
                    ) : (  
                        <Select  
                            loading={isLoadingBrand}  
                            virtual={true}  
                            allowClear  
                            onChange={(value) => {  
                                setSelectedBrand(value ?? "");  
                            }}  
                        >  
                            {brandData?.result.map((item: any) => (  
                                <Select.Option key={item.brand} value={item.brand}>  
                                    {item.brand}  
                                </Select.Option>  
                            ))}  
                        </Select>  
                    )}  
                </Form.Item>  
            </Col>  
            <Col xs={24} md={4}>  
                <Form.Item  
                    label={"Tipe EDC"}  
                    name={"edc_second_brand_type"}  
                    initialValue={brand_type}  
                    rules={[{ required: isRequired, message: "Dibutuhkan" }]}  
                >  
                    {status === "done" ? (  
                        <Input value={brand_type} readOnly />  
                    ) : (  
                        <Select loading={isLoadingBrand} virtual={true} allowClear>  
                            {brandType?.result.map((item: any) => (  
                                <Select.Option key={item.type} value={item.type}>  
                                    {item.type}  
                                </Select.Option>  
                            ))}  
                        </Select>  
                    )}  
                </Form.Item>  
            </Col>  
            <Col xs={24} md={4}>  
                <Form.Item  
                    label={"Serial Number"}  
                    name={"edc_second_serial_number"}  
                    initialValue={serial_number}  
                    rules={[{ required: isRequired, message: "Dibutuhkan" }]}  
                >  
                    <Input defaultValue={serial_number} readOnly={status === "done"} />  
                </Form.Item>  
            </Col>  
            <Col xs={24} md={4}>  
                <Form.Item label={"Notes"} name={"edc_second_note"} initialValue={notes}>  
                    <Input readOnly={status === "done"} defaultValue={notes} />  
                </Form.Item>  
            </Col>  
            <Col xs={24} md={4}>  
                <Form.Item label={"Action"} name={"edc_second_action"} initialValue={action}>  
                    <Input readOnly={status === "done"} defaultValue={action} />  
                </Form.Item>  
            </Col>  
        </Row>  
    );  
};  

export default FormFieldReceivedOutEDC;