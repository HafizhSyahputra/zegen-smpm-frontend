import { Card, DatePicker, Flex, Select, Space, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import DataTable, {
  getColumnFilter,
  getColumnSearchProps,
} from "@smpm/components/DataTable";
import { Option } from "antd/es/mentions";
import { IconSearch } from "@tabler/icons-react";
import useTableHelper from "@smpm/utils/useTableHelper";
import PageContent from "@smpm/components/PageContent";
import FilterTable, { TOptions } from "./FilterTable";
import { useState } from "react";

interface DataType {
  key: string;
  serial_number: string;
  tid: string;
  merk_edcs: string;
  type_edc: string;
  vendor_name: string;
  kantor_wilayah: string;
  vendor_code: string;
}

const data: DataType[] = [
  {
    key: "1",
    serial_number: "15357CT24841218",
    tid: "654856778",
    merk_edcs: "INGENICO",
    type_edc: "ICT 220",
    vendor_name: "PT SWADHARMA SARANA INFORMATIKA",
    kantor_wilayah: "Kantor Wilayah 01",
    vendor_code: "PT VISIONET DATA INTERNASIONAL",
  },
  {
    key: "2",
    serial_number: "15357CT24841504",
    tid: "8787451988",
    merk_edcs: "INGENICO",
    type_edc: "ICT 220",
    vendor_name: "PT SWADHARMA SARANA INFORMATIKA",
    kantor_wilayah: "Kantor Wilayah 01",
    vendor_code: "PT VISIONET DATA INTERNASIONAL",
  },
  {
    key: "3",
    serial_number: "15358CT24853574",
    tid: "568656689",
    merk_edcs: "INGENICO",
    type_edc: "ICT 220",
    vendor_name: "PT SWADHARMA SARANA INFORMATIKA",
    kantor_wilayah: "Kantor Wilayah 01",
    vendor_code: "PT VISIONET DATA INTERNASIONAL",
  },
  {
    key: "4",
    serial_number: "16199CT25654499",
    tid: "898795666",
    merk_edcs: "INGENICO",
    type_edc: "ICT 220",
    vendor_name: "PT SWADHARMA SARANA INFORMATIKA",
    kantor_wilayah: "Kantor Wilayah 01",
    vendor_code: "PT VISIONET DATA INTERNASIONAL",
  },
];

const optionStatus: TOptions[] = [
  {
    label: "All Status",
    value: "All Status",
  },
  {
    label: "Aktif",
    value: "Aktif",
  },
  {
    label: "Tidak Aktif",
    value: "Tidak Aktif",
  },
];

const optionWilayah: TOptions[] = [
  {
    label: "All Wilayah",
    value: "All Status",
  },
  {
    label: "Kantor Wilayah 01",
    value: "W01",
  },
  {
    label: "Kantor Wilayah 02",
    value: "W02",
  },
  {
    label: "Kantor Wilayah 03",
    value: "W03",
  },
];

const optionVendor: TOptions[] = [
  {
    label: "All Vendor",
    value: "All Vendor",
  },
  {
    label: "PT SWADHARMA SARANA INFORMATIKA",
    value: "BW",
  },
  {
    label: "PT INGENICO INTERNATIONAL INDONESIA",
    value: "IG",
  },
  {
    label: "PT PRIMA VISTA SOLUSI",
    value: "BP",
  },
];

const optionMerchant: TOptions[] = [
  {
    label: "All Merchant",
    value: "All Merchant",
  },
  {
    label: "PONDOK MAHONI MBL ",
    value: "201203817",
  },
  {
    label: "MARANATHA PONSEL MBL",
    value: "201042538",
  },
  {
    label: "MARANATHA BABY SHOP MBL",
    value: "201042520",
  },
];

function Inventory() {
  const [valueStatus, setValueStatus] = useState<string>("All Status");
  const [valueWilayah, setValueWilayah] = useState<string>("All Wilayah");
  const [valueVendor, setValueVendor] = useState<string>("All Vendor");
  const [valueMerchant, setValueMerchant] = useState<string>("All Merchant");
  const { Title } = Typography;
  const { RangePicker } = DatePicker;
  const { onChangeTable, onChangeSearchBy } = useTableHelper<DataType>();

  const handleChangeFilterStatus = (key: string) => {
    setValueStatus(key);
  };
  const handleChangeFilterWilayah = (key: string) => {
    setValueWilayah(key);
  };
  const handleChangeFilterVendor = (key: string) => {
    setValueVendor(key);
  };
  const handleChangeFilterMerchant = (key: string) => {
    setValueMerchant(key);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Serial Number",
      dataIndex: "serial_number",
      key: "serial_number",
      width: "20%",
      sorter: true,
      sortDirections: ["descend", "ascend"],
      render: (row) => {
        return row || "-";
      },
    },
    {
      title: "TID",
      dataIndex: "tid",
      key: "tid",
      sorter: true,
      sortDirections: ["descend", "ascend"],
      render: (row) => {
        return row || "-";
      },
    },
    {
      title: "Merk EDCS",
      dataIndex: "merk_edcs",
      key: "merk_edcs",
      sorter: true,
      sortDirections: ["descend", "ascend"],
      render: (row) => {
        return row || "-";
      },
    },
    {
      title: "Type EDC",
      dataIndex: "type_edc",
      key: "type_edc",
      sorter: true,
      sortDirections: ["descend", "ascend"],
      render: (row) => {
        return row || "-";
      },
    },
    {
      title: "Nama Merchant",
      dataIndex: "nama_merchant",
      key: "nama_merchant",
      sorter: true,
      sortDirections: ["descend", "ascend"],
      render: (row) => {
        return row || "-";
      },
    },
    {
      title: "Vendor Name",
      dataIndex: "vendor_name",
      key: "vendor_name",
      sorter: true,
      sortDirections: ["descend", "ascend"],
      width: "50%",
      render: (row) => {
        return row || "-";
      },
    },
    {
      title: "Kantor Wilayah",
      dataIndex: "kantor_wilayah",
      key: "kantor_wilayah",
      sorter: true,
      sortDirections: ["descend", "ascend"],
      width: "50%",
      render: (row) => {
        return row || "-";
      },
    },
    {
      title: "Vendor Code",
      dataIndex: "vendor_code",
      key: "vendor_code",
      sorter: true,
      sortDirections: ["descend", "ascend"],
      width: "50%",
      render: (row) => {
        return row || "-";
      },
    },
  ];
  return (
    <>
      <Flex justify="space-between" align="flex-end">
        <Title level={3}>Inventory Report</Title>
        <Space direction="vertical" size={12}>
          <RangePicker />
        </Space>
      </Flex>
      <FilterTable
        optionStatus={optionStatus}
        valueStatus={valueStatus}
        handleChangeFilterStatus={handleChangeFilterStatus}
        optionWilayah={optionWilayah}
        valueWilayah={valueWilayah}
        handleChangeFilterWilayah={handleChangeFilterWilayah}
        optionVendor={optionVendor}
        valueVendor={valueVendor}
        handleChangeFilterVendor={handleChangeFilterVendor}
        optionMerchant={optionMerchant}
        valueMerchant={valueMerchant}
        handleChangeFilterMerchant={handleChangeFilterMerchant}
        isInventoryReport={true}
      />
      <DataTable<DataType>
        style={{
          overflowX: "auto",
        }}
        columns={columns}
        bordered
        useGlobalSearchInput
        dataSource={data}
        pagination={{
          current: 1,
          pageSize: 10,
          total: data.length,
        }}
        onChange={onChangeTable}
      />
    </>
  );
}

export default Inventory;
