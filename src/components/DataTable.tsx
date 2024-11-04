import { numberFormat } from "@smpm/utils/numberFormat"
import { IconListSearch, IconSearch } from "@tabler/icons-react"
import {
	Badge,
	Button,
	Card,
	Checkbox,
	Dropdown,
	Input,
	Space,
	Table,
	TableProps,
	Tooltip,
} from "antd"
import { CheckboxChangeEvent } from "antd/es/checkbox"
import { CheckboxValueType } from "antd/es/checkbox/Group"
import type { ColumnType } from "antd/es/table"
import { FilterConfirmProps } from "antd/es/table/interface"
import React, { useEffect, useMemo, useState } from "react"

export const getColumnFilter = <T extends unknown>({
	Component,
	icon,
}: {
	Component: (props: {
		onChange?: (selectedKeys: React.Key[]) => void
		value?: React.Key[]
	}) => React.ReactNode
	icon: (filtered: boolean) => React.ReactNode
}): ColumnType<T> => {
	const onSearch = (confirm: (param?: FilterConfirmProps) => void) => {
		confirm({
			closeDropdown: true,
		})
	}

	const onReset = (clearFilters: () => void) => {
		clearFilters()
	}

	return {
		filterDropdown: (props) => (
			<div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
				{Component({
					onChange: props.setSelectedKeys,
					value: props.selectedKeys,
				})}
				<Space>
					<Button
						type="primary"
						onClick={() => onSearch(props.confirm)}
						size="small"
						style={{ width: 90 }}
					>
						Search
					</Button>
					<Button
						onClick={() => props.clearFilters && onReset(props.clearFilters)}
						size="small"
						style={{ width: 90 }}
					>
						Reset
					</Button>
					<Button
						type="link"
						size="small"
						onClick={() => {
							props.close()
						}}
					>
						Close
					</Button>
				</Space>
			</div>
		),
		filterIcon: icon,
	}
}

export const getColumnSearchProps = <T extends unknown>(
	dataIndex: keyof T
): ColumnType<T> => {
	const onSearch = (confirm: (param?: FilterConfirmProps) => void) => {
		confirm({
			closeDropdown: true,
		})
	}

	const onReset = (clearFilters: () => void) => {
		clearFilters()
	}

	return {
		filterDropdown: ({
			setSelectedKeys,
			selectedKeys,
			confirm,
			clearFilters,
			close,
		}) => (
			<div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
				<Input
					placeholder={`Search ${String(dataIndex)}`}
					value={selectedKeys[0]}
					onChange={(e) => {
						setSelectedKeys(e.target.value ? [e.target.value] : [])
					}}
					onPressEnter={() => onSearch(confirm)}
					style={{ marginBottom: 8, display: "block" }}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() => onSearch(confirm)}
						size="small"
						style={{ width: 90 }}
					>
						Search
					</Button>
					<Button
						onClick={() => clearFilters && onReset(clearFilters)}
						size="small"
						style={{ width: 90 }}
					>
						Reset
					</Button>
					<Button
						type="link"
						size="small"
						onClick={() => {
							close()
						}}
					>
						Close
					</Button>
				</Space>
			</div>
		),
		filterIcon: (filtered: boolean) => (
			<IconSearch style={{ color: filtered ? "#1677ff" : undefined }} />
		),
	}
}

type SearchByOption = {
	name?: string
	value?: any
}

export interface DataTableProps<T> extends TableProps<T> {
	useGlobalSearchInput?: boolean
	useSearchByOptions?: boolean
	onGlobalSearch?: (value: string) => void
	searchByOptions?: SearchByOption[]
	onChangeSearchBy?: (value: CheckboxValueType[]) => void
}

const DataTable = <T extends Record<string, any>>({
	useSearchByOptions = true,
	...props
}: DataTableProps<T>) => {
	const search_by_options = useMemo(() => {
		return props.searchByOptions && props.searchByOptions.length > 0
			? props.searchByOptions
			: props.columns
					?.filter((data) => data.title !== "" && data?.dataIndex)
					.map((d) => {
						return {
							name: d.title?.toString(),
							value: d?.dataIndex as any,
						}
					}) ?? [{ name: "", value: "" }]
	}, [props.searchByOptions])

	const [selected, setSelected] = useState<CheckboxValueType[]>([])
	const [options, setOptions] = useState<SearchByOption[]>(search_by_options)

	const onCheckAll = (e: CheckboxChangeEvent) => {
		if (e.target.checked) {
			setSelected(options.map((option) => option.value))
		} else {
			setSelected([])
		}
	}

	const onCheckPartial = (checkedValue: CheckboxValueType[]) =>
		setSelected(checkedValue)

	useEffect(() => {
		setSelected(options.map((option) => option.value))
	}, [])

	useEffect(() => {
		props.onChangeSearchBy && props.onChangeSearchBy(selected)
	}, [selected])

	const TotalRecords = useMemo(() => {
		return !props?.loading ? (
			<p className="text-gray-500">
				Showing{" "}
				{props.pagination
					? +(props.pagination?.total ? props.pagination?.total : 0) >
					  +(props.pagination?.pageSize ? props.pagination?.pageSize : 0)
						? props?.pagination?.pageSize || 0
						: numberFormat(props.pagination?.total ?? 0)
					: 0}{" "}
				from{" "}
				{numberFormat(
					props.pagination
						? +(props.pagination?.total ? props.pagination?.total : 0)
						: 0
				)}{" "}
				Data
			</p>
		) : null
	}, [props])

	return (
		<>
			{props.useGlobalSearchInput ? (
				<Input.Search
					placeholder="Cari Data"
					onSearch={(value, event) =>
						props.onGlobalSearch && props.onGlobalSearch(value)
					}
					className="flex-none w-full md:w-72 mb-5"
					enterButton
					allowClear
				/>
			) : null}

			{useSearchByOptions && (
				<Dropdown
					trigger={["click"]}
					dropdownRender={() => (
						<Card>
							<h4 className=" font-medium text-gray-500 uppercase font-poppins justify-start mt-0">
								Search By
							</h4>
							<div>
								<Checkbox
									indeterminate={selected.length < options.length && selected.length > 0}
									onChange={onCheckAll}
									checked={selected.length === options.length}
								>
									All
								</Checkbox>
							</div>
							<Checkbox.Group
								defaultValue={selected}
								value={selected}
								onChange={onCheckPartial}
								style={{
									flexDirection: "column",
								}}
							>
								{options.map((data) => (
									<Checkbox value={data.value} className="font-poppins">
										{data.name}
									</Checkbox>
								))}
							</Checkbox.Group>
						</Card>
					)}
				>
					<Tooltip
						placement="bottom"
						title={"Search By"}
						arrow={{
							pointAtCenter: true,
						}}
					>
						<Badge count={selected.length}>
							<Button
								shape="circle"
								size="large"
								icon={<IconListSearch />}
								className="border-none"
							/>
						</Badge>
					</Tooltip>
				</Dropdown>
			)}
			{TotalRecords}
			<div className={"overflow-x-auto"}>
				<Table {...props} />
			</div>
		</>
	)
}

export default DataTable
