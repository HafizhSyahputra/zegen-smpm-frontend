
import { HomeOutlined } from "@ant-design/icons"
import PageContent from "@smpm/components/PageContent"
import PageLabel from "@smpm/components/pageLabel"
import Page from "@smpm/components/pageTitle"
import { IconCurrencyDollar } from "@tabler/icons-react"
import { Breadcrumb, Button, Card, Flex, Typography, } from "antd"
import { useState } from "react"
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import TableNominal from "./components/TableNominal"

const { Title } = Typography;
const Nominal = () => {
    const navigate = useNavigate(); 
    const onAddNewNominal = () => navigate("/payment/nominal/add");
	const [] = useState(false)
	const [filter] = useState({})
	return (
		<Page title="Nominal">
			<PageLabel
				title={<span className="font-semibold text-2xl">Nominal</span>}
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
                                  <div className="flex gap-0">  
                                    <IconCurrencyDollar className="w-5 h-[18px]"/>  
                                    <span>Payment</span>  
                                  </div>  
                                ),  
                              }, 
							{
								title: "Nominal",
							},
						]}
					/>
				}
			/>
			<PageContent>
				<Card>
                <Flex justify="space-between" align="flex-end">
                    <Title level={3}>Nominal</Title>
                    <Button
                        type={"primary"}
                        icon={<PlusOutlined />}
                        onClick={onAddNewNominal}
                        className="mb-2"
                    >
                        Add New
                    </Button>
                    </Flex>
					<TableNominal filter={filter} />
				</Card>
			</PageContent>
		</Page>
	)
}

export default Nominal
