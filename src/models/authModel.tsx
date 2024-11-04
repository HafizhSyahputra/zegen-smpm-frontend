export interface IFormInputSignIn {
	email: string
	password: string
}

export interface IFormSignIn {
	onFinish?: (values: any) => void
	initialValues?: IFormInputSignIn
	isLoading?: boolean
}

export interface ISignInModel {
	access_token: string
	refresh_token: string
}
