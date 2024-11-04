import { findJobOrder } from "@smpm/services/jobOrderService"
import { useQuery } from "@tanstack/react-query"
import {
	Col,
	Descriptions,
	DescriptionsProps,
	Divider,
	Input,
	Row,
	Skeleton,
	Typography,
	message,
} from "antd"
import moment from "moment"
import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const { TextArea } = Input
const { Title } = Typography

const INFORMASI_PENUGASAN: DescriptionsProps["items"] = [
	{
		key: "1",
		label: "Target Kedatangan",
		labelStyle: { fontWeight: 700, fontSize: 15 },
		children: moment().format("DD MMMM YYYY HH:mm"),
	},
	{
		key: "2",
		label: "Jatuh Tempo",
		labelStyle: { fontWeight: 700, fontSize: 15 },
		children: moment().add(2, "hour").format("DD MMMM YYYY HH:mm"),
	},
	{
		key: "3",
		label: "Bank",
		labelStyle: { fontWeight: 700, fontSize: 15 },
		children: "PT. Bank Negara Indonesia ",
	},
	{
		key: "4",
		label: "No SPK/Case",
		labelStyle: { fontWeight: 700, fontSize: 15 },
		children: "IN-2303813908",
	},
	{
		key: "5",
		label: "Title",
		labelStyle: { fontWeight: 700, fontSize: 15 },
		children: "ZSM/1000073979201/FMS/BNI",
	},
	{
		key: "6",
		label: "Case Type",
		labelStyle: { fontWeight: 700, fontSize: 15 },
		children: "Request",
	},
	{
		key: "7",
		label: "Tipe Penugasan",
		labelStyle: { fontWeight: 700, fontSize: 15 },
		children: "Installation",
	},
	{
		key: "8",
		label: "Service Point",
		labelStyle: { fontWeight: 700, fontSize: 15 },
		children: "Cilegon",
	},
]

const MERCHANT_DATA: DescriptionsProps["items"] = [
	{
		key: 1,
		label: "Nama",
		labelStyle: { fontWeight: 700, fontSize: 15 },
		children: "FAVE KITCHEN CILEGON MBL",
	},
	{
		key: 2,
		label: "Alamat Penugasan",
		labelStyle: { fontWeight: 700, fontSize: 15 },
		children: `FAVE KITCHEN CILEGON TAMAN
        KRAKATAU RUKO
         BLOK L NO 1 SERDANG KRAMATWATU
        SERANG`,
	},
	{
		key: 3,
		label: "Kota & Kode Pos",
		labelStyle: { fontWeight: 700, fontSize: 15 },
		children: `SERANG (KOTA), 42453`,
	},
	{
		key: 4,
		label: "Propinsi",
		labelStyle: { fontWeight: 700, fontSize: 15 },
		children: `Indonesia`,
	},
	{
		key: 5,
		label: "Contact Person",
		labelStyle: { fontWeight: 700, fontSize: 15 },
		children: `VENI HENDRIYANTI`,
	},
	{
		key: 6,
		label: "Telepon",
		labelStyle: { fontWeight: 700, fontSize: 15 },
		children: `0210000/082124807980`,
	},
]

const TERMINAL_DATA: DescriptionsProps["items"] = [
	{
		key: 1,
		label: "MID",
		labelStyle: { fontWeight: 700, fontSize: 15 },
		children: `71149366964`,
	},
	{
		key: 2,
		label: "TID",
		labelStyle: { fontWeight: 700, fontSize: 15 },
		children: `74754629`,
	},
	{
		key: 3,
		label: "CSI",
		labelStyle: { fontWeight: 700, fontSize: 15 },
		children: `-`,
	},
]

type InfoPenugasanProps = {
	hide?: boolean
	no_jo: string
}

const InfoPenugasan: React.FC<InfoPenugasanProps> = ({ hide, no_jo }) => {
	const navigate = useNavigate()

	const { data, isLoading, isSuccess, isError } = useQuery({
		queryKey: ["assigment-info", no_jo],
		queryFn: () => findJobOrder(no_jo),
	})

	useEffect(() => {
		if (isError) {
			message.error("NO. JO tidak ditemukan")
			navigate("/job-order/activity", {
				replace: true,
			})
		}
	}, [isError])

	if (isLoading) return <Skeleton active />

	if (isSuccess) {
		INFORMASI_PENUGASAN[0].children = moment(data.result.date).format(
			"DD MMMM YYYY HH:mm"
		)
		INFORMASI_PENUGASAN[1].children = moment(data.result.date)
			.add(1, "day")
			.format("DD MMMM YYYY HH:mm")
		INFORMASI_PENUGASAN[2].children = data.result.vendor.name
		INFORMASI_PENUGASAN[3].children = "-"
		INFORMASI_PENUGASAN[4].children = "-"
		INFORMASI_PENUGASAN[5].children = "Request"
		INFORMASI_PENUGASAN[6].children = data.result.type
		INFORMASI_PENUGASAN[7].children = "-"

		MERCHANT_DATA[0].children = data.result.merchant_name
		MERCHANT_DATA[1].children = `${data.result.address1}\n${data.result.address2}\n${data.result.address3}\n${data.result.address4}`
		MERCHANT_DATA[2].children = `${data.result.city} ${data.result.postal_code}`
		MERCHANT_DATA[3].children = "Indonesia"
		MERCHANT_DATA[4].children = data.result.pic
		MERCHANT_DATA[5].children = data.result.phone_number1

		TERMINAL_DATA[0].children = data.result.mid
		TERMINAL_DATA[1].children = data.result.tid
		TERMINAL_DATA[2].children = "-"
	}

	return (
		<div style={{ display: hide ? "none" : "block" }}>
			<Row gutter={16}>
				<Col xs={24} md={12}>
					<Descriptions
						column={{
							xs: 1,
							md: 1,
						}}
						title="Informasi Penugasan"
						size={"small"}
						layout={"vertical"}
						items={INFORMASI_PENUGASAN}
					/>
				</Col>
				<Col xs={24} md={12}>
					<Descriptions
						column={{
							xs: 1,
							md: 1,
						}}
						title="Data Merchant"
						size={"small"}
						layout={"vertical"}
						items={MERCHANT_DATA}
					/>
				</Col>
			</Row>
			<Divider />
			<Row>
				<Col xs={24}>
					<Descriptions
						column={{
							xs: 1,
							md: 2,
						}}
						title="Informasi Terminal"
						size={"small"}
						layout={"vertical"}
						items={TERMINAL_DATA}
					/>
				</Col>
			</Row>
		</div>
	)
}

export default InfoPenugasan
