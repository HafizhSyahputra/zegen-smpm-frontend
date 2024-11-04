
import React from "react";
import { HomeOutlined } from "@ant-design/icons";
import PageContent from "@smpm/components/PageContent";
import {
  IconBuildingSkyscraper,
  IconBuildingStore,
  IconDevicesPc,
  IconFilter,
  IconIdBadge2,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";
import { Breadcrumb, Card, Col, Row, Typography, Spin } from "antd";
import ChartEdcProfile from "./components/ChartEdcProfile";
import ChartKepemilikan from "./components/ChartKepemilikan";
import ChartPopulasiByVendor from "./components/ChartPopulasiByVendor";
import ChartEdcByWilayah from "./components/ChartEdcByWilayah";
import type { DatePickerProps } from "antd";
import { DatePicker } from "antd";
import ChartStatusPenarikan from "./components/ChartStatusPenarikan";
import ChartStatusPemasangan from "./components/ChartStatusPemasangan";
import ChartStatusPm from "./components/ChartStatusPm";
import ChartStatusCm from "./components/ChartStatusCm";
import { useQuery } from '@tanstack/react-query';
import { fetchDashboardCounts } from "@smpm/services/dashboardService";
import Page from "@smpm/components/pageTitle";
import PageLabel from "@smpm/components/pageLabel";
import { DashboardCounts } from "@smpm/models/dashboardModel";
 
const Dashboard: React.FC = () => {
  const { Title } = Typography;

  const { data: counts, isLoading, error } = useQuery<DashboardCounts, Error>({
    queryKey: ['dashboardCounts'],
    queryFn: fetchDashboardCounts
  });

  const countItems = [
    {
      today: "User Terdaftar",
      title: counts?.userCount.toString() || '0',
      icon: <IconUser />,
    },
    {
      today: "Total Group Roles",
      title: counts?.groupRolesCount.toString() || '0',
      icon: <IconUsers />,
    },
    {
      today: "Total Wilayah",
      title: counts?.wilayahCount.toString() || '0',
      icon: <IconBuildingSkyscraper />,
    },
    {
      today: "Total Vendor",
      title: counts?.vendorCount.toString() || '0',
      icon: <IconIdBadge2 />,
    },
    {
      today: "Total MID",
      title: counts?.midCount.toString() || '0',
      icon: <IconBuildingStore />,
    },
    {
      today: "Total TID",
      title: counts?.tidCount.toString() || '0',
      icon: <IconDevicesPc />,
    },
  ];

  const onChangeYear: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };

  if (isLoading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <div>Error loading dashboard data: {error.message}</div>;
  }

  return (
    <Page title="Dashboard">
      <PageLabel
        title={<span className="font-semibold text-2xl">Dashboard</span>}
        subtitle={
          <Breadcrumb
            items={[
              {
                href: "",
                title: (
                  <>
                    <HomeOutlined />
                    <span>Dashboard</span>
                  </>
                ),
              },
            ]}
          />
        }
      />
      <PageContent className={"m-5"}>
        <Row className="rowgap-vbox" gutter={[24, 0]}>
          {countItems.map((c, index) => (
            <Col
              key={index}
              xs={24}
              sm={24}
              md={12}
              lg={4}
              xl={4}
              className="mb-5"
            >
              <Card bordered={false} className="criclebox">
                <div className="number">
                  <div className="icon-box">{c.icon}</div>
                  <Row align="middle" gutter={[24, 0]}>
                    <Col xs={30}>
                      <span>{c.today}</span>
                      <Title level={3}>{c.title}</Title>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
        <Row gutter={16} className="mb-5">
          <Col span={12}>
            <Card title="EDC Profile" bordered={false} extra={<IconFilter />}>
              <ChartEdcProfile />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Kepemilikan" bordered={false} extra={<IconFilter />}>
              <ChartKepemilikan />
            </Card>
          </Col>
        </Row>
        <Row gutter={16} className="mb-5">
          <Col span={12}>
            <Card
              title="Populasi by Vendor"
              bordered={false}
              extra={<IconFilter />}
            >
              <ChartPopulasiByVendor />
            </Card>
          </Col>
          <Col span={12}>
            <Card
              title="EDC by Wilayah"
              bordered={false}
              extra={<IconFilter />}
            >
              <ChartEdcByWilayah />
            </Card>
          </Col>
        </Row>
        <Card
          title="Status Pekerjaan Vendor"
          bordered={false}
          extra={<DatePicker onChange={onChangeYear} picker="year" />}
        >
          <Row gutter={16} className="mb-5">
            <Col span={12}>
              <Card
                title="Status Pemasangan"
                bordered={false}
              >
                <ChartStatusPemasangan />
              </Card>
            </Col>
            <Col span={12}>
              <Card
                title="Status Penarikan"
                bordered={false}
              >
                <ChartStatusPenarikan />
              </Card>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Card
                title="Status PM"
                bordered={false}
              >
                <ChartStatusPm />
              </Card>
            </Col>
            <Col span={12}>
              <Card
                title="Status CM"
                bordered={false}
              >
                <ChartStatusCm />
              </Card>
            </Col>
          </Row>
        </Card>
      </PageContent>
    </Page>
  );
};

export default Dashboard;