
import  { useState } from 'react';
import {
	CloudUploadOutlined,
	HomeOutlined,
	PlusOutlined,
} from "@ant-design/icons"
import PageContent from "@smpm/components/PageContent"
import PageLabel from "@smpm/components/pageLabel"
 import { IconUsersGroup } from "@tabler/icons-react"
import { Breadcrumb, Button, Card, Space, Modal, Form, Input, message } from "antd"
import TableRegion from "./components/TableRegion"
import { createRegion } from "@smpm/services/regionService"
import { useQueryClient } from "@tanstack/react-query"
import Page from '@smpm/components/pageTitle';

const Region = () => {
	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
	const [form] = Form.useForm();
	const queryClient = useQueryClient();

	const handleCreateRegion = async (values: any) => {
		try {
			await createRegion(values);
			message.success('Region created successfully');
			setIsCreateModalVisible(false);
			form.resetFields();
			queryClient.invalidateQueries({ queryKey: ["region"] });
		} catch (error) {
			console.error('Error creating region:', error);
			message.error('Failed to create region');
		}
	};

	return (
		<Page title="Wilayah">
			<PageLabel
				title={<span className="font-semibold text-2xl">Wilayah</span>}
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
								title: (
									<div className="flex gap-1">
										<IconUsersGroup size="1rem" />
										<span>User Management</span>
									</div>
								),
							},
							{
								title: "Wilayah",
							},
						]}
					/>
				}
				endSection={
					<Space>
						<Button icon={<CloudUploadOutlined />}>Export</Button>
						<Button 
							type="primary" 
							icon={<PlusOutlined />}
							onClick={() => setIsCreateModalVisible(true)}
						>
							Buat Wilayah Baru
						</Button>
					</Space>
				}
			/>
			<PageContent>
				<Card>
					<TableRegion />
				</Card>
			</PageContent>

			<Modal
				title="Buat Wilayah Baru"
				visible={isCreateModalVisible}
				onOk={() => form.submit()}
				onCancel={() => {
					setIsCreateModalVisible(false);
					form.resetFields();
				}}
			>
				<Form form={form} layout="vertical" onFinish={handleCreateRegion}>
					<Form.Item
						name="name"
						label="Name"
						rules={[{ required: true, message: 'Please input the region name!' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name="code"
						label="Code"
						rules={[{ required: true, message: 'Please input the region code!' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name="description"
						label="Description"
					>
						<Input.TextArea />
					</Form.Item>
				</Form>
			</Modal>
		</Page>
	)
}

export default Region
