import DataTable from "@smpm/components/DataTable"
import { IJobOrderModel } from "@smpm/models/jobOrderModel"
import { getOpenJobOrder } from "@smpm/services/jobOrderService"
import { useDebounce } from "@smpm/utils/useDebounce"
import useTableHelper from "@smpm/utils/useTableHelper"
import { useQuery } from "@tanstack/react-query"
import { Badge } from "antd"
import { ColumnsType } from "antd/es/table"
import * as dayjs from "dayjs"
import { useMemo, useState } from "react"

interface ITableOpenJobOrderProps {
	filter?: any
}

const TableOpenJobOrder: React.FC<ITableOpenJobOrderProps> = ({ filter }) => {
	const { tableFilter, onChangeTable, onChangeSearchBy } =
		useTableHelper<IJobOrderModel>({pagination : true})

	const [search, setSearch] = useState<string>("")

	const searchValue = useDebounce(search, 500)

	const onSearch = (value: string) => setSearch(value)

	const {
		data: openJobOrder,
		isLoading,
		isSuccess,
	} = useQuery({
		queryKey: ["open-job-order", { ...tableFilter, searchValue, ...filter }],
		queryFn: () =>
			getOpenJobOrder({
				order: tableFilter.sort.order,
				order_by: tableFilter.sort.order_by,
				search: searchValue,
				search_by: tableFilter.searchBy,
				page: Number(tableFilter.pagination.current),
				take: Number(tableFilter.pagination.pageSize),
				...filter,
			}),
	})

	const columns: ColumnsType<IJobOrderModel> =
		useMemo((): ColumnsType<IJobOrderModel> => {
			return [
				{
					title: "NO. JO",
					dataIndex: "no",
					sorter: true,
					sortDirections: ["descend", "ascend"],
					width: 300,
				},
				{
					title: "JENIS JO",
					dataIndex: "type",
					sorter: true,
					sortDirections: ["descend", "ascend"],
				},
				{
					title: "WILAYAH",
					sorter: true,
					sortDirections: ["descend", "ascend"],
					render: (record) => {
						return record.region.name
					},
				},
				{
					title: "VENDOR",
					sorter: true,
					sortDirections: ["descend", "ascend"],
					render: (record) => {
						return record.vendor.name
					},
				},
				{
					title: "TANGGAL",
					dataIndex: "date",
					sorter: true,
					sortDirections: ["descend", "ascend"],
					render: (date) => {
						return dayjs(date).format("DD-MMM-YYYY")
					},
				},
				{
					title: "MID",
					dataIndex: "mid",
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
					title: "NAMA MERCHANT",
					dataIndex: "merchant_name",
					sorter: true,
					sortDirections: ["descend", "ascend"],
				},
				{
					title: "ADDRESS 1",
					dataIndex: "address1",
					sorter: true,
					sortDirections: ["descend", "ascend"],
				},
				{
					title: "ADDRESS 2",
					dataIndex: "address2",
					sorter: true,
					sortDirections: ["descend", "ascend"],
				},
				{
					title: "ADDRESS 3",
					dataIndex: "address3",
					sorter: true,
					sortDirections: ["descend", "ascend"],
				},
				{
					title: "ADDRESS 4",
					dataIndex: "address4",
					sorter: true,
					sortDirections: ["descend", "ascend"],
				},
				{
					title: "KATEGORI MERCHANT",
					dataIndex: "merchant_category",
					sorter: true,
					sortDirections: ["descend", "ascend"],
				},
				{
					title: "KATEGORI SEWA/MILIK",
					dataIndex: "ownership",
					sorter: true,
					sortDirections: ["descend", "ascend"],
					render: (ownership) => {
						return ownership == "Milik" ? (
							<Badge key="orange" color="orange" text={ownership} />
						) : (
							<Badge key="cyan" color="cyan" text={ownership} />
						)
					},
				},
			]
		}, [])

	return (
		<DataTable<IJobOrderModel>
			dataSource={openJobOrder?.result.data}
			pagination={{
				current: openJobOrder?.result.meta.page,
				pageSize: openJobOrder?.result.meta.take,
				total: openJobOrder?.result.meta.item_count,
			}}
			loading={isLoading}
			bordered
			onChangeSearchBy={onChangeSearchBy}
			searchByOptions={[
				{
					name: "NO. JO",
					value: "no",
				},
				{
					name: "Jenis",
					value: "type",
				},
				{
					name: "Wilayah",
					value: "region.name",
				},
				{
					name: "Vendor",
					value: "vendor.name",
				},
				{
					name: "MID",
					value: "mid",
				},
				{
					name: "TID",
					value: "tid",
				},
				{
					name: "Nama Merchant",
					value: "merchant_name",
				},
				{
					name: "TID",
					value: "tid",
				},
				{
					name: "Kategori Merchant",
					value: "merchant_category",
				},
				{
					name: "Kategori Sewa/Milik",
					value: "ownership",
				},
			]}
			onGlobalSearch={onSearch}
			columns={columns}
			useGlobalSearchInput
			onChange={onChangeTable}
			scroll={{
				x: 3000,
			}}
		/>
	)
}

export default TableOpenJobOrder
