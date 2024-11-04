import { IAppContext } from "@smpm/models/contextModel"
import React from "react"

export const AppContext = React.createContext<IAppContext>({
	sidebarCollapsed: false,
	toggleSidebarCollapsed: () => {},
	errorValidation: {},
	setErrorValidation: () => {},
})
