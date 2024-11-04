import PageContent from "@smpm/components/PageContent";
import PageLabel from "@smpm/components/pageLabel";
import Page from "@smpm/components/pageTitle";
import { IconWashMachine } from "@tabler/icons-react";
import { Breadcrumb, Card, Divider, Flex, Typography } from "antd";
import TableEDC from "./components/TableEDC";

const { Title } = Typography;

const AvailableEDC = () => {
  return (
    <Page title={"EDC Tersedia"}>
      <PageLabel
        title={<span className="font-semibold text-2xl">EDC Tersedia</span>}
        subtitle={
          <Breadcrumb
            items={[
              {
                href: "",
                title: (
                  <Flex align={"end"}>
                    <IconWashMachine />
                    <span>EDC Tersedia</span>
                  </Flex>
                ),
              },
            ]}
          />
        }
      />
      <PageContent>
        <Card>
          <Flex justify="space-between" align="flex-end">
            <Title level={3}>EDC Tersedia</Title>
          </Flex>
          <Divider />
          <TableEDC />
        </Card>
      </PageContent>
    </Page>
  );
};

export default AvailableEDC;