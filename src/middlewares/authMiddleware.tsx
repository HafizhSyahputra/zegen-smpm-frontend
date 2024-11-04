import { authGetter } from "@smpm/store/authSlice"
import { FC } from "react"
import { Navigate } from "react-router-dom"
import { IProps } from "../models"
import { useSelector } from "react-redux"

const AuthMiddleware: FC<IProps> = ({ children }) => {
	const { isLogin } = useSelector(authGetter)

	return (
		<>
			{isLogin == false && <Navigate to="/auth/sign-in" replace={true} />}
			{isLogin == true && <>{children}</>}
		</>
	)
}

export default AuthMiddleware
