import { Flex, Spin } from "antd"

const LoadingPage = () => {
	return (
		<Flex>
			<>
				<Spin tip="Loading...">
					<div className="content"></div>
				</Spin>
			</>
		</Flex>
	)
}

export default LoadingPage
