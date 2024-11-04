import React, { useState, useEffect } from "react";
import PageContent from "@smpm/components/PageContent";
import PageLabel from "@smpm/components/pageLabel";
import Page from "@smpm/components/pageTitle";
import { Breadcrumb, Card, Typography, message } from "antd";
import ListNeedApproval from "./Components/ListNeedApproval";
import TableApprove from "./Components/TableApprove";
import { useQuery } from "@tanstack/react-query";
import { approveService } from "@smpm/services/approveService";
import { ApproveItem } from "@smpm/models/approveModel";
import {
  HomeOutlined,
  CheckSquareOutlined
} from "@ant-design/icons";
const { Title } = Typography;

const Approve: React.FC = () => {
  const [needApprovalData, setNeedApprovalData] = useState<ApproveItem[]>([]);

  const {
    data: approveData,
    refetch,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["approve-data"],
    queryFn: async () => {
      try {
        const response = await approveService.findAll({
          page: 1,
          take: 100,
          order: "desc",
          order_by: "id",
          search: "",
          search_by: [],
        });
        console.log("API response:", response);
        return response;
      } catch (error) {
        console.error("API error:", error);
        throw error;
      }
    },
  });

  useEffect(() => {
    if (approveData?.result?.data) {
      const itemsNeedingApproval = approveData.result.data.filter(
        (item) => item.status === "Waiting"
      );
      console.log("Items needing approval:", itemsNeedingApproval);
      setNeedApprovalData(itemsNeedingApproval);
    }
  }, [approveData]);

  useEffect(() => {
    if (error) {
      message.error(`Failed to fetch data: ${(error as Error).message}`);
    }
  }, [error]);

  const handleApprove = async () => {
    await refetch();
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  return (
    <Page title="Approve">
      <PageLabel
        title={<span className="font-semibold text-2xl">Approve</span>}
        subtitle={
          <Breadcrumb
            items={[
              {
                href: "/dashboard",
                title: (
                  <>
                    <HomeOutlined />
                    <span>Home</span>
                  </>
                ),
              },
              {
                href: "#",
                title: (
                  <div className="flex gap-1">
                    <CheckSquareOutlined  className='mb-1'/>
                    <span>Approve</span>
                  </div>
                ),
              },
            ]}
          />
        }
      />
      <PageContent>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-3/3">
            <Card className="mb-4 lg:mb-0">
              <Title level={5} className="mb-4">
                Need Approval ({needApprovalData.length})
              </Title>
              <ListNeedApproval
                data={needApprovalData}
                onApprove={handleApprove}
              />
            </Card>
          </div>
          <div className="w-full lg:w-2/3">
            <Card>
              <Title level={5} className="mb-4">
                Approval History
              </Title>
              <TableApprove refetchData={handleApprove} />
            </Card>
          </div>
        </div>
      </PageContent>
    </Page>
  );
};

export default Approve;
