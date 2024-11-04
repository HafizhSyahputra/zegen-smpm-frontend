export interface IAuthContext {
	isLogin: boolean
}

export interface IAppContext {
	sidebarCollapsed: boolean
	toggleSidebarCollapsed: () => void
	errorValidation: any
	setErrorValidation: (err: any) => void
}
