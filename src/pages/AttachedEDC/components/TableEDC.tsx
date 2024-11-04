// src/components/TableEDC.tsx

import React, { useMemo, useState } from "react";
import DataTable from "@smpm/components/DataTable";
import { ElectronicDataCaptureMachine, IPaginationResponse } from "@smpm/models/edcModel";
import { getInstalledEDCs } from "@smpm/services/edcService";
import { useDebounce } from "@smpm/utils/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { ColumnsType } from "antd/es/table";
import { SorterResult } from "antd/es/table/interface";
import { Input, message } from "antd";
import { AxiosError } from "axios";

interface ITableEDCProps {
  filters: {
    simcard_provider?: string[];
    region?: string[];
    status_owner?: string[];
    brand?: string[];
    merchant_id?: number[];
    status_active?: boolean;
    status_edc?: string[];
  };
}

interface APIResponse {
  status: {
    code: number;
    description: string;
  };
  result: {
    errors?: Record<string, string[]>;
  };
}

const TableEDC: React.FC<ITableEDCProps> = ({ filters }) => {
  const [tableState, setTableState] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    sort: {
      order: undefined as "asc" | "desc" | undefined,
    },
    searchBy: undefined as string | undefined,
  });

  const [search, setSearch] = useState<string>("");
  const searchValue = useDebounce(search, 500);
  const onSearch = (value: string) => setSearch(value);

  const combinedFilters = useMemo(
    () => ({
      ...filters,
      search: searchValue,
    }),
    [filters, searchValue]
  );

  const { data: edc, isLoading, error } = useQuery<
    IPaginationResponse<ElectronicDataCaptureMachine>,
    AxiosError<APIResponse>
  >({
    queryKey: ["edc", combinedFilters, tableState],
    queryFn: async () => {
      const response = await getInstalledEDCs({
        order: tableState.sort.order || "asc",
        search: combinedFilters.search,
        search_by: tableState.searchBy ? [tableState.searchBy] : undefined,
        page: Number(tableState.pagination.current),
        take: Number(tableState.pagination.pageSize),
        status_edc: combinedFilters.status_edc || [],
        simcard_provider: combinedFilters.simcard_provider,
        region: combinedFilters.region,
        status_owner: combinedFilters.status_owner,
        brand: combinedFilters.brand,
        merchant_id: combinedFilters.merchant_id,
        status_active: combinedFilters.status_active,
      });
      return response as unknown as IPaginationResponse<ElectronicDataCaptureMachine>;
    },
    staleTime: Infinity,
  });

  React.useEffect(() => {
    if (error) {
      const apiError = error;
      if (apiError.response?.data?.result?.errors) {
        const validationErrors = apiError.response.data.result.errors;
        Object.entries(validationErrors).forEach(([field, messages]) => {
          messages.forEach((msg) => {
            message.error(`${field}: ${msg}`);
          });
        });
      } else {
        message.error("Failed to load installed EDC machines.");
      }
      console.error("Error fetching installed EDC machines:", error);
    }
  }, [error]);

  const columns: ColumnsType<ElectronicDataCaptureMachine> = useMemo(
    () => [
      { title: "Serial Number", dataIndex: "serial_number", sorter: true, sortDirections: ["descend", "ascend"] },
      { title: "TID", dataIndex: "tid", sorter: true, sortDirections: ["descend", "ascend"] },
      { title: "Merk EDC", dataIndex: "brand", sorter: true, sortDirections: ["descend", "ascend"] },
      { title: "Tipe EDC", dataIndex: "brand_type", sorter: true, sortDirections: ["descend", "ascend"] },
      { title: "Wilayah", dataIndex: "region", sorter: true, sortDirections: ["descend", "ascend"] },
      { title: "Status Kepemilikan", dataIndex: "status_owner", sorter: true, sortDirections: ["descend", "ascend"] },
      { title: "Kondisi", dataIndex: "status_machine_desc", sorter: true, sortDirections: ["descend", "ascend"] },
      { title: "Provider SIM Card", dataIndex: "simcard_provider", sorter: true, sortDirections: ["descend", "ascend"] },
      { title: "No SIM Card", dataIndex: "simcard_number", sorter: true, sortDirections: ["descend", "ascend"] },
      { title: "Status Mesin", dataIndex: "status_machine", sorter: true, sortDirections: ["descend", "ascend"] },
      { 
        title: "Aktif", 
        dataIndex: "status_active", 
        render: (text: boolean) => (text ? "Ya" : "Tidak"), 
        sorter: true, 
        sortDirections: ["descend", "ascend"] 
      },
      { 
        title: "Status EDC", 
        dataIndex: "status_edc", 
        sorter: true, 
        sortDirections: ["descend", "ascend"] 
      },
    ],
    []
  );

  const handleTableChange = (
    pagination: any,
    filters: any,
    sorter: SorterResult<ElectronicDataCaptureMachine> | SorterResult<ElectronicDataCaptureMachine>[]
  ) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    
    setTableState({
      ...tableState,
      pagination: {
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
      sort: {
        order:
          singleSorter.order === "ascend"
            ? "asc"
            : singleSorter.order === "descend"
            ? "desc"
            : undefined,
      },
    });
  };

  return (
    <>
      <Input.Search
        placeholder="Cari EDC Terpasang"
        onSearch={onSearch}
        enterButton
        style={{ marginBottom: 16, width: 300 }}
        allowClear
      />
      <DataTable<ElectronicDataCaptureMachine>
        dataSource={edc?.data || []}
        pagination={{
          current: edc?.meta?.currentPage || 1,
          pageSize: edc?.meta?.itemsPerPage || 10,
          total: edc?.meta?.totalItems || 0,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        loading={isLoading}
        bordered
        columns={columns}
        useGlobalSearchInput={false}
        onChange={handleTableChange}
      />
    </>
  );
};
export default TableEDC;