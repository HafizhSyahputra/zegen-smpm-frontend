import { HomeOutlined } from "@ant-design/icons"  
import FormFieldDescriptionAndEvidence from "@smpm/components/FormFields/FormFieldDescriptionAndEvidence"  
import PageContent from "@smpm/components/PageContent"  
import SectionHeader from "@smpm/components/SectionHeader"  
import PageLabel from "@smpm/components/pageLabel"  
import Page from "@smpm/components/pageTitle"  
import { IBaseResponseService, IErrorResponseService } from "@smpm/models"  
import { jobOrderActivity } from "@smpm/services/jobOrderService"  
import { findJobOrder } from "@smpm/services/jobOrderService" // Importing here  
import {  
    IconArrowLeft,  
    IconArrowRight,  
    IconChecklist,  
    IconFileDescription,  
    IconFileInfo,  
    IconInputCheck,  
    IconSortDescendingNumbers,  
} from "@tabler/icons-react"  
import { useMutation } from "@tanstack/react-query"  
import {  
    Breadcrumb,  
    Button,  
    Card,  
    Divider,  
    Flex,  
    Form,  
    Input,  
    Modal,  
    StepProps,  
    Typography,  
    message,  
} from "antd"  
import { AxiosError } from "axios"  
import * as dayjs from "dayjs"  
import { useMemo, useState, useEffect } from "react"  
import { useNavigate, useParams } from "react-router-dom"  
import InfoPenugasan from "./components/InfoPenugasan"  
import InputDetailJobActivity from "./components/InputDetailJobActivity"  
import InputEDC from "./components/InputEDC"  
import JobChecklist from "./components/JobChecklist"  
import StepActivity from "./components/StepActivity"  
import UploadEvidenceAndNote from "./components/UploadEvidenceAndNote"  

const { Text, Title } = Typography  
const { TextArea } = Input  

const STEP_ITEMS: StepProps[] = [  
    {  
        title: (  
            <Title level={5} style={{ margin: 0 }}>  
                Informasi Penugasan & Data Merchant  
            </Title>  
        ),  
        style: { minWidth: 300 },  
        icon: <IconFileInfo />,  
        description: <Text type={"secondary"}>Detail Penugasan & Info Merchant</Text>,  
    },  
    {  
        title: (  
            <Title level={5} style={{ margin: 0 }}>  
                Input EDC  
            </Title>  
        ),  
        style: { minWidth: 300 },  
        icon: <IconInputCheck />,  
        description: <Text type={"secondary"}>Isi Detail Mesin EDC</Text>,  
    },  
    {  
        title: (  
            <Title level={5} style={{ margin: 0 }}>  
                Input Detail Pekerjaan  
            </Title>  
        ),  
        style: { minWidth: 300 },  
        icon: <IconFileDescription />,  
        description: "Isi Informasi Pekerjaan status EDC",  
    },  
    {  
        title: (  
            <Title level={5} style={{ margin: 0 }}>  
                Checklist Pekerjaan  
            </Title>  
        ),  
        style: { minWidth: 300 },  
        icon: <IconChecklist />,  
        description: "Isi Detail Pekerjaan status EDC",  
    },  
    {  
        title: (  
            <Title level={5} style={{ margin: 0 }}>  
                Upload Bukti & Keterangan  
            </Title>  
        ),  
        style: { minWidth: 300 },  
        icon: <IconChecklist />,  
        description: "Isi Keterangan & Bukti Foto",  
    },  
]  

const BreadCrumbActivity = ({ no_jo }: { no_jo: string }) => (  
    <Breadcrumb  
        items={[  
            {  
                href: "/",  
                title: (  
                    <>  
                        <HomeOutlined />  
                        <span>Home</span>  
                    </>  
                ),  
            },  
            {  
                title: (  
                    <div className="flex gap-1">  
                        <IconSortDescendingNumbers size="1rem" />  
                        <span>Job Order</span>  
                    </div>  
                ),  
            },  
            {  
                title: "Activity Job Order",  
                href: "/job-order/activity",  
            },  
            {  
                title: no_jo,  
            },  
        ]}  
    />  
)  

