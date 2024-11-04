// src/components/FormFields/FormFieldEDC.tsx

import { Col, Form, Input, Row, Select, Switch, Alert } from "antd";
import { useEffect, useState } from "react";
import { IRegionModel } from "@smpm/models/regionModel";
import { IVendorModel } from "@smpm/models/vendorModel";
import {
  getAllVendorMilik,
  getAllVendorSewa,
} from "@smpm/services/vendorService";
import { getAllRegion } from "@smpm/services/regionService";
import {
  getBrand,
  getBrandType,
  getAllProviderSimcards,
} from "@smpm/services/edcService";
import { ProviderEntity } from "@smpm/models/edcModel";

const FormFieldEDC = () => {
  // Hapus instance form lokal
  // const [form] = Form.useForm();

  const [regions, setRegions] = useState<IRegionModel[]>([]);
  const [loadingRegions, setLoadingRegions] = useState<boolean>(false);
  const [errorRegions, setErrorRegions] = useState<string | null>(null);

  const [statusOwnership, setStatusOwnership] = useState<string | null>(null);
  const [vendors, setVendors] = useState<IVendorModel[]>([]);
  const [loadingVendors, setLoadingVendors] = useState<boolean>(false);
  const [errorVendors, setErrorVendors] = useState<string | null>(null);

  const [brands, setBrands] = useState<string[]>([]);
  const [loadingBrands, setLoadingBrands] = useState<boolean>(false);
  const [errorBrands, setErrorBrands] = useState<string | null>(null);

  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [brandTypes, setBrandTypes] = useState<string[]>([]);
  const [loadingBrandTypes, setLoadingBrandTypes] = useState<boolean>(false);
  const [errorBrandTypes, setErrorBrandTypes] = useState<string | null>(null);

  const [providers, setProviders] = useState<ProviderEntity[]>([]);
  const [loadingProviders, setLoadingProviders] = useState<boolean>(false);
  const [errorProviders, setErrorProviders] = useState<string | null>(null);

  useEffect(() => {
    fetchRegions();
    fetchBrands();
    fetchProviders();
  }, []);

  const fetchRegions = async () => {
    setLoadingRegions(true);
    try {
      const response = await getAllRegion();
      if (response.status.code === 200) {
        setRegions(response.result);
        setErrorRegions(null);
      } else {
        setErrorRegions(response.status.description);
      }
    } catch (error) {
      setErrorRegions("Terjadi kesalahan saat mengambil data wilayah.");
    } finally {
      setLoadingRegions(false);
    }
  };

  useEffect(() => {
    if (statusOwnership) {
      fetchVendors();
    }
  }, [statusOwnership]);

  const fetchVendors = async () => {
    if (!statusOwnership) return;

    setLoadingVendors(true);
    try {
      const response =
        statusOwnership === "sewa"
          ? await getAllVendorSewa()
          : await getAllVendorMilik();

      if (Array.isArray(response)) {
        setVendors(response);
        setErrorVendors(null);
      } else {
        setErrorVendors("Format response tidak sesuai.");
      }
    } catch (error) {
      setErrorVendors("Terjadi kesalahan saat mengambil data vendor.");
    } finally {
      setLoadingVendors(false);
    }
  };

  const fetchBrands = async () => {
    setLoadingBrands(true);
    try {
      const response = await getBrand();
      if (response.status.code === 200) {
        const brandData = response.result.map((item: any) => item.brand);
        setBrands(brandData);
        setErrorBrands(null);
      } else {
        setErrorBrands(response.status.description);
      }
    } catch (error) {
      setErrorBrands("Terjadi kesalahan saat mengambil data merk EDC.");
    } finally {
      setLoadingBrands(false);
    }
  };

  const fetchBrandTypes = async (brand: string) => {
    setLoadingBrandTypes(true);
    try {
      const response = await getBrandType({ brand });
      if (response.status.code === 200) {
        const typeData = response.result.map((item: any) => item.type);
        setBrandTypes(typeData);
        setErrorBrandTypes(null);
      } else {
        setErrorBrandTypes(response.status.description);
      }
    } catch (error) {
      setErrorBrandTypes("Terjadi kesalahan saat mengambil data tipe merk EDC.");
    } finally {
      setLoadingBrandTypes(false);
    }
  };

  const fetchProviders = async () => {
    setLoadingProviders(true);
    try {
      const providersData = await getAllProviderSimcards();
      setProviders(providersData);
      setErrorProviders(null);
    } catch (error) {
      setErrorProviders("Terjadi kesalahan saat mengambil data provider.");
    } finally {
      setLoadingProviders(false);
    }
  };

  const handleBrandChange = (value: string) => {
    setSelectedBrand(value);
    // Akses form dari parent menggunakan Form.useFormInstance()
    // Jika menggunakan props, Anda bisa mendapatkan form dari props
    // Di sini, kita anggap bahwa FormWrapper menggunakan context Form dari Ant Design
    // sehingga Form.Item akan otomatis terhubung
    // Namun, untuk memastikan reset values, mungkin perlu akses properti Form dari context
    // Silakan cek dokumentasi Ant Design jika perlu integrasi lebih lanjut
    // Untuk saat ini, kita akan menggunakan Form.Item tanpa instance
    // asalkan FormFieldEDC berada di dalam FormWrapper
    // Untuk reset field saat brand berubah, kita bisa menggunakan Form.Item's dependencies
    // Namun, untuk simpel, kita akan menggunakan Form.resetFields pada specific fields.

    // Contoh asumsi menggunakan Form.useFormInstance() jika diperlukan
    // const form = Form.useFormInstance();
    // form.resetFields(['brand_type']);
    if (value) {
      fetchBrandTypes(value);
    } else {
      setBrandTypes([]);
    }
  };

  return (
    // Hapus Form wrapper di sini
    <>
      <div style={{ background: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h3 style={{ marginBottom: "16px" }}>Informasi Dasar</h3>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              label="MID"
              name="mid"
              rules={[{ required: true, message: "MID diperlukan" }]}
            >
              <Input placeholder="Masukkan MID" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label="TID"
              name="tid"
              rules={[{ required: true, message: "TID diperlukan" }]}
            >
              <Input placeholder="Masukkan TID" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label="Serial Number"
              name="serial_number"
              rules={[{ required: true, message: "Serial Number diperlukan" }]}
            >
              <Input placeholder="Masukkan Serial Number" />
            </Form.Item>
          </Col>
        </Row>
      </div>

      <div
        style={{
          background: "#f5f5f5",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h3 style={{ marginBottom: "16px" }}>Spesifikasi EDC</h3>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              label="Merk EDC"
              name="brand"
              rules={[{ required: true, message: "Merk EDC diperlukan" }]}
            >
              <Select
                placeholder="Pilih Merk EDC"
                loading={loadingBrands}
                onChange={handleBrandChange}
                allowClear
                showSearch
                optionFilterProp="children"
              >
                {brands.map((brand) => (
                  <Select.Option key={brand} value={brand}>
                    {brand}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            {errorBrands && <Alert message={errorBrands} type="error" showIcon />}
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              label="Tipe EDC"
              name="brand_type"
              dependencies={['brand']} // Menandakan bahwa field ini bergantung pada 'brand'
              rules={[{ required: true, message: "Tipe EDC diperlukan" }]}
            >
              <Select
                placeholder="Pilih Tipe EDC"
                loading={loadingBrandTypes}
                allowClear
                showSearch
                optionFilterProp="children"
                disabled={!selectedBrand}
              >
                {brandTypes.map((type) => (
                  <Select.Option key={type} value={type}>
                    {type}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            {errorBrandTypes && <Alert message={errorBrandTypes} type="error" showIcon />}
          </Col>

          <Col xs={24} md={8}>
            <Form.Item label="Wilayah" name="region">
              <Select
                placeholder="Pilih Wilayah"
                loading={loadingRegions}
                allowClear
                showSearch
                optionFilterProp="children"
              >
                {regions.map((region) => (
                  <Select.Option key={region.id} value={region.name}>
                    {`${region.name} (${region.code})`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            {errorRegions && <Alert message={errorRegions} type="error" showIcon />}
          </Col>
        </Row>
      </div>

      <div
        style={{
          background: "#f5f5f5",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h3 style={{ marginBottom: "16px" }}>Status Kepemilikan</h3>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              label="Status Kepemilikan"
              name="status_owner"
              rules={[{ required: true, message: "Status Kepemilikan diperlukan" }]}
            >
              <Select
                placeholder="Pilih Status Kepemilikan"
                onChange={(value) => {
                  setStatusOwnership(value);
                  // Reset vendor saat status ownership berubah
                  // Akses form instance menggunakan Form.useFormInstance()
                  // atau kontrol lain sesuai kebutuhan
                }}
              >
                <Select.Option value="sewa">Sewa</Select.Option>
                <Select.Option value="milik">Milik</Select.Option>
              </Select>
            </Form.Item>
            {errorVendors && <Alert message={errorVendors} type="error" showIcon />}
          </Col>

          {statusOwnership && (
            <Col xs={24} md={8}>
              <Form.Item
                label="Vendor"
                name="owner_id"
                rules={[{ required: true, message: "Vendor diperlukan" }]}
              >
                <Select
                  placeholder="Pilih Vendor"
                  loading={loadingVendors}
                  allowClear
                  showSearch
                  optionFilterProp="children"
                >
                  {vendors.map((vendor) => (
                    <Select.Option key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          )}

          <Col xs={24} md={8}>
            <Form.Item label="Kelengkapan" name="status_owner_desc">
              <Input placeholder="Masukkan Kelengkapan" />
            </Form.Item>
          </Col>
        </Row>
      </div>

      <div
        style={{
          background: "#f5f5f5",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h3 style={{ marginBottom: "16px" }}>Status dan Kondisi</h3>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item label="Kondisi" name="status_machine">
              <Input placeholder="Masukkan Kondisi" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Deskripsi Kondisi" name="status_machine_desc">
              <Input placeholder="Masukkan Deskripsi Kondisi" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              label="Status Aktif"
              name="status_active"
              valuePropName="checked"
            >
              <Switch checkedChildren="Aktif" unCheckedChildren="Tidak Aktif" />
            </Form.Item>
          </Col>
        </Row>
      </div>

      <div
        style={{
          background: "#f5f5f5",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h3 style={{ marginBottom: "16px" }}>Informasi Simcard</h3>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item label="Provider" name="simcard_provider">
              <Select
                placeholder="Pilih Provider"
                loading={loadingProviders}
                allowClear
                showSearch
                optionFilterProp="children"
              >
                {providers.map((provider) => (
                  <Select.Option
                    key={provider.id_provider_simcard}
                    value={provider.name_provider}
                  >
                    {provider.name_provider}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            {errorProviders && <Alert message={errorProviders} type="error" showIcon />}
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="No Simcard" name="simcard_number">
              <Input placeholder="Masukkan No Simcard" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Status EDC" name="status_edc">
              <Input placeholder="Masukkan Status EDC" />
            </Form.Item>
          </Col>
        </Row>
      </div>

      <div
        style={{
          background: "#f5f5f5",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <h3 style={{ marginBottom: "16px" }}>Informasi Tambahan</h3>
        <Row>
          <Col span={24}>
            <Form.Item label="Informasi Tambahan" name="info">
              <Input.TextArea
                placeholder="Masukkan Informasi Tambahan"
                rows={4}
              />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default FormFieldEDC;