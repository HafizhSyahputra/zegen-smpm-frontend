import { IErrorTable } from "@smpm/models"
import { Alert, Space, Table } from "antd"
import type { ColumnsType } from "antd/es/table"

interface ITableErrorValidationInfo {
	title: string
	errors: IErrorTable[]
}

const TableErrorValidationInfo: React.FC<ITableErrorValidationInfo> = ({
	title = "Error info",
	errors = [],
}) => {
	const columns: ColumnsType<IErrorTable> = [
		{
			title: "Row",
			dataIndex: "row",
		},
		{
			title: "Column",
			dataIndex: "column",
		},
		{
			title: "Value",
			dataIndex: "value",
		},
		{
			title: "Message",
			dataIndex: "message",
		},
	]

	return (
		<Space direction="vertical" className="w-full">
			<Alert message={title} type="warning" showIcon closable />
			<Table columns={columns} dataSource={errors} />
		</Space>
	)
}

export default TableErrorValidationInfo
