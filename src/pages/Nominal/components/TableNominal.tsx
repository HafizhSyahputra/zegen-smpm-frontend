import { Select } from "antd"
import DataTable from "@smpm/components/DataTable"
import { getNominal } from "@smpm/services/nominalService"
import { useDebounce } from "@smpm/utils/useDebounce"
import useTableHelper from "@smpm/utils/useTableHelper"
import { useQuery } from "@tanstack/react-query"
import { ColumnsType } from "antd/es/table"
import { useMemo, useState } from "react"
import { getVendor } from "@smpm/services/vendorService"

interface IVendor {
    id: number
    name: string
}

export interface INominalModel {
    id: number
    nominal: number | string
    jenis: string
    vendor_id: number
    vendor: IVendor
    tipe: string
}

interface ITableNominalProps {
    filter?: any
}

const TableNominal: React.FC<ITableNominalProps> = ({ filter }) => {
    const { tableFilter, onChangeTable, onChangeSearchBy } =
        useTableHelper<INominalModel>({ pagination: true })

    const [search, setSearch] = useState<string>("")
    const [selectedVendor, setSelectedVendor] = useState<number | undefined>()
    const searchValue = useDebounce(search, 500)
    const onSearch = (value: string) => setSearch(value)

    const { data: vendorsData } = useQuery({
        queryKey: ["vendor"],
        queryFn: () =>
            getVendor({
                page: 1,
                take: 100,
                order: "desc",
                order_by: "name",
            }),
    })

    const { data: nominalData, isLoading } = useQuery({
        queryKey: ["nominal-list", { ...tableFilter, searchValue, ...filter }],
        queryFn: () => {
            return getNominal({
                order: tableFilter.sort.order,
                order_by: tableFilter.sort.order_by,
                search: searchValue,
                search_by: tableFilter.searchBy,
                page: 1,
                take: 1000,
                ...filter,
            })
        },
    })

    const handleVendorChange = (value: number | undefined) => {
        setSelectedVendor(value)
    }

    const filteredData = useMemo(() => {
        if (!nominalData?.result.data) return []

        if (selectedVendor) {
            return nominalData.result.data.filter(
                (item) => item.vendor_id === selectedVendor
            )
        }

        return nominalData.result.data
    }, [nominalData, selectedVendor])

    const columns: ColumnsType<INominalModel> = useMemo((): ColumnsType<INominalModel> => {
        return [
            {
                title: "NOMINAL",
                dataIndex: "nominal",
                sorter: true,
                sortDirections: ["descend", "ascend"],
                width: 200,
                render: (nominal) => {
                    return typeof nominal === "number"
                        ? nominal.toLocaleString("id-ID")
                        : nominal
                },
            },
            {
                title: "JENIS",
                dataIndex: "jenis",
                sorter: true,
                sortDirections: ["descend", "ascend"],
                width: 200,
            },
            {
                title: "VENDOR",
                dataIndex: "vendor",
                sorter: true,
                sortDirections: ["descend", "ascend"],
                width: 200,
                render: (_, record) => record.vendor?.name || "-",
            },
            {
                title: "TIPE",
                dataIndex: "tipe",
                sorter: true,
                sortDirections: ["descend", "ascend"],
                width: 200,
            },
        ]
    }, [])

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <span>Pilih Vendor : </span>
                <Select
                    style={{ width: 200 }}
                    placeholder="Filter Vendor"
                    allowClear
                    onChange={handleVendorChange}
                    options={
                        vendorsData?.result.data.map((vendor) => ({
                            label: vendor.name,
                            value: vendor.id,
                        })) || []
                    }
                />p
                
            </div>
            <DataTable<INominalModel>
                dataSource={filteredData}
                pagination={{
                    current: tableFilter.pagination.current,
                    pageSize: tableFilter.pagination.pageSize,
                    total: filteredData.length,
                    onChange: (page, pageSize) => {
                        onChangeTable({
                            pagination: {
                                current: page,
                                pageSize: pageSize,
                            },
                        })
                    },
                }}
                loading={isLoading}
                bordered
                onChangeSearchBy={onChangeSearchBy}
                searchByOptions={[
                    {
                        name: "ID",
                        value: "id",
                    },
                    {
                        name: "Nominal",
                        value: "nominal",
                    },
                    {
                        name: "Jenis",
                        value: "jenis",
                    },
                    {
                        name: "Vendor",
                        value: "vendor.name",
                    },
                    {
                        name: "Tipe",
                        value: "tipe",
                    },
                ]}
                onGlobalSearch={onSearch}
                columns={columns}
                useGlobalSearchInput
                onChange={onChangeTable}
                scroll={{
                    x: 1000,
                }}
            />
        </div>
    )
}

export default TableNominal