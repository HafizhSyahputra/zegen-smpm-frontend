// src/pages/Add.tsx

import FormFieldEDC from "@smpm/components/FormFields/FormFieldEDC";
import FormWrapper from "@smpm/components/FormWrapper";
import PageContent from "@smpm/components/PageContent";
import PageLabel from "@smpm/components/pageLabel";
import Page from "@smpm/components/pageTitle";
import { createDataEDC } from "@smpm/services/edcService";
import { IconWashMachine } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { Alert, Breadcrumb, Button, Card, Flex } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface EDCFormData {
  mid: string;
  tid: string;
  serial_number: string;
  brand: string;
  brand_type: string;
  region?: string;
  status_owner: string;
  owner_id: number;
  status_owner_desc?: string;
  status_machine?: string;
  status_machine_desc?: string;
  status_active: boolean;
  simcard_provider?: string;
  simcard_number?: string;
  status_edc?: string;
  info?: string;
}

const Add = () => {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const addMutation = useMutation({
    mutationFn: createDataEDC,
    onError: (error: any) => {
      const errorMessage = error.response?.data?.status?.description || 
        "Terjadi kesalahan saat menambahkan EDC.";
      setFormError(errorMessage);
    },
    onSuccess: () => {
      navigate("/inventory/warehouse-edc");
    },
  });

  const onFinish = (values: EDCFormData) => {
    setFormError(null);

    // Pastikan semua field yang diperlukan ada
    const payload = {
      ...values,
      status_active: values.status_active ?? true,
      status_machine_desc: values.status_machine_desc || "oke",
    };

    addMutation.mutate(payload);
  };

  return (
    <Page title="Add New EDC">
      <PageLabel
        title={<span className="text-2xl font-semibold">Add New EDC</span>}
        subtitle={
          <Breadcrumb
            items={[
              {
                href: "/inventory/warehouse-edc",
                title: (
                  <Flex align="end">
                    <IconWashMachine />
                    <span>Warehouse EDC</span>
                  </Flex>
                ),
              },
              {
                title: (
                  <Flex align="end">
                    <span>Add New EDC</span>
                  </Flex>
                ),
              },
            ]}
          />
        }
      />
      <PageContent>
        <Card title="Add New EDC">
          {formError && (
            <Alert
              message="Error"
              description={formError}
              type="error"
              showIcon
              closable
              style={{ marginBottom: 16 }}
              onClose={() => setFormError(null)}
            />
          )}
          <FormWrapper onFinish={onFinish}>
            <FormFieldEDC />
            <Button
              type="primary"
              htmlType="submit"
              loading={addMutation.isPending}
              style={{ marginTop: 16 }}
            >
              Submit
            </Button>
          </FormWrapper>
        </Card>
      </PageContent>
    </Page>
  );
};
export default Add;