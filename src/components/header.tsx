import {
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	UserOutlined,
  } from "@ant-design/icons";
  import { IBaseResponseService, IErrorResponseService } from "@smpm/models";
  import { signOut } from "@smpm/services/authService";
  import { signOutReducer } from "@smpm/store/authSlice";
  import { makeResponseServiceError } from "@smpm/utils";
  import { IconBell, IconLogout2 } from "@tabler/icons-react";
  import { useMutation } from "@tanstack/react-query";
  import { Avatar, Badge, Layout, Dropdown } from "antd";
  import { AxiosError } from "axios";
  import { useMemo, useState } from "react";
  import { useDispatch } from "react-redux";
import NotificationSidebar from "./Notifications/NotificationSidebar";
   
  interface IHeader {
	collapsed: boolean;
	toggle: () => void;
	className: string;
  }
  
  const Header: React.FC<IHeader> = ({ collapsed = true, toggle, className }) => {
	const dispatch = useDispatch();
	const notifications = [
	  {
		title: "File Upload Confirmation",
		description: 'You have successfully uploaded a document on "Open Job Order"',
		time: "11:29 PM",
		category: "Open Job Order",
	  },
	  {
		title: "File Upload Confirmation",
		description: 'You have successfully uploaded a document on "Open Job Order"',
		time: "11:29 PM",
		category: "Open Job Order",
	  },
	  {
		title: "File Upload Confirmation",
		description: 'You have successfully uploaded a document on "Open Job Order"',
		time: "11:29 PM",
		category: "Open Job Order",
	  },
	];
  
	const isCollapsed = useMemo(() => {
	  return collapsed ? (
		<MenuUnfoldOutlined onClick={toggle} className="text-white" />
	  ) : (
		<MenuFoldOutlined onClick={toggle} className="text-white" />
	  );
	}, [collapsed, toggle]);
  
	const signOutMutation = useMutation<
	  IBaseResponseService<null>,
	  AxiosError<IBaseResponseService<IErrorResponseService>>
	>({
	  mutationFn: () => signOut(),
	});
  
	const handleClickDropdown = (e: any) => {
	  if (e?.key === "sign-out") {
		signOutMutation.mutate(undefined, {
		  onSuccess: () => {
			dispatch(signOutReducer());
		  },
		  onError: (err) => {
			makeResponseServiceError(dispatch, "sign-out", err);
		  },
		});
	  }
	};
  
	const [openSidebar, setOpenSidebar] = useState(false);
  
	const handleBellClick = () => {
	  setOpenSidebar(!openSidebar); // Toggle sidebar open/close
	};
  
	return (
	  <>
		<Layout.Header className={`w-full left-0 top-0 px-5 my-auto text-lg ${className}`}>
		  <div className="flex items-center justify-between h-full">
			<div className="flex items-center h-full space-x-5">
			  {isCollapsed}
			  <a href="/home">
				<img src="/images/bni-logo2.png" alt="Logo BNI" className="h-[30px] mt-2" />
			  </a>
			</div>
			<div className="flex items-center space-x-4">
			  <Badge count={notifications.length} size="small" className="mt-3">
				<Avatar shape="square" icon={<IconBell />} onClick={handleBellClick} />
			  </Badge>
  
			  <Dropdown
				menu={{
				  onClick: handleClickDropdown,
				  items: [
					{
					  icon: <IconLogout2 size="1rem" />,
					  key: "sign-out",
					  label: "Logout",
					},
				  ],
				}}
				placement="bottomRight"
			  >
				<div className="flex justify-between items-center text-white text-sm cursor-pointer px-3 gap-3 hover:bg-slate-700 h-[46px]">
				  <Avatar style={{ backgroundColor: "#fde3cf", color: "#f56a00" }} icon={<UserOutlined />} />
				  <div className="flex flex-col justify-center">
					<span className="font-bold">Ahrul Syamil</span>
					<span className="text-xs font-thin">Superadmin</span>
				  </div>
				</div>
			  </Dropdown>
			</div>
		  </div>
		</Layout.Header>
  
		{/* NotificationSidebar Component */}
		<NotificationSidebar 
		  notifications={notifications} 
		  open={openSidebar} 
		  onClose={() => setOpenSidebar(false)} 
		/>
	  </>
	);
  };
  
  export default Header;
  