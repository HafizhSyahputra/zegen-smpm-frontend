import { Alert, Button, Card, Flex, Result, Space } from "antd"
import { useState } from "react"

const ErrorBoundaryPage = ({ error }: { error: Error }) => {
	const [showError, setShowError] = useState<boolean>(false)

	return (
		<Flex justify="center" align="center" style={{ minHeight: "100vh" }}>
			<Card className="max-w-[80%] my-10">
				<Result
					status="error"
					title="There are some problems with your operation."
					subTitle="Please contact the administrator to fixing this issue. Sorry for the inconvenience"
					extra={
						<>
							<Space>
								<Button type="primary">Back Home</Button>
								<Button danger onClick={() => setShowError(true)}>
									Click me to show the error
								</Button>
							</Space>
							{showError && (
								<Alert
									message={error.message}
									description={error.stack}
									type="error"
									closable
									className="mt-6 text-left"
									onClose={() => setShowError(false)}
								/>
							)}
						</>
					}
				/>
			</Card>
		</Flex>
	)
}

export default ErrorBoundaryPage
