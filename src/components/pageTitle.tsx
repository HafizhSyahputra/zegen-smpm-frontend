import { IProps } from "@smpm/models"
import { Helmet } from "react-helmet"

interface IPage extends IProps {
	title: string
}

const Page: React.FC<IPage> = ({ title, children }) => {
	return (
		<>
			<Helmet>
				<title>{title}</title>
			</Helmet>
			{children}
		</>
	)
}

export default Page
