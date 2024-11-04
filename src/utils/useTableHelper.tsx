import { TablePaginationConfig } from "antd"
import { FilterValue, SorterResult } from "antd/es/table/interface"
import { useState } from "react"
import { GenerateQueryparam } from "./generateQueryParam"
import { CheckboxValueType } from "antd/es/checkbox/Group"

type ReturnUseTableHelper<T> = {
	onHandleFilter: (filterValue: Record<string, FilterValue | null>) => void
	tableFilter: {
		pagination: TablePaginationConfig
		filter: Record<string, any> | undefined
		sortQuery: string
		sort: { order: "asc" | "desc"; order_by: string }
		searchBy: string[]
	}
	onChangeTable: (
		pagination: TablePaginationConfig,
		filter: any,
		sorter: SorterResult<T> | SorterResult<T>[]
	) => void
	onChangePaging: (pagination: TablePaginationConfig) => void
	onChangeSearchBy: (value: string[]) => void
	onHandleSorter: (sorter: SorterResult<T> | SorterResult<T>[]) => void
}

const ORDER_VALUE = {
	ascend: "asc",
	descend: "desc",
}

const useTableHelper = <T,>(p0: { pagination: boolean }): ReturnUseTableHelper<T> => {
	const [filter, setFilter] = useState<Record<string, any>>()
	const [sortQuery, setSortQuery] = useState<string>("")
	const [sort, setSort] = useState<{ order?: string; order_by?: string }>({
		order: undefined,
		order_by: undefined,
	})
	const [searchBy, setSearchBy] = useState<string[]>([])
	const [pagination, setPagination] = useState<TablePaginationConfig>({
		current: 1,
		pageSize: 10,
		total: 0,
	})

	const onHandleFilter = (filterValue: any) => {
		setFilter(filterValue)
	}

	const onChangeTable = (
		pagination: TablePaginationConfig,
		filter: any,
		sorter: SorterResult<T> | SorterResult<T>[]
	) => {
		onChangePaging(pagination)
		onHandleFilter(filter)
		onHandleSorter(sorter)
	}

	const onChangeSearchBy = (value: CheckboxValueType[]) => setSearchBy(value)

	const onHandleSorter = (sorter: SorterResult<T> | SorterResult<T>[]) => {
		if (!Array.isArray(sorter)) {
			if (sorter.order) {
				const field = {
					order: ORDER_VALUE[sorter.order],
					order_by: String(sorter.columnKey),
				}
				setSortQuery(GenerateQueryparam(field))
				setSort(field)
			}
		}
	}

	const onChangePaging = (pagination: TablePaginationConfig) => {
		setPagination(pagination)
	}

	return {
		tableFilter: {
			pagination,
			filter,
			sortQuery,
			searchBy,
			sort,
		},
		onChangeTable,
		onChangeSearchBy,
		onChangePaging,
		onHandleFilter,
		onHandleSorter,
	}
}

export default useTableHelper