const JobOrderActivity = () => {  
    const { no_jo } = useParams()  
    const [formCancellation] = Form.useForm()  
    const [formContinue] = Form.useForm()  
    const navigate = useNavigate()  

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)  
    const [current, setCurrent] = useState<number>(0)  
    const [stepItems] = useState<StepProps[]>(STEP_ITEMS)  
    const [isDoneStatus, setIsDoneStatus] = useState<boolean>(false)  

    const continueMutation = useMutation<  
        IBaseResponseService<any>,  
        AxiosError<IBaseResponseService<IErrorResponseService>>,  
        any  
    >({  
        mutationFn: jobOrderActivity,  
    });  

     useEffect(() => {  
        const fetchJobOrder = async () => {  
            if (typeof no_jo === "string") {  
                const jobOrder = await findJobOrder(no_jo);  
                setIsDoneStatus(jobOrder.result.status === "Done");  
            } else {  
                console.error("No job order number found in the URL");  
            }  
        };  

        fetchJobOrder();  
    }, [no_jo]);  

    const onAction = () => {  
        setIsModalOpen(true);  
    };  

    const onCancel = () => {  
        setIsModalOpen(false);  
        formCancellation.resetFields();  
    };  

    const onOk = () => {  
        formCancellation.submit();  
    };  

    const onFinishBtn = () => formContinue.submit();  

    const onFinishHandle = (data: any) => {  
        const formData = new FormData();  
        formData.append("no_jo", no_jo!);  
        Object.keys(data).forEach((item) => {  
            if (item == "products") {  
                data.products?.forEach((product: any, i: number) => {  
                    formData.append(`products[${i}][product]`, product.product);  
                    formData.append(`products[${i}][serial_number]`, product.serial_number);  
                    formData.append(`products[${i}][note]`, product.note);  
                    formData.append(`products[${i}][action]`, product.action);  
                });  
                return;  
            }  
            if (item == "edc_dongle_equipment") {  
                data.edc_dongle_equipment?.forEach((item: any) => {  
                    formData.append(`edc_dongle_equipment[]`, item);  
                });  
                return;  
            }  
            if (item == "material_promo") {  
                data.material_promo?.forEach((item: any) => {  
                    formData.append(`material_promo[]`, item);  
                });  
                return;  
            }  
            if (item == "material_training") {  
                data.material_training?.forEach((item: any) => {  
                    formData.append(`material_training[]`, item);  
                });  
                return;  
            }  
            if (item == "evidence") {  
                data.evidence?.forEach((item: any) => {  
                    formData.append("evidence", item.originFileObj);  
                });  
                return;  
            }  
            if (item == "optional") {  
                data.optional?.forEach((item: any) => {  
                    formData.append("optional", item.originFileObj);  
                });  
                return;  
            }  
            if (item == "arrival_time") {  
                formData.append(  
                    "arrival_time",  
                    dayjs(data.arrival_time).format("YYYY-MM-DD HH:mm:ss")  
                );  
                return;  
            }  
            if (item == "start_time") {  
                formData.append(  
                    "start_time",  
                    dayjs(data.start_time).format("YYYY-MM-DD HH:mm:ss")  
                );  
                return;  
            }  
            if (item == "end_time") {  
                formData.append(  
                    "end_time",  
                    dayjs(data.end_time).format("YYYY-MM-DD HH:mm:ss")  
                );  
                return;  
            }  
            formData.append(item, data[item]);  
        });  
        continueMutation.mutate(formData, {  
            onSuccess: () => {  
                message.success("Berhasil melakukan aktifitas");  
                navigate("/job-order/activity", {  
                    replace: true,  
                });  
            },  
            onError: (err) => {  
                message.error(err.response?.data.status.description);  
            },  
        });  
    };  

    const onFinishCancellation = (data) => {  
        onFinishHandle({  
            status: "Cancel",  
            ...formContinue.getFieldsValue(),  
            ...data,  
        });  
    };  

    const onFinishJobActivity = (data: any) => {  
        onFinishHandle({  
            status: "Done",  
            ...data,  
        });  
    };  

    const onChangeStep = (page: number) => setCurrent(page);  

    const items = useMemo(() => {  
        return [  
            {  
                label: "Info Penugasan & Data Merchant",  
                onNext: () => onChangeStep(current + 1),  
                onPrev: undefined,  
                onFinish: undefined,  
            },  
            {  
                label: "Input EDC",  
                onNext: () => onChangeStep(current + 1),  
                onPrev: () => onChangeStep(current - 1),  
                onFinish: undefined,  
            },  
            {  
                label: "Input Detail Pekerjaan",  
                onNext: () => onChangeStep(current + 1),  
                onPrev: () => onChangeStep(current - 1),  
                onFinish: undefined,  
            },  
            {  
                label: "Checklist Pekerjaan",  
                onNext: () => onChangeStep(current + 1),  
                onPrev: () => onChangeStep(current - 1),  
                onFinish: undefined,  
            },  
            {  
                label: "Upload Bukti & Keterangan",  
                onNext: undefined,  
                onPrev: () => onChangeStep(current - 1),  
                onFinish: () => onFinishBtn(),  
            },  
        ];  
    }, [current, onFinishBtn]);  

    return (  
        <Page title={"Job Order Activity - " + no_jo}>  
            <Modal  
                open={isModalOpen}  
                title={`Are you sure wants to Cancel this Job Order`}  
                onOk={onOk}  
                afterClose={() => formCancellation.resetFields()}  
                onCancel={onCancel}  
                confirmLoading={continueMutation.isPending}  
            >  
                <Form  
                    form={formCancellation}  
                    onFinish={onFinishCancellation}  
                    layout={"vertical"}  
                >  
                    <FormFieldDescriptionAndEvidence />  
                </Form>  
            </Modal>  
            <PageLabel  
                title={  
                    <span className="font-semibold text-2xl">  
                        Job Order Activity - {no_jo}  
                    </span>  
                }  
                endSection={  
                    !isDoneStatus && (  
                        <Button danger type={"primary"} size="large" onClick={onAction}>  
                            <Flex align={"center"} gap={5}>  
                                <span>Cancel This Job Order</span>  
                            </Flex>  
                        </Button>  
                    )  
                }  
                subtitle={<BreadCrumbActivity no_jo={String(no_jo)} />}  
            />  
            <PageContent>  
                <Card>  
                    <StepActivity  
                        current={current}  
                        onChange={onChangeStep}  
                        items={stepItems}  
                    />  
                    <Divider />  
                    <SectionHeader  
                        title={items[current]?.label ?? "-"}  
                        action={  
                            <Flex justify={"end"} align={"center"} gap={5}>  
                                {items[current].onPrev && (  
                                    <Button type={"primary"} onClick={items[current].onPrev}>  
                                        <Flex align={"center"} gap={5}>  
                                            <span>Prev</span>  
                                            <IconArrowLeft />  
                                        </Flex>  
                                    </Button>  
                                )}  
                                {items[current].onNext && (  
                                    <Button type={"primary"} onClick={items[current].onNext}>  
                                        <Flex align={"center"} gap={5}>  
                                            <span>Next</span>  
                                            <IconArrowRight />  
                                        </Flex>  
                                    </Button>  
                                )}  
                                {current === 4 && !isDoneStatus && (  
                                    <Button  
                                        type={"primary"}  
                                        onClick={items[current].onFinish}  
                                        loading={continueMutation.isPending}  
                                    >  
                                        <Flex align={"center"} gap={5}>  
                                            <span>Finish And Continue</span>  
                                            <IconArrowRight />  
                                        </Flex>  
                                    </Button>  
                                )}  
                            </Flex>  
                        }  
                    />  
                    <Divider />  
                    <Form  
                        layout={"vertical"}  
                        onFinish={onFinishJobActivity}  
                        form={formContinue}  
                    >  
                        <InfoPenugasan hide={current !== 0} no_jo={no_jo} />  
                        <InputEDC hide={current !== 1} />  
                        <InputDetailJobActivity hide={current !== 2} />  
                        <JobChecklist hide={current !== 3} />  
                        <UploadEvidenceAndNote hide={current !== 4} />  
                    </Form>  
                </Card>  
            </PageContent>  
        </Page>  
    );  
}  

export default JobOrderActivity;