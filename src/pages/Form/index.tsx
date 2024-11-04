import FormFieldProduct, {
  FormFieldProductProps,
} from "@smpm/components/FormFields/FormFieldProduct";
import FormFieldSignin, {
  FormFieldSigninProps,
} from "@smpm/components/FormFields/FormFieldSignin";
import FormWrapper from "@smpm/components/FormWrapper";
import PageContent from "@smpm/components/PageContent";
import PageLabel from "@smpm/components/pageLabel";
import Page from "@smpm/components/pageTitle";
import { IconForms } from "@tabler/icons-react";
import { Breadcrumb, Button, Card, Divider, Flex } from "antd";

const FormPage = () => {
  return (
    <Page title={"Form Sample"}>
      <PageLabel
        title={<span className="font-semibold text-2xl">Form Sample</span>}
        subtitle={
          <Breadcrumb
            items={[
              {
                href: "",
                title: (
                  <Flex align={"end"} gap={5}>
                    <IconForms />
                    <span>Form Sample</span>
                  </Flex>
                ),
              },
            ]}
          />
        }
      />
      <PageContent>
        <Card>
          <FormWrapper<FormFieldSigninProps & FormFieldProductProps>
            onFinish={console.log}
          >
            <FormFieldSignin />
            <Divider />
            <FormFieldProduct />
            <Button htmlType={"submit"}>Submit</Button>
          </FormWrapper>
        </Card>
      </PageContent>
    </Page>
  );
};

export default FormPage;
