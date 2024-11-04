import axios, { InternalAxiosRequestConfig } from "axios"

const BASE_URL = import.meta.env.VITE_BACKEND_URL

const request = axios.create({
	baseURL: `${BASE_URL}/`,
	headers: {
		"Content-type": "application/json",
	},
})

request.interceptors.request.use(
	async (config: InternalAxiosRequestConfig) => {
		config.headers!["Authorization"] = `Bearer ${localStorage.getItem(
			"nekotssecca"
		)}`
		config.headers!["Module"] = document.title
		return config
	},
	(err) => {
		return Promise.reject(err)
	}
)

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token = null, refreshToken = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error)
		} else {
			prom.resolve(token, refreshToken)
		}
	})

	failedQueue = []
}

request.interceptors.response.use(
	async (response) => {
		return response
	},
	async (err) => {
		const originalConfig = err.config
		if (err.response?.status === 401 && !originalConfig._retry) {
			if (isRefreshing) {
				try {
					const token = await new Promise(function (resolve, reject) {
						failedQueue.push({ resolve, reject })
					})
					originalConfig.headers["Authorization"] = "Bearer " + token
					return await axios(originalConfig)
				} catch (err_1) {
					return await Promise.reject(err_1)
				}
			}
			originalConfig._retry = true
			isRefreshing = true
			return new Promise(function (resolve, reject) {
				axios
					.post(
						`${BASE_URL}/auth/refresh-token`,
						{
							token: localStorage.getItem("nekotssecca"),
							refreshToken: decodeURIComponent(
								localStorage.getItem("nekothserfer") as string
							),
						},
						{
							headers: { "Content-Type": "application/json" },
						}
					)
					.then((response) => {
						localStorage.removeItem("nekotssecca")
						localStorage.removeItem("nekothserfer")
						axios.defaults.headers.common["Authorization"] =
							"Bearer " + response.data?.data?.token
						originalConfig.headers["Authorization"] =
							"Bearer " + response.data?.data?.token
						processQueue(
							null,
							response.data?.data?.token,
							response.data?.data?.refreshToken
						)
						resolve(axios(originalConfig))
					})
					.catch((err) => {
						processQueue(err, null, null)
						localStorage.removeItem("nekotssecca")
						localStorage.removeItem("nekothserfer")
						window.location.href = "/auth/sign-in"
						reject(err)
					})
					.then(() => {
						isRefreshing = false
					})
			})
		} else {
			return Promise.reject(err)
		}
	}
)

export default request
