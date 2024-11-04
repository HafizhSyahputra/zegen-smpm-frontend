
import { HomeOutlined } from "@ant-design/icons";
import PageContent from "@smpm/components/PageContent";
import PageLabel from "@smpm/components/pageLabel";
import Page from "@smpm/components/pageTitle";
import { IconSortDescendingNumbers } from "@tabler/icons-react";
import { Breadcrumb, Card } from "antd";
import { useState } from 'react';
import FilterTableResults from "./components/FilterTableResults";
import TableResults from "./components/TableResults";

const Results = () => {
   const [filter, setFilter] = useState({});

  return (
    <Page title="Results">
      <PageLabel
        title={<span className="font-semibold text-2xl">Results Job Order</span>}
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
                    <IconSortDescendingNumbers size="1rem" />
                    <span>Results Job Order</span>
                  </div>
                ),
              },
              {
                title: "Results List",
              },
            ]}
          />
        }
      />
      <PageContent>
        <Card>
          <FilterTableResults
            onFinish={(values) => {
              setFilter(values);
            }}
          />
          <TableResults filter={filter} />
        </Card>
      </PageContent>
    </Page>
  );
};

export default Results;
