import AuthMiddleware from "@smpm/middlewares/authMiddleware";
import { App, Layout } from "antd";
import { Content, Footer } from "antd/es/layout/layout";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./navigation";
import PageLoading from "./PageLoading";

const AdminLayout = () => {
  return (
    <AuthMiddleware>
      <App>
        <Layout style={{ minHeight: "100vh" }}>
          <Navigation>
            <Content className="min-h-screen">
              <Suspense fallback={<PageLoading />}>
                <Outlet />
              </Suspense>
            </Content>
            <Footer
              className="flex justify-between text-xs md:text-md bg-white"
              style={{
                paddingLeft: 12,
                paddingRight: 12,
                paddingBottom: 10,
              }}
            >
              <span>Sistem Monitoring Pemeliharaan Merchant</span>
              <div>
                <span className="font-bold">
                  {" "}
                  PT. Bank Negara Indonesia (Persero) Tbk,
                </span>
                All rights reserved.
              </div>
            </Footer>
          </Navigation>
        </Layout>
      </App>
    </AuthMiddleware>
  );
};

export default AdminLayout;
