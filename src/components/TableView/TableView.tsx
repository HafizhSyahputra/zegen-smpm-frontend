/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
import InputSearchTableView from "@smpm/components/TableView/InputSearchTableView"
import { regionSearchColumn } from "@smpm/models/regionModel"
import { Card, Col, Row, Table } from "antd"
import type { ColumnsType } from "antd/es/table"
import React, { useCallback, useState } from "react"

const columns: ColumnsType<DataType> = [
	{
		title: "Name",
		dataIndex: "name",
		render: (text: string) => <a>{text}</a>,
	},
	{
		title: "Age",
		dataIndex: "age",
	},
	{
		title: "Address",
		dataIndex: "address",
	},
]

const data: DataType[] = [
	{
		key: "1",
		name: "John Brown",
		age: 32,
		address: "New York No. 1 Lake Park",
	},
	{
		key: "2",
		name: "Jim Green",
		age: 42,
		address: "London No. 1 Lake Park",
	},
	{
		key: "3",
		name: "Joe Black",
		age: 32,
		address: "Sydney No. 1 Lake Park",
	},
	{
		key: "4",
		name: "Disabled User",
		age: 99,
		address: "Sydney No. 1 Lake Park",
	},
]

// rowSelection object indicates the need for row selection
const rowSelection = {
	onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
		console.log(
			`selectedRowKeys: ${selectedRowKeys}`,
			"selectedRows: ",
			selectedRows
		)
	},
	getCheckboxProps: (record: DataType) => ({
		disabled: record.name === "Disabled User", // Column configuration not to be checked
		name: record.name,
	}),
}

interface ITableView<T> {
	data: T[] | undefined
	columns: ColumnsType<T[]>
}

const TableView = <T extends unknown>({
	data = [],
	columns = [],
}: ITableView<T>) => {
	const [searchColumn, setSearchColumn] = useState<string | null>(null)

	const setSelectedSearchColumn = useCallback((value: any) => {
		setSearchColumn(value)
	}, [])

	console.log(columns)

	return (
		<Card>
			<Row className="mb-4">
				<Col span={10}>
					<InputSearchTableView
						searchColumns={regionSearchColumn}
						selectedColumn={searchColumn}
						onSelectColumn={setSelectedSearchColumn}
					/>
				</Col>
			</Row>
			<Table columns={columns} dataSource={data} />
		</Card>
	)
}

export default TableView
