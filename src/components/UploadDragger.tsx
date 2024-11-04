import { InboxOutlined } from "@ant-design/icons"
import { Upload } from "antd"
import React, { useEffect, useState } from "react"

const { Dragger } = Upload

type UploadDraggerProps = {
	onChange?: any
	defaultList?: any
	maxCount?: number
	uploadText?: string
	uploadHint?: string
}

const UploadDragger: React.FC<UploadDraggerProps> = ({
	onChange,
	defaultList = [],
	maxCount = 5,
	uploadText = "Klik Atau Tarik File",
	uploadHint = "File yang support hanya png, jpg, jpeg, xls, xlsx, doc, docx, ppt, pptx, pdf dan ukuran max. file adalah 10MB",
}) => {
	const [fileList, setFileList] = useState(defaultList)

	useEffect(() => {
		onChange(fileList)
		setFileList(fileList)
	}, [fileList])

	return (
		<Dragger
			multiple
			customRequest={undefined}
			maxCount={maxCount}
			fileList={fileList}
			onChange={({ file, fileList, event }) => {
				let files = []
				fileList.map((data) => {
					files.push({
						...data,
						status: "done",
					})
				})
				setFileList(files)
			}}
		>
			<p className="ant-upload-drag-icon">
				<InboxOutlined />
			</p>
			<p className="ant-upload-text">{uploadText}</p>
			<p className="ant-upload-hint">{uploadHint}</p>
		</Dragger>
	)
}

export default UploadDragger
