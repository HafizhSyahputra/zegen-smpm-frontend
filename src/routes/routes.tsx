import { RouteObject } from "react-router-dom"
import { lazy } from "react"
import AddRequest from "@smpm/pages/maintenance/components/Add/AddRequest"

export const GuestLayout = lazy(() => import("@smpm/components/guestLayout"))
export const SignIn = lazy(() => import("@smpm/pages/SignIn"))
export const Home = lazy(() => import("@smpm/pages/Home"))
export const Dashboard = lazy(() => import("@smpm/pages/Dashboard"))
export const Report = lazy(() => import("@smpm/pages/Report"))
export const Region = lazy(() => import("@smpm/pages/Region/Index"))
export const MerchantList = lazy(() => import("@smpm/pages/merchant/Index"))
export const Role = lazy(() => import("@smpm/pages/Role/Index"))
export const User = lazy(() => import("@smpm/pages/User/Index"))
export const Vendor = lazy(() => import("@smpm/pages/Vendor/Index"))
export const Maintenance = lazy(() => import("@smpm/pages/maintenance/Index"))
export const MaintenanceAdd = lazy(() => import("@smpm/pages/maintenance/components/Add/AddRequest"))
export const MaintenanceEdit = lazy(() => import("@smpm/pages/maintenance/components/Edit/EditRequest"))
export const MaintenanceDelete = lazy(() => import("@smpm/pages/maintenance/components/Delete/DeleteRequest"))
export const Approve = lazy(() => import("@smpm/pages/Approve/Index"))
export const Payment = lazy(() => import("@smpm/pages/Payment/Index"))
export const AddDocVendor = lazy(() => import("@smpm/pages/DocVendor/AddDocVendor"))


export const routes: RouteObject[] = [
	{
		path: "*",
		Component: lazy(() => import("@smpm/pages/Error404")),
	},
	{
		path: "auth",
		element: <GuestLayout />,
		children: [
			{
				path: "sign-in",
				element: <SignIn />,
			},
		],
	},
	{
		path: "/",
		Component: lazy(() => import("@smpm/components/adminLayout")),
		children: [
			{
				path: "home",
				element: <Home />,
			},
			{
				path: "form",
				Component: lazy(() => import("@smpm/pages/Form")),
			},
			{
				path: "dashboard",
				element: <Dashboard />,
			},
			{
				path: "approve",
				element: <Approve />,
			},
			{
				path: "inventory",
				children: [
					{
						path: "warehouse-edc",
						Component: lazy(() => import("@smpm/pages/WarehouseEDC")),
					},
					{
						path: "attached-edc",
						Component: lazy(() => import("@smpm/pages/AttachedEDC")),
					},
					{
                        path: "available-edc",
                        Component: lazy(() => import("@smpm/pages/AvailableEDC")),
                    },
					{
						path: "receive-in",
						Component: lazy(() => import("@smpm/pages/ReceiveIn")),
					},
					{
						path: "receive-out",
						Component: lazy(() => import("@smpm/pages/ReceiveOut")),
					},
					{
						path: "warehouse-edc/add",
						Component: lazy(() => import("@smpm/pages/WarehouseEDC/Add")),
					},
				],
			},
			// {
			// 	path: 'dashboard',
			// 	element: <Dashboard />
			// },
			{
				path: "Audit",
				children: [
					{
						path: "authlogs",
						Component: lazy(() => import("@smpm/pages/AuthenticationLogs/Index")),
					},
					{
						path: "syslogs",
						Component: lazy(() => import("@smpm/pages/SystemLogs/Index")),
					},
				],
			},
			{  
				path: "preview",  
				Component: lazy(() => import("@smpm/pages/Payment/PaymentInvoice")),  
			},
			{
				path: "menu-management",
				children: [
					{ path: "role", element: <Role /> },
					{ path: "user", element: <User /> },
					{ path: "region", element: <Region /> },
					{ path: "vendor", element: <Vendor /> },
				],
			},
			{
				path: "report",
				element: <Report />,
			},
			{  
				path: 'payment/unknown/:id',  
				Component: lazy(() => import('@smpm/pages/Payment/PaymentDetailPages')),  
			},  
			{  
				path: 'payment/:id',  
				Component: lazy(() => import('@smpm/pages/Payment/components/PaymentDetail')),  
			},
			{
				path: "/payment/nominal/add",
				Component: lazy(() => import("@smpm/pages/Nominal/Add")),
			},
			{
				path: "nominal",
				Component: lazy(() => import("@smpm/pages/Nominal/Index")),
			},
			{
				path: "job-order",
				children: [
					{
						path: "open",
						Component: lazy(() => import("@smpm/pages/OpenJobOrder/Index")),
					},
					{
						path: "activity",
						Component: lazy(() => import("@smpm/pages/ActivityJobOrder/Index")),
					},
					{
						path: "results",
						Component: lazy(() => import("@smpm/pages/Results/Index")),
					},
					{
						path: "activity/:no_jo",
						Component: lazy(() => import("@smpm/pages/JobOrderActivity")),
					},
					// {
					// 	path: "preventive-maintenance",
					// 	element: <JobOrderPreventiveMaintenance />,
					// },
				],
			},
			{
				path: "merchant",
				children: [
					{
						path: "list-merchant",
						element: <MerchantList />,
					},
					{
						path: "list-merchant/add",
						Component: lazy(() => import("@smpm/pages/merchant/Add")),
					},
					{
						path: "list-merchant/edit/:id",
						Component: lazy(() => import("@smpm/pages/merchant/Edit")),
					},
					{
						path: "maintenance-merchant",
						element: <Maintenance />,
						children: [
						  { path: "addrequest", element: <AddRequest /> },
						  { path: "editrequest", element: <MaintenanceEdit /> },
						  { path: "deleterequest", element: <MaintenanceDelete /> },
						],
					  },
				],
			},
			{
				path: "payment",
				element: <Payment />,
			},
			{
				path: "Document",
				children: [
					{
						path: "DocMerchant",
						Component: lazy(() => import("@smpm/pages/DocMerchant/Index")),
					},
					{
						path: "DocVendor",
						Component: lazy(() => import("@smpm/pages/DocVendor/Index")),

					},
				],
			},
			{  
				path: "job-order/timeline/:no_jo",  
				Component: lazy(() => import("@smpm/pages/Timeline/Index")),  
			},
			{  
				path: "add-doc-vendor",  
				Component: lazy(() => import("@smpm/pages/DocVendor/AddDocVendor")),  
			},
			{  
				path: "add-doc-merchant",  
				Component: lazy(() => import("@smpm/pages/DocMerchant/AddDocMerchant")),  
			},
			// {
			// 	path: "inventory",
			// 	children: [
			// 		{
			// 			path: "warehouse-edc",
			// 			element: <WarehouseEdc />,
			// 		},
			// 		{
			// 			path: "installed-edc",
			// 			element: <InstalledEdc />,
			// 		},
			// 		{
			// 			path: "receive-in",
			// 			element: <ReceiveIn />,
			// 		},
			// 		{
			// 			path: "receive-out",
			// 			element: <ReceiveOut />,
			// 		},
			// 	],
			// },
		],
	},
]
