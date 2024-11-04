import { Breadcrumb, Layout, Tabs, Typography } from "antd";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageLabel from "@smpm/components/pageLabel";
import { HomeOutlined, CheckSquareOutlined } from "@ant-design/icons";
import AddRequest from "./components/Add/AddRequest";
import EditRequest from "./components/Edit/EditRequest";
import DeleteRequest from "./components/Delete/DeleteRequest";

function MaintenanceIndex() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine the active tab based on the current location
  const getCurrentTab = () => {
    if (location.pathname.includes("addrequest")) return "1";
    if (location.pathname.includes("editrequest")) return "2";
    if (location.pathname.includes("deleterequest")) return "3";
    return "1"; // Default to the first tab if no match
  };

  const tabActive = getCurrentTab();

  const onChange = (key: string) => {
    switch (key) {
      case "1":
        navigate("/merchant/maintenance-merchant/addrequest");
        break;
      case "2":
        navigate("/merchant/maintenance-merchant/editrequest");
        break;
      case "3":
        navigate("/merchant/maintenance-merchant/deleterequest");
        break;
      default:
        navigate("/merchant/maintenance-merchant/addrequest");
    }
  };

  return (
    <Layout
      style={{
        backgroundColor: "white",
        padding: "30px",
      }}
    >
      <PageLabel
        title={<span className="text-2xl font-semibold">Maintenance Merchant</span>}
        subtitle={
          <Breadcrumb
            items={[
              {
                href: "/",
                title: (
                  <>
                    <HomeOutlined />
                    <span>Home</span>
                  </>
                ),
              },
              {
                href: "/merchant",
                title: (
                  <div className="flex gap-1">
                    <CheckSquareOutlined className="mb-1" />
                    <span>Merchant</span>
                  </div>
                ),
              },
              {
                href: "/merchant/maintenance",
                title: <span>Maintenance</span>,
              },
            ]}
          />
        }
      />
      <Tabs activeKey={tabActive} onChange={onChange}>
        <Tabs.TabPane key="1" tab="Request Add Merchant" />
        <Tabs.TabPane key="2" tab="Request Edit Merchant" />
        <Tabs.TabPane key="3" tab="Request Delete Merchant" />
      </Tabs>
      {tabActive === "1" && <AddRequest />}
      {tabActive === "2" && <EditRequest />}
      {tabActive === "3" && <DeleteRequest />}
    </Layout>
  );
}

export default MaintenanceIndex;