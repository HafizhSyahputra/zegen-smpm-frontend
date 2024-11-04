import { IProps } from "@smpm/models"

const PageContent: React.FC<IProps & { className?: string }> = ({
	children,
	className,
}) => {
	return <div className={`p-2 ${className}`}>{children}</div>
}

export default PageContent
