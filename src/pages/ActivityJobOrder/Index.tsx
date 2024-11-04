import { HomeOutlined } from "@ant-design/icons"
import PageContent from "@smpm/components/PageContent"
import PageLabel from "@smpm/components/pageLabel"
import Page from "@smpm/components/pageTitle"
import { IconSortDescendingNumbers } from "@tabler/icons-react"
import { Breadcrumb, Card } from "antd"
import FilterTableAcknowledgeJobOrder from "./components/FilterTableOpenJobOrder"
import TableActivityJobOrder from "./components/TableActivityJobOrder"
import { useState } from "react"

const ActivityJobOrder = () => {
	const [filter, setFilter] = useState({})
	return (
		<Page title="Activity Job Order">
			<PageLabel
				title={<span className="font-semibold text-2xl">Activity Job Order</span>}
				subtitle={
					<Breadcrumb
						items={[
							{
								href: "/dashboard",
								title: (
									<>
										<HomeOutlined />
										<span>Home</span>
									</>
								),
							},
							{
								href: "#",
								title: (
									<div className="flex gap-1">
										<IconSortDescendingNumbers size="1rem" />
										<span>Job Order</span>
									</div>
								),
							},
							{
								title: "Activity Job Order",
							},
						]}
					/>
				}
			/>
			<PageContent>
				<Card>
					<FilterTableAcknowledgeJobOrder
						onFinish={(values) => {
							setFilter(values)
						}}
					/>
					<TableActivityJobOrder filter={filter} />
				</Card>
			</PageContent>
		</Page>
	)
}

export default ActivityJobOrder
