import GuestMiddleware from "@smpm/middlewares/guestMiddleware";
import { Flex } from "antd";
import { Outlet } from "react-router-dom";

const GuestLayout = () => {
  return (
    <GuestMiddleware>
      <Flex style={{ minHeight: "100vh" }}>
        <Outlet />
      </Flex>
    </GuestMiddleware>
  );
};

export default GuestLayout;
