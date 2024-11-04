import { IBaseResponseService, IErrorResponseService } from "@smpm/models"
import { IFormInputSignIn, ISignInModel } from "@smpm/models/authModel"
import { signIn } from "@smpm/services/authService"
import { makeResponseServiceError } from "@smpm/utils"
import { useMutation } from "@tanstack/react-query"
import { Card, Flex, Space, Typography } from "antd"
import { AxiosError } from "axios"
import { useDispatch } from "react-redux"
import FormSignIn from "./components/formSignIn"
import { signInReducer } from "@smpm/store/authSlice"

const Text = Typography.Text

const SignIn = () => {
	const dispatch = useDispatch()

	const signInMutation = useMutation<
		IBaseResponseService<ISignInModel>,
		AxiosError<IBaseResponseService<IErrorResponseService>>,
		IFormInputSignIn
	>({
		mutationFn: (data: IFormInputSignIn) => signIn(data),
	})

	const onFinish = (values: IFormInputSignIn) => {
		signInMutation.mutate(values, {
			onSuccess: (res) => {
				dispatch(
					signInReducer({
						token: res.result.access_token,
						refresh_token: res.result.refresh_token,
					})
				)
			},
			onError: (err) => {
				makeResponseServiceError(dispatch, "sign-in", err)
			},
		})
	}

	return (
		<Flex justify="center" align="center" className="w-full">
			<Card className="p-4 sm:w-[90%] lg:w-[30%] shadow-md">
				<Space direction="vertical">
					<img
						src="/images/bni-logo.svg"
						alt="Logo BNI"
						className="w-[50%] h-auto object-contain mb-8"
					/>
					<Text type="secondary">
						Enter your username and password to log in to your dashboard
					</Text>
					<FormSignIn onFinish={onFinish} isLoading={signInMutation.isPending} />
				</Space>
			</Card>
		</Flex>
	)
}

export default SignIn
