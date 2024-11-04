import { HomeOutlined } from "@ant-design/icons";
import DataTable, {
  getColumnFilter,
  getColumnSearchProps,
} from "@smpm/components/DataTable";
import PageContent from "@smpm/components/PageContent";
import PageLabel from "@smpm/components/pageLabel";
import Page from "@smpm/components/pageTitle";
import useTableHelper from "@smpm/utils/useTableHelper";
import { IconSearch } from "@tabler/icons-react";
import { Breadcrumb, Card, Select } from "antd";
import { ColumnsType } from "antd/es/table";

const { Option } = Select;

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const data: DataType[] = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
  },
  {
    key: "2",
    name: "Joe Black",
    age: 42,
    address: "London No. 1 Lake Park",
  },
  {
    key: "3",
    name: "Jim Green",
    age: 32,
    address: "Sydney No. 1 Lake Park",
  },
  {
    key: "4",
    name: "Jim Red",
    age: 32,
    address: "London No. 2 Lake Park",
  },
];

const Home = () => {
  const { onChangeTable, onChangeSearchBy } = useTableHelper<DataType>();

  const columns: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "30%",
      sorter: true,
      sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps<DataType>("name"),
      ...getColumnFilter<DataType>({
        Component: ({ onChange, value }) => (
          <Select onChange={onChange} value={value} className="w-full mb-5">
            <Option value={"Y"}>Ya</Option>
            <Option value={"N"}>Tidak</Option>
          </Select>
        ),
        icon: (filtered: boolean) => <IconSearch />,
      }),
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      width: "20%",
      sorter: true,
      sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps<DataType>("age"),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      sorter: true,
      sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps<DataType>("address"),
    },
  ];

  return (
    <Page title="Home">
      <PageLabel
        title={<span className="font-semibold text-2xl">Home</span>}
        subtitle={
          <Breadcrumb
            items={[
              {
                href: "",
                title: (
                  <>
                    <HomeOutlined />
                    <span>Home</span>
                  </>
                ),
              },
            ]}
          />
        }
      />
      <PageContent className={"m-5 h-screen"}>
        <Card>
          <DataTable<DataType>
            columns={columns}
            bordered
            useGlobalSearchInput
            onChangeSearchBy={onChangeSearchBy}
            dataSource={data}
            rowSelection={{
              type: "checkbox",
              onChange: console.log,
            }}
            pagination={{
              current: 1,
              pageSize: 10,
              total: data.length,
            }}
            onChange={onChangeTable}
          />
        </Card>
      </PageContent>
    </Page>
  );
};

export default Home;
