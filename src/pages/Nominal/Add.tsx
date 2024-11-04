
import React from 'react';  
import { Button, Card, notification, Breadcrumb, Flex } from 'antd';  
import { useMutation } from '@tanstack/react-query';  
import { useNavigate } from 'react-router-dom';  
import { IconWashMachine } from '@tabler/icons-react';  

import { createNominal } from '@smpm/services/nominalService';  
import { ICreateNominalDTO } from '@smpm/models/nominalModel';  
import FormFieldNominal from '@smpm/components/FormFields/FormFieldNominal';  
import FormWrapper from '@smpm/components/FormWrapper';  
import PageContent from '@smpm/components/PageContent';  
import PageLabel from '@smpm/components/pageLabel';  
import Page from '@smpm/components/pageTitle';  

const Add: React.FC = () => {  
  const navigate = useNavigate();  
  const [notificationApi, contextHolder] = notification.useNotification();  

  const addMutation = useMutation({  
    mutationFn: createNominal,  
    onSuccess: () => {  
      notificationApi.success({  
        message: 'Success',  
        description: 'Nominal has been created successfully',  
      });  
      navigate('/nominal');  
    },  
    onError: (error: any) => {  
      const errorMessage = error.response?.data?.message   
        || 'Failed to create nominal. Please try again.';  
      
      notificationApi.error({  
        message: 'Error',  
        description: errorMessage,  
      });  
    },  
  });  

  const handleSubmit = async (values: ICreateNominalDTO) => {  
    try {  
        const payload = {  
            nominal: values.nominal,  
            vendor_id: Number(values.vendor_id),  
            jenis: values.jenis,  
            tipe: values.tipe  
        };  

        console.log('Payload yang dikirim:', payload);
        await addMutation.mutateAsync(payload);  
    } catch (error: any) {  
        console.error('Submit Error Full Details:', {  
            message: error.message,  
            response: error.response?.data,  
            status: error.response?.status,  
            fullError: error  
        });  
    }  
};

  return (  
    <Page title="Add New Nominal">  
      {contextHolder}  
      <PageLabel  
        title={<span className="font-semibold text-2xl">Add New Nominal</span>}  
        subtitle={  
          <Breadcrumb  
            items={[  
              {  
                href: "/nominal",  
                title: (  
                  <Flex align="center">  
                    <IconWashMachine />  
                    <span>Nominal</span>  
                  </Flex>  
                ),  
              },  
              {  
                title: "Add New Nominal",  
              },  
            ]}  
          />  
        }  
      />  
      <PageContent>  
        <Card title="Add New Nominal">  
          <FormWrapper onFinish={handleSubmit}>  
            <FormFieldNominal />  
            <Button  
              type="primary"  
              htmlType="submit"  
              loading={addMutation.isPending}  
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
