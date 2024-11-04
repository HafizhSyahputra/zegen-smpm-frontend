import { getAllRegion } from "@smpm/services/regionService"
import { getAllVendor } from "@smpm/services/vendorService"
import {
	IconCategory2,
	IconMapPin2,
	IconReportSearch,
	IconSortDescendingNumbers,
	IconUserCog,
} from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import { Button, Col, Form, Row, Select } from "antd"
import { useForm } from "antd/es/form/Form"

const JobOrderType = [
	"New Installation",
	"CM Replace",
	"CM Re-init",
	"Preventive Maintenance",
	"Withdrawal",
	"Cancel Installation",
	"Cancel Withdrawal",
]

const Ownership = ["Milik", "Sewa"]

const Status = ["Acknowledge", "Done", "Cancel"]

interface IInitialValues {
	type?: number[]
	status?: string[]
	region_id?: number[]
	vendor_id?: number[]
	ownership?: string[]
}

interface IFilterTable {
	initialValues?: IInitialValues
	onFinish?: (values: IInitialValues) => void
}

const FilterTableAcknowledgeJobOrder: React.FC<IFilterTable> = ({
	initialValues,
	onFinish,
}) => {
	const [form] = useForm()

	const { data: region, isLoading: isLoadingRegion } = useQuery({
		queryKey: ["select-region"],
		queryFn: () => getAllRegion(),
	})

	const { data: vendor, isLoading: isLoadingVendor } = useQuery({
		queryKey: ["select-vendor"],
		queryFn: () => getAllVendor(),
	})

	return (
		<Form form={form} initialValues={initialValues} onFinish={onFinish}>
			<Row className="mb-5" gutter={[12, 8]}>
				<Col span={6}>
					<Form.Item name={["type"]} noStyle>
						<Select
							className="w-full"
							placeholder={
								<div className="flex items-start gap-1 font-semibold">
									<IconSortDescendingNumbers size="1.2rem" />
									<span>Jenis JO</span>
								</div>
							}
							allowClear
							mode="multiple"
						>
							{JobOrderType.map((item) => (
								<Select.Option value={item}>{item}</Select.Option>
							))}
						</Select>
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item name={["status"]} noStyle>
						<Select
							className="w-full"
							placeholder={
								<div className="flex items-start gap-1 font-semibold">
									<IconReportSearch size="1.2rem" />
									<span>Status</span>
								</div>
							}
							allowClear
							mode="multiple"
							virtual={true}
						>
							{Status.map((item) => (
								<Select.Option value={item}>{item}</Select.Option>
							))}
						</Select>
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item name={["region_id"]} noStyle>
						<Select
							className="w-full"
							placeholder={
								<div className="flex items-start gap-1 font-semibold">
									<IconMapPin2 size="1.2rem" />
									<span>Wilayah</span>
								</div>
							}
							allowClear
							mode="multiple"
							loading={isLoadingRegion}
							virtual={true}
						>
							{region?.result.map((item) => (
								<Select.Option value={item.id}>{item.name}</Select.Option>
							))}
						</Select>
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item name={["vendor_id"]} noStyle>
						<Select
							className="w-full"
							placeholder={
								<div className="flex items-start gap-1 font-semibold">
									<IconUserCog size="1.2rem" />
									<span>Vendor</span>
								</div>
							}
							allowClear
							mode="multiple"
							loading={isLoadingVendor}
							virtual={true}
						>
							{vendor?.result.map((item) => (
								<Select.Option value={item.id}>{item.name}</Select.Option>
							))}
						</Select>
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item name={["ownership"]} noStyle>
						<Select
							className="w-full"
							placeholder={
								<div className="flex items-start gap-1 font-semibold">
									<IconCategory2 size="1.2rem" />
									<span>Kategori Sewa/Milik</span>
								</div>
							}
							allowClear
							mode="multiple"
							loading={isLoadingVendor}
							virtual={true}
						>
							{Ownership.map((item) => (
								<Select.Option value={item}>{item}</Select.Option>
							))}
						</Select>
					</Form.Item>
				</Col>
				<Col span={6}>
					<Button type="primary" htmlType="submit">
						Filter
					</Button>
				</Col>
			</Row>
		</Form>
	)
}

export default FilterTableAcknowledgeJobOrder
