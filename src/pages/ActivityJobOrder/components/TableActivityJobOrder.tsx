
import DataTable from "@smpm/components/DataTable"
import { IJobOrderModel } from "@smpm/models/jobOrderModel"
import { getActivityJobOrder } from "@smpm/services/jobOrderService"
import { useDebounce } from "@smpm/utils/useDebounce"
import useTableHelper from "@smpm/utils/useTableHelper"
import { useQuery } from "@tanstack/react-query"
import { Badge, Button } from "antd"
import { ColumnsType } from "antd/es/table"
import * as dayjs from "dayjs"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { IconActivity, IconReload } from "@tabler/icons-react"  


interface ITableActivityJobOrderProps {
	filter?: any
}

const TableActivityJobOrder: React.FC<ITableActivityJobOrderProps> = ({
	filter,
}) => {
	const navigate = useNavigate()

	const { tableFilter, onChangeTable, onChangeSearchBy } =
		useTableHelper<IJobOrderModel>({pagination: true})

	const [search, setSearch] = useState<string>("")

	const searchValue = useDebounce(search, 500)

	const onSearch = (value: string) => setSearch(value)

	const {
		data: openJobOrder,
		isLoading,
		// isSuccess,
	} = useQuery({
		queryKey: ["activity-job-order", { ...tableFilter, searchValue, ...filter }],
		queryFn: () =>
			getActivityJobOrder({
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
					render: (type) => {
						return type.includes("Cancel") ? <Badge color="red" text={type} /> : type
					},
				},
				{
					title: "STATUS",
					dataIndex: "status",
					sorter: true,
					sortDirections: ["descend", "ascend"],
					render: (status) => {
						return (
							<Badge
								color={status == "Cancel" ? "red" : status == "Done" ? "green" : "blue"}
								text={status}
							/>
						)
					},
				},
				{
					title: "PETUGAS",
					sorter: true,
					sortDirections: ["descend", "ascend"],
					render: (record) => {
						return (
							<>
								<span>{record.officer_name}</span>
							</>
						)
					},
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
				{  
					title: "ACTION",  
					render: (record) => {  
						if (record.status === "Cancel") {  
							return (  
							  <div style={{   
								display: 'flex',   
								justifyContent: 'center',   
								alignItems: 'center',   
								height: '100%'   
							  }}>  
								<a  
								  onClick={() => {  
									window.open(`/job-order/activity/${record.no}`, "_blank", "noreferrer");  
								  }}  
								  style={{   
									display: 'flex',   
									justifyContent: 'center',   
									alignItems: 'center',  
									width: '100%',  
									height: '100%'  
								  }}  
								>  
								  <IconReload style={{ fontSize: '1.2em' }} />  
								</a>  
							  </div>  
							) 
						} else {  
							return (  
								<div>  
									{record.status === "Done" ? (  
										<a  
											className="text-[#006678] hover:text-[#006558]"
											onClick={() => {  
												window.open(`/job-order/activity/${record.no}`, "_blank", "noreferrer")  
											}}  
										>  
											Done activity  
										</a>  
									) : (  
										<a  
											onClick={() => {  
												window.open(`/job-order/activity/${record.no}`, "_blank", "noreferrer")  
											}}  
										>  
											Activity  
										</a>  
									)}  
								</div>  
							)  
						}  
					},  
				},
				{  
					title: "Timeline",  
					render: (record) => {  
						return (  
							<div className="flex items-center justify-center">
							<Button  
								type="primary"  
								className="flex items-center"
								onClick={() => {  
									navigate(`/job-order/timeline/${record.no}`);  
								}}  
							>  
							<IconActivity size={20}/>
							</Button>  
							</div>
						);  
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

export default TableActivityJobOrder
