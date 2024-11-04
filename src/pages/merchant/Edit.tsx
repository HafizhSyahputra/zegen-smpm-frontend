import FormFieldMerchant, {
  TFormFieldMerchant,
} from "@smpm/components/FormFields/FormFieldMerchant";
import FormWrapper from "@smpm/components/FormWrapper";
import PageContent from "@smpm/components/PageContent";
import PageLabel from "@smpm/components/pageLabel";
import Page from "@smpm/components/pageTitle";
import {
  getDataMerchantById,
  updateDataMerchant,
} from "@smpm/services/merchantService";
import { IconWashMachine } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Breadcrumb, Button, Card, Flex, notification } from "antd";
import { useNavigate, useParams } from "react-router-dom";

const Edit = () => {
  const { id: merchantId } = useParams();
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const editMutation = useMutation({
    mutationFn: updateDataMerchant,
  });

  const onFinish = (data: TFormFieldMerchant) => {
    editMutation.mutate(
      {
        ...data, region_id: data.region_id?.id, id: +String(merchantId),
        file1: undefined,
        file2: undefined
      },
      {
        onSuccess: () => {
          api["success"]({
            message: "Success Update Merchant and is waiting for approval.",
          });
          navigate("/merchant/list-merchant");
        },
        onError: () => {
          api.error({
            message: "Something went wrong.",
          });
        },
      }
    );
  };

  const {
    data: merchant,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["merchant", merchantId],
    // @ts-ignore
    queryFn: () => getDataMerchantById(+merchantId),
  });

  // const initialValue = useMemo((): IMerchantModel => {
  //   return {
  //     id: merchant?.result.id,
  //     region_id: merchant?.result.region_id,
  //     mid: merchant?.result.mid,
  //     name: merchant?.result.name,
  //     category: merchant?.result.category,
  //     customer_name: merchant?.result.customer_name,
  //     telephone: merchant?.result.telephone,
  //     pic: merchant?.result.pic,
  //     phone1: merchant?.result.phone1,
  //     phone2: merchant?.result.phone2,
  //     address1: merchant?.result.address1,
  //     address2: merchant?.result.address2,
  //     address3: merchant?.result.address3,
  //     address4: merchant?.result.address4,
  //     district: merchant?.result.district,
  //     subdistrict: ,
  //     city: "",
  //     province: "",
  //     postal_code: "",

  //     created_by: 1,
  //     updated_by: 1,
  //     created_at: "",
  //     updated_at: "",
  //     deleted_at: "",
  //   };
  // }, [merchant]);

  return (
    <>
      {contextHolder}
      <Page title={"Edit Merchant"}>
        <PageLabel
          title={<span className="font-semibold text-2xl">Edit Merchant</span>}
          subtitle={
            <Breadcrumb
              items={[
                {
                  href: "/merchant/list-merchant",
                  title: (
                    <Flex align={"end"}>
                      <IconWashMachine />
                      <span>List Merchant</span>
                    </Flex>
                  ),
                },
                {
                  href: "",
                  title: (
                    <Flex align={"end"}>
                      <span>Edit Merchant</span>
                    </Flex>
                  ),
                },
              ]}
            />
          }
        />
        <PageContent>
          {" "}
          {isSuccess ? (
            <FormWrapper onFinish={onFinish}>
              <Card title={"Edit Merchant"}>
                <FormFieldMerchant
                  initialValues={{
                    id: merchant?.result?.id,
                    region_id: merchant?.result?.region_id,
                    // region_id: {
                    //   id: merchant?.result?.region_id,
                    //   name: merchant?.result?.region?.name || "",
                    //   code: merchant?.result?.region?.code || "",
                    //   description: merchant?.result?.region?.description || "",
                    // },
                    // mid: merchant?.result?.mid,
                    name: merchant?.result?.name,
                    category: merchant?.result?.category,
                    customer_name: merchant?.result?.customer_name,
                    telephone: merchant?.result?.telephone,
                    pic: merchant?.result?.pic,
                    phone1: merchant?.result?.phone1,
                    phone2: merchant?.result?.phone2,
                    address1: merchant?.result?.address1,
                    address2: merchant?.result?.address2,
                    address3: merchant?.result?.address3,
                    address4: merchant?.result?.address4,
                    district: merchant?.result?.district,
                    subdistrict: merchant?.result?.subdistrict,
                    city: merchant?.result?.city,
                    province: merchant?.result?.province,
                    postal_code: merchant?.result?.postal_code,
                  }}
                />
                <Button
                  type={"primary"}
                  htmlType={"submit"}
                  loading={editMutation.isPending}
                >
                  Submit
                </Button>
              </Card>
            </FormWrapper>
          ) : (
            "loading . . ."
          )}
        </PageContent>
      </Page>
    </>
  );
};

export default Edit;