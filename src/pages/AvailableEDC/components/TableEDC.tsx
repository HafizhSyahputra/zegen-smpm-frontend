import DataTable from "@smpm/components/DataTable";
import { ElectronicDataCaptureMachine } from "@smpm/models/edcModel";
import { getDataEDC } from "@smpm/services/edcService";
import { useDebounce } from "@smpm/utils/useDebounce";
import useTableHelper from "@smpm/utils/useTableHelper";
import { useQuery } from "@tanstack/react-query";
import { ColumnsType } from "antd/es/table";
import { useMemo, useState } from "react";

const TableEDC = () => {
  const { tableFilter } = useTableHelper<ElectronicDataCaptureMachine>({pagination : true});

  const [search, setSearch] = useState<string>("");

  const searchValue = useDebounce(search, 500);

  const onSearch = (value: string) => setSearch(value);

  const {
    data: edc,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["edc", { ...tableFilter }],
    queryFn: () =>
      getDataEDC({
        order: tableFilter.sort.order,
        order_by: tableFilter.sort.order_by,
        search: searchValue,
        search_by: tableFilter.searchBy,
        page: Number(tableFilter.pagination.current),
        take: Number(tableFilter.pagination.pageSize),
      }),
  });

  const columns: ColumnsType<ElectronicDataCaptureMachine> =
    useMemo((): ColumnsType<ElectronicDataCaptureMachine> => {
      return [
        {
          title: "Serial Number",
          dataIndex: "serial_number",
          sorter: true,
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "TID",
          dataIndex: "tid",
          sorter: true,
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "Merk EDC",
          dataIndex: "brand",
          sorter: true,
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "Tipe EDC",
          dataIndex: "brand_type",
          sorter: true,
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "Wilayah",
          dataIndex: "region",
          sorter: true,
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "Status Kepemilikan",
          dataIndex: "status_owner",
          sorter: true,
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "Kelengkapan",
          // dataIndex: "status_owner",
          sorter: true,
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "Kondisi",
          dataIndex: "status_machine_desc",
          sorter: true,
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "Penggunaan",
          sorter: true,
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "Tempat",
          sorter: true,
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "Provider",
          dataIndex: "simcard_provider",
          sorter: true,
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "No Simcard",
          dataIndex: "simcard_number",
          sorter: true,
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "Kategori",
          sorter: true,
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "Tanggal Masuk",
          sorter: true,
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "Status",
          dataIndex: "status_machine",
          sorter: true,
          sortDirections: ["descend", "ascend"],
        },
        {
          title: "",
          sorter: false,
        },
      ];
    }, []);

  return (
    <DataTable<ElectronicDataCaptureMachine>
      dataSource={edc?.result.data}
      pagination={{
        current: edc?.result.meta.page,
        pageSize: edc?.result.meta.take,
        total: edc?.result.meta.item_count,
      }}
      loading={isLoading}
      bordered
      onGlobalSearch={onSearch}
      columns={columns}
      useGlobalSearchInput
    />
  );
};

export default TableEDC;