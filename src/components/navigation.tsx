import { IProps } from "@smpm/models";  
import { appGetter, toggleSidebarCollapsed } from "@smpm/store/appSlice";  
import {  
  IconBuildingStore,  
  IconCalculator,  
  IconChartInfographic,  
  IconReportAnalytics,  
  IconSortDescendingNumbers,  
  IconUsersGroup,  
  // IconFile,  
  IconCurrencyDollar,  
  IconCheckbox,
  // IconHistory,  
  IconFileSearch,
  IconFileHorizontal,
  IconNews
} from "@tabler/icons-react";  
import { Layout, Menu, MenuProps } from "antd";  
import React, { useMemo, useState, useEffect } from "react";  
import { useDispatch, useSelector } from "react-redux";  
import { useMediaQuery } from "react-responsive";  
import Header from "./header";  
import Sidebar from "./sideBar";  
import { useNavigate } from "react-router-dom";  

type MenuItem = Required<MenuProps>["items"][number];  

function getItem(  
  label: React.ReactNode,  
  key: React.Key,  
  icon?: React.ReactNode,  
  children?: MenuItem[],  
  type?: "group"  
): MenuItem {  
  return {  
    key,  
    icon,  
    children,  
    label,  
    type,  
  } as MenuItem;  
}  

const items: MenuItem[] = [  
  getItem("Dashboard", "dashboard", <IconChartInfographic size="1.2rem" />),   
  getItem(  
    "Job Order",  
    "job-order",  
    <IconSortDescendingNumbers size="1.2rem" />,  
    [  
      getItem("Open Job Order", "job-order/open"),  
      getItem("Activity Job Order", "job-order/activity"),  
      getItem("Results Job Order", "job-order/results"),  
    ]  
  ),  
  getItem("Merchant", "merchant", <IconBuildingStore size="1.2rem" />, [  
    getItem("List Merchant", "merchant/list-merchant"),  
    getItem("Maintenance Merchant", "merchant/maintenance-merchant"),  
  ]),  
  getItem("Inventory", "inventory", <IconCalculator size="1.2rem" />, [  
    getItem("Warehouse EDC", "inventory/warehouse-edc"),  
    getItem("EDC Terpasang", "inventory/attached-edc"),  
    // getItem("EDC Tersedia", "inventory/available-edc"),  
    getItem("Receive In", "inventory/receive-in"),  
    getItem("Receive Out", "inventory/receive-out"),  
  ]),  
  getItem("Report", "report", <IconReportAnalytics size="1.2rem" />),  
  getItem("Document", "document", <IconFileHorizontal size="1.2rem" />, [  
    getItem("Merchant", "document/DocMerchant"),  
    getItem("Vendor", "document/DocVendor"),  
  ]),     
  getItem("Payment", "Payment", <IconCurrencyDollar size="1.2rem" />, [  
    getItem("Payment", "payment", ),  
    getItem("Nominal", "nominal", ),  
  ]),      
  getItem("Approve", "approve", <IconCheckbox size="1.2rem" />), 
  getItem(  
    "User Management",  
    "menu-management",  
    <IconUsersGroup size="1.2rem" />,  
    [  
      getItem("Role", "menu-management/role"),  
      getItem("User", "menu-management/user"),  
      getItem("Wilayah", "menu-management/region"),  
      getItem("Vendor", "menu-management/vendor"),  
    ]  
  ),   
  getItem(  
    "Audit Trail",  
    "audit",  
    <IconFileSearch size="1.2rem" />,  
    [  
      getItem("Authentication Logs", "audit/authlogs"),  
      getItem("System Logs", "audit/syslogs"),  
    ]  
  ),
  getItem("Berita dan Acara", "berita", <IconNews size="1.2rem" />),

];  


const rootSubmenuKeys = ["sub1", "sub2", "sub4"];  

const Navigation: React.FC<IProps> = ({ children }) => {  
  const isDesktopOrLaptop = useMediaQuery({ minWidth: 1224 });  
  const isMedium = useMediaQuery({ minWidth: 768, maxWidth: 1223 });  
  const { sidebarCollapsed } = useSelector(appGetter);  
  const dispatch = useDispatch();  
  const navigate = useNavigate();  

  const [openKeys, setOpenKeys] = useState(["sub1"]);  
  const [localCollapsed, setLocalCollapsed] = useState(sidebarCollapsed);  

  useEffect(() => {  
    setLocalCollapsed(sidebarCollapsed);  
  }, [sidebarCollapsed]);  

  const transformWidth = useMemo(() => {  
    if (isDesktopOrLaptop) {  
      return localCollapsed ? 50 : 250;  
    }  
    if (isMedium) {  
      return localCollapsed ? 0 : 200;  
    }  
    return 0;  
  }, [localCollapsed, isDesktopOrLaptop, isMedium]);  

  const onOpenChange: MenuProps["onOpenChange"] = (keys) => {  
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);  
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {  
      setOpenKeys(keys);  
    } else {  
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);  
    }  
  };  

  const handleCollapse = (collapsed: boolean) => {  
    setLocalCollapsed(collapsed);  
    dispatch(toggleSidebarCollapsed());  
  };  

  return (  
    <>  
      <Header  
        collapsed={localCollapsed}  
        toggle={() => handleCollapse(!localCollapsed)}  
        className="fixed z-50 h-[46px]"  
      />  
      <Layout>  
        <Sidebar   
          collapsed={localCollapsed}   
          onCollapse={handleCollapse}  
          className="md:relative z-40"  
        >  
          <Menu  
            mode="inline"  
            openKeys={openKeys}  
            onOpenChange={onOpenChange}  
            items={items}  
            onClick={({ key }) => {  
              navigate(key);  
              if (isMedium) {  
                handleCollapse(true);  
              }  
            }}  
          />  
          <div className="h-36" />  
        </Sidebar>  
        <Layout  
          className="mt-[46px] h-full"  
          style={{  
            marginLeft: transformWidth,  
            transition: "0.3s",  
          }}  
        >  
          {children}  
        </Layout>  
      </Layout>  
    </>  
  );  
};  

export default Navigation;