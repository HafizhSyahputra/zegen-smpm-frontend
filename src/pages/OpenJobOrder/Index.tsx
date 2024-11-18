import { CloudDownloadOutlined, HomeOutlined } from "@ant-design/icons"
import PageContent from "@smpm/components/PageContent"
import PageLabel from "@smpm/components/pageLabel"
import Page from "@smpm/components/pageTitle"
import TableErrorValidationInfo from "@smpm/components/tableErrorValidationInfo"
import {
	IBaseResponseService,
	IErrorResponseService,
	IErrorTable,
} from "@smpm/models"
import { IFormInputImportJobOrder } from "@smpm/models/jobOrderModel"
import {
	uploadJobOrderAcknowledge,
	uploadJobOrderNew,
} from "@smpm/services/jobOrderService"
import { makeResponseServiceError } from "@smpm/utils"
import { IconSortDescendingNumbers, IconUserCog } from "@tabler/icons-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Breadcrumb, Button, Card, Drawer, Space, message } from "antd"
import { AxiosError } from "axios"
import { useState } from "react"
import { useDispatch } from "react-redux"
import FilterTableOpenJobOrder from "./components/FilterTableOpenJobOrder"
import FormImportJobOrderAcknowledge from "./components/FormImportJobOrderAcknowledge"
import FormImportJobOrderNew from "./components/FormImportJobOrderNew"
import TableOpenJobOrder from "./components/TableOpenJobOrder"
const OpenJobOrder = () => {
	const [errorTableJoNew, setErrorTableJoNew] = useState<IErrorTable[]>([])
	const [errorTableJoAcknowledge, setErrorTableJoAcknowledge] = useState<
		IErrorTable[]
	>([])
	const dispatch = useDispatch()
	const queryClient = useQueryClient()
	const [openDrawerImportNew, setOpenDrawerImportNew] = useState(false)
	const [openDrawerImportAcknowledge, setOpenDrawerImportAcknowledge] =
		useState(false)
	const [filter, setFilter] = useState({})

	const showDrawerImportAcknowledge = () => {
		setOpenDrawerImportAcknowledge(true)
	}
	const showDrawerImportNew = () => {
		setOpenDrawerImportNew(true)
	}

	const onClose = () => {
		setOpenDrawerImportNew(false)
		setOpenDrawerImportAcknowledge(false)
	}

	const onResetJoNew = () => {
		setErrorTableJoNew([])
	}

	const onResetJoAcknowledge = () => {
		setErrorTableJoAcknowledge([])
	}

	const uploadJobOrderNewMutation = useMutation<
		IBaseResponseService<any>,
		AxiosError<IBaseResponseService<IErrorResponseService>>,
		any
	>({
		mutationFn: uploadJobOrderNew,
	})
	const onFinishImportJobOrderNew = (formData: FormData) => {  
		uploadJobOrderNewMutation.mutate(formData, {  
			onSuccess: () => {  
				message.success("Data berhasil diupload");  
				queryClient.invalidateQueries({  
					queryKey: ["open-job-order"],  
				});  
				onClose();  
				onResetJoNew();  
			},  
			onError: (err) => {  
				makeResponseServiceError(dispatch, "import-job-order-new", err);  
	
				if (  
					err.response?.data.status.code == 400 &&  
					err.response.data.result.errors  
				) {  
					setErrorTableJoNew(err.response.data.result.errors as any);  
				}  
			},  
		});  
	};

	const uploadJobOrderAcknowledgeMutation = useMutation<
		IBaseResponseService<any>,
		AxiosError<IBaseResponseService<IErrorResponseService>>,
		any
	>({
		mutationFn: uploadJobOrderAcknowledge,
	})
	const onFinishImportJobOrderAcknowledge = (
		values: IFormInputImportJobOrder
	) => {
		const formData = new FormData()
		formData.append("files", values.files)
		uploadJobOrderAcknowledgeMutation.mutate(formData, {
			onSuccess: () => {
				message.success("Data berhasil diupload")
				queryClient.invalidateQueries({
					queryKey: ["open-job-order"],
				})
				onClose()
				onResetJoAcknowledge()
			},
			onError: (err) => {
				makeResponseServiceError(dispatch, "import-job-order-acknowledge", err)

				if (
					err.response?.data.status.code == 400 &&
					err.response.data.result.errors
				) {
					setErrorTableJoAcknowledge(err.response.data.result.errors as any)
				}
			},
		})
	}

	return (
		<Page title="Open Job Order">
			<PageLabel
				title={<span className="font-semibold text-2xl">Open Job Order</span>}
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
								title: "Open Job Order",
							},
						]}
					/>
				}
				endSection={
					<Space>
						<Button
							icon={<IconUserCog size="1rem" />}
							onClick={showDrawerImportAcknowledge}
						>
							Import Job Order Acknowledge
						</Button>
						<Button
							type="primary"
							icon={<CloudDownloadOutlined />}
							onClick={showDrawerImportNew}
						>
							Import Job Order Baru
						</Button>
					</Space>
				}
			/>
			<PageContent>
				<Card>
					<FilterTableOpenJobOrder
						onFinish={(values) => {
							setFilter(values)
						}}
					/>
					<TableOpenJobOrder filter={filter} />
				</Card>
			</PageContent>
			<Drawer
				title="Import Job Order Baru"
				width={720}
				onClose={onClose}
				open={openDrawerImportNew}
				styles={{
					body: {
						paddingBottom: 80,
					},
				}}
			>
				<FormImportJobOrderNew
					onFinish={onFinishImportJobOrderNew}
					onReset={onResetJoNew}
					isLoading={uploadJobOrderNewMutation.isPending}
				/>
				{errorTableJoNew.length > 0 && (
					<TableErrorValidationInfo
						title="Terdapat data yang tidak valid pada file yang diupload. Dibawah ini merupakan keterangan sejumlah baris, kolom dan pesan kesalahannya :"
						errors={errorTableJoNew}
					/>
				)}
			</Drawer>

			<Drawer
				title="Import Job Order Acknowledge"
				width={720}
				onClose={onClose}
				open={openDrawerImportAcknowledge}
				styles={{
					body: {
						paddingBottom: 80,
					},
				}}
			>
				<FormImportJobOrderAcknowledge
					onFinish={onFinishImportJobOrderAcknowledge}
					onReset={onResetJoAcknowledge}
					isLoading={uploadJobOrderAcknowledgeMutation.isPending}
				/>
				{errorTableJoAcknowledge.length > 0 && (
					<TableErrorValidationInfo
						title="Terdapat data yang tidak valid pada file yang diupload. Dibawah ini merupakan keterangan sejumlah baris, kolom dan pesan kesalahannya :"
						errors={errorTableJoAcknowledge}
					/>
				)}
			</Drawer>
		</Page>
	)
}

export default OpenJobOrder
