import "@smpm/App.css"
import ErrorBoundaryPage from "@smpm/pages/ErrorBoundaryPage/index"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConfigProvider, Spin, theme } from "antd"
import { Suspense, useState } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { BrowserRouter, useRoutes } from "react-router-dom"
import { routes } from "./routes/routes"
import { store } from "./store/store"
import { Provider } from "react-redux"
import "@smpm/App.css"

const Router = () => {
	return useRoutes(routes)
}

function App() {
	const { defaultAlgorithm, darkAlgorithm } = theme
	const [isDarkMode, setIsDarkMode] = useState<boolean>(false)

	// const toggleTheme = () => {
	// 	setIsDarkMode((previousValue) => !previousValue)
	// }

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: 1,
				retryOnMount: false,
				refetchOnWindowFocus: false,
			},
			mutations: {
				retry: false,
			},
		},
	})

	return (
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>
				<ConfigProvider
					theme={{
						algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
						token: {
							colorPrimary: "#006677",
							colorPrimaryHover: "#f08d54",
							controlItemBgActive: "rgb(0,102,119, 0.2)",
							fontFamily: "Overpass",
						},
					}}
				>
					<BrowserRouter>
						<ErrorBoundary FallbackComponent={ErrorBoundaryPage}>
							<Suspense fallback={<Spin spinning={true} fullscreen />}>
								<Router />
							</Suspense>
						</ErrorBoundary>
					</BrowserRouter>
				</ConfigProvider>
			</QueryClientProvider>
		</Provider>
	)
}

export default App
