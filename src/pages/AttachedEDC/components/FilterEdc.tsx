// src/components/FilterEDC.tsx

import React, { useEffect } from "react";
import { Button, Col, Form, Row, Select, Radio, message } from "antd";
import { IconCheck, IconFilter } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { getBrand } from "@smpm/services/edcService";
import { getAllRegion } from "@smpm/services/regionService";
import { getMerchantsForDropdown } from "@smpm/services/merchantService";

const { Option } = Select;

// Contoh nilai untuk Penyedia SIM Card dan Status Kepemilikan
const SimcardProviders = ["ProviderA", "ProviderB", "ProviderC"];
const StatusOwners = ["Milik", "Sewa"];
const StatusActiveOptions = [
  { label: "Aktif", value: true },
  { label: "Tidak Aktif", value: false },
];

interface IFilterEDCProps {
  onFilter: (filters: any) => void;
}

const FilterEDC: React.FC<IFilterEDCProps> = ({ onFilter }) => {
  const [form] = Form.useForm();

  // Fetch Brand data
  const { data: brandResponse, isLoading: isLoadingBrands, error: brandError } = useQuery({
    queryKey: ["select-brand"],
    queryFn: () => getBrand(),
  });

  // Pastikan array brands diekstraksi dengan benar
  const brands = Array.isArray(brandResponse?.result) ? brandResponse.result : [];

  // Handle errors
  useEffect(() => {
    if (brandError) {
      message.error("Failed to load brands for dropdown.");
      console.error("Brand fetching error:", brandError);
    }
  }, [brandError]);

  // Fetch Region data
  const { data: regions, isLoading: isLoadingRegions, error: regionError } = useQuery({
    queryKey: ["select-region"],
    queryFn: () => getAllRegion(),
  });

  // Handle errors
  useEffect(() => {
    if (regionError) {
      message.error("Failed to load regions for dropdown.");
      console.error("Region fetching error:", regionError);
    }
  }, [regionError]);

  // Fetch Merchant data untuk dropdown
  const { data: merchantResponse, isLoading: isLoadingMerchants, error: merchantError } = useQuery({
    queryKey: ["select-merchant-dropdown"],
    queryFn: () => getMerchantsForDropdown(),
  });

  const merchants = Array.isArray(merchantResponse?.result?.result)
    ? merchantResponse.result.result
    : [];

  // Handle errors
  useEffect(() => {
    if (merchantError) {
      message.error("Failed to load merchants for dropdown.");
      console.error("Merchant fetching error:", merchantError);
    }
  }, [merchantError]);

  const handleFinish = (values: any) => {
    if (!values.status_edc || values.status_edc.length === 0) {
      message.error("Status EDC must not be empty.");
      return;
    }
    onFilter(values);
  };

  const handleReset = () => {
    form.resetFields();
    onFilter({});
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Row gutter={[16, 16]}>
        {/* Provider SIM Card */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item name="simcard_provider" label="Provider SIM Card">
            <Select mode="multiple" placeholder="Pilih Provider SIM Card" allowClear>
              {SimcardProviders.map((provider) => (
                <Option key={provider} value={provider}>
                  {provider}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        {/* Wilayah (Region) */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item name="region" label="Wilayah">
            <Select mode="multiple" placeholder="Pilih Wilayah" allowClear loading={isLoadingRegions}>
              {regions?.result?.map((region: any) => (
                <Option key={region.id} value={region.id}>
                  {region.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        {/* Status Kepemilikan (Ownership) */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item name="status_owner" label="Status Kepemilikan">
            <Select mode="multiple" placeholder="Pilih Status Kepemilikan" allowClear>
              {StatusOwners.map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        {/* Brand */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item name="brand" label="Brand">
            <Select
              mode="multiple"
              placeholder="Pilih Brand"
              allowClear
              loading={isLoadingBrands}
            >
              {brands.map((brand) => (
                <Option key={brand.id} value={brand.brand}>
                  {brand.brand}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        {/* Merchant ID */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item name="merchant_id" label="Merchant ID">
            <Select
              mode="multiple"
              placeholder="Pilih Merchant"
              allowClear
              loading={isLoadingMerchants}
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
              }
            >
              {merchants.map((merchant: any) => (
                <Option key={merchant.id} value={merchant.id}>
                  {merchant.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        {/* Status Aktif */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item name="status_active" label="Status Aktif">
            <Radio.Group>
              <Radio value={true}>Aktif</Radio>
              <Radio value={false}>Tidak Aktif</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>

        {/* Status EDC */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item name="status_edc" label="Status EDC" rules={[{ required: true, message: 'Status EDC must not be empty.' }]}>
            <Select mode="multiple" placeholder="Pilih Status EDC" allowClear>
              <Option value="Terpasang">Terpasang</Option>
              <Option value="Received IN">Received IN</Option>
              <Option value="Received Out">Received Out</Option>
              {/* Tambahkan opsi status lain sesuai kebutuhan */}
            </Select>
          </Form.Item>
        </Col>

        {/* Filter and Reset Buttons */}
        <Col xs={24} sm={24} md={24} lg={6}>
          <Form.Item name="btnfilter" label=" ">
            <Button type="primary" htmlType="submit" icon={<IconFilter size="1rem" />}>
              Filter
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleReset} icon={<IconCheck size="1rem" />}>
              Reset
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default FilterEDC;