import {  
  Button,  
  Col,  
  Divider,  
  Flex,  
  Row,  
  Select,  
  Typography,  
  message,  
} from "antd";  
import { Option } from "antd/es/mentions";  
import React, { useState } from "react";    
import { downloadPreventiveSLA } from "@smpm/services/pmReportService";  

export type TOptions = {  
  label: string;  
  value: any;  
};  

interface IFilterTable {  
  handleChangeFilterStatus: (key: string) => void;  
  valueStatus: string;  
  optionStatus: TOptions[];  

  handleChangeFilterWilayah: (key: string) => void;  
  valueWilayah: string;  
  optionWilayah: TOptions[];  

  handleChangeFilterVendor: (key: string) => void;  
  valueVendor: string;  
  optionVendor: TOptions[];  

  handleChangeFilterMerchant: (key: string) => void;  
  valueMerchant: string;  
  optionMerchant: TOptions[];  
  hasDownloadReportOrder?: boolean;  
  isInventoryReport?: boolean;  
}  

const FilterTable: React.FC<IFilterTable> = ({  
  handleChangeFilterStatus,  
  valueStatus,  
  optionStatus,  
  handleChangeFilterWilayah,  
  valueWilayah,  
  optionWilayah,  
  handleChangeFilterVendor,  
  valueVendor,  
  optionVendor,  
  handleChangeFilterMerchant,  
  valueMerchant,  
  optionMerchant,  
  isInventoryReport = false,  
}) => {  
  const { Title } = Typography;  
  
  const [isDownloadingPreventiveSLA, setIsDownloadingPreventiveSLA] = useState(false);  

  const handleDownloadPreventiveSLA = async () => {  
    try {  
      setIsDownloadingPreventiveSLA(true);  
      
      await downloadPreventiveSLA();  
      
      message.success('Preventive Maintenance SLA data downloaded successfully');  
    } catch (error) {  
      console.error('Error downloading Preventive Maintenance SLA:', error);  
      message.error('Failed to download Preventive Maintenance SLA data');  
    } finally {  
      setIsDownloadingPreventiveSLA(false);  
    }  
  };  

  return (  
    <>  
      <Row gutter={12} align={"top"} justify={"space-between"} className="mt-6">  
        <Col xs={24} md={16}>  
          <Row justify="start" className="my-4" gutter={12}>  
            <Col xs={24} md={6}>  
              <Select  
                allowClear  
                mode={"multiple"}  
                onChange={handleChangeFilterStatus}  
                value={valueStatus}  
                className="w-full mb-5"  
                placeholder="Status"  
              >  
                {optionStatus.map((val) => (  
                  <Option key={val.value} value={val.value}>{val.label}</Option>  
                ))}  
              </Select>  
            </Col>  
            <Col xs={24} md={6}>  
              <Select  
                onChange={handleChangeFilterWilayah}  
                value={valueWilayah}  
                className="w-full mb-5"  
                placeholder="Wilayah"  
              >  
                {optionWilayah.map((val) => (  
                  <Option key={val.value} value={val.value}>{val.label}</Option>  
                ))}  
              </Select>  
            </Col>  
            <Col xs={24} md={6}>  
              <Select  
                onChange={handleChangeFilterVendor}  
                value={valueVendor}  
                className="w-full mb-5"  
                placeholder="Vendor"  
              >  
                {optionVendor.map((val) => (  
                  <Option key={val.value} value={val.value}>{val.label}</Option>  
                ))}  
              </Select>  
            </Col>  
            <Col xs={24} md={6}>  
              <Select  
                onChange={handleChangeFilterMerchant}  
                value={valueMerchant}  
                className="w-full mb-5"  
                placeholder="Merchant"  
              >  
                {optionMerchant.map((val) => (  
                  <Option key={val.value} value={val.value}>{val.label}</Option>  
                ))}  
              </Select>  
            </Col>  
          </Row>  
        </Col>  
        <Col xs={24} md={6}>  
          {isInventoryReport ? (  
            <Flex align="center" justify="flex-end">  
              <Button type="primary">Generate</Button>  
            </Flex>  
          ) : (  
            <Flex gap={2} align="center" justify="flex-end">  
              <Title level={5}>Generate</Title>  
              <Divider  
                style={{  
                  height: "40px",  
                  fontWeight: "bold",  
                }}  
                type="vertical"  
              />  
              <div>  
                <Flex gap={4} justify="space-between">  
                  <Button   
                    type="primary"   
                    onClick={handleDownloadPreventiveSLA}  
                    loading={isDownloadingPreventiveSLA} 
                  >  
                    SLA  
                  </Button>   
                  <Button   
                    type="primary"   
                  >  
                    Generate  
                  </Button>   
                </Flex>  
              </div>  
            </Flex>  
          )}  
        </Col>  
      </Row>  
    </>  
  );  
};  

export default FilterTable;