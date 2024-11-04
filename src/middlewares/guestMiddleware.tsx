import { authGetter } from "@smpm/store/authSlice"
import { FC } from "react"
import { Navigate } from "react-router-dom"
import { IProps } from "../models"
import { useSelector } from "react-redux"

const GuestMiddleware: FC<IProps> = ({ children }) => {
	const { isLogin } = useSelector(authGetter)

	return (
		<>
			{isLogin == true && <Navigate to="/dashboard" replace={true} />}
			{isLogin == false && <>{children}</>}
		</>
	)
}

export default GuestMiddleware
