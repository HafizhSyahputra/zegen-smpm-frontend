// src/pages/AttachedEDC.tsx

import { useState } from "react";
import PageContent from "@smpm/components/PageContent";
import PageLabel from "@smpm/components/pageLabel";
import Page from "@smpm/components/pageTitle";
import { IconWashMachine } from "@tabler/icons-react";
import { Breadcrumb, Card, Divider, Flex, Typography } from "antd";
import TableEDC from "./components/TableEDC";
import FilterEDC from "./components/FilterEdc";
 
const { Title } = Typography;

const AttachedEDC = () => {
  const [filters, setFilters] = useState<any>({});

  const handleFilter = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <Page title={"EDC Terpasang"}>
      <PageLabel
        title={<span className="text-2xl font-semibold">EDC Terpasang</span>}
        subtitle={
          <Breadcrumb
            items={[
              {
                href: "",
                title: (
                  <Flex align={"end"}>
                    <IconWashMachine />
                    <span>EDC Terpasang</span>
                  </Flex>
                ),
              },
            ]}
          />
        }
      />
      <PageContent>
        <Card>
          <Title level={3}>Filter EDC</Title>
          <Divider />
          {/* Tambahkan Komponen FilterEDC */}
          <FilterEDC onFilter={handleFilter} />
          <Divider />
          {/* Pass filters sebagai prop ke TableEDC */}
          <TableEDC filters={filters} />
        </Card>
      </PageContent>
    </Page>
  );
};

export default AttachedEDC;