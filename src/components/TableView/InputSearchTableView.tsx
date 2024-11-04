import { Input, Select } from "antd"

interface IInputSearchTableView {
	placeholder?: string
	searchColumns: string[]
	selectedColumn?: string | null
	onSelectColumn?: (value: any) => void
}

const { Option } = Select

const InputSearchTableView: React.FC<IInputSearchTableView> = ({
	searchColumns = ["id"],
	placeholder,
	selectedColumn,
	onSelectColumn,
}) => {
	return (
		<Input
			addonBefore={
				<Select
					defaultValue={searchColumns.join(",") ?? "id"}
					onSelect={onSelectColumn}
					className="lg:min-w-[100px]"
				>
					<Option value={searchColumns.join(",") ?? "id"}>All</Option>
					{searchColumns.map((item, i) => (
						<Option key={i} value={item}>{`${item[0].toUpperCase()}${item.slice(
							1
						)}`}</Option>
					))}
				</Select>
			}
			placeholder={
				placeholder
					? placeholder
					: selectedColumn
					? `Search for ${selectedColumn.split(",").join(", ")}`
					: `Search for ${searchColumns.join(", ")}`
			}
		/>
	)
}

export default InputSearchTableView
