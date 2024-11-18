import { InboxOutlined } from "@ant-design/icons";  
import AlertValidation from "@smpm/components/AlertValidation";  
import { IFormImportJobOrder } from "@smpm/models/jobOrderModel";  
import { downloadTemplateJobOrderNew } from "@smpm/services/jobOrderService";  
import { Button, Form, Space, Upload, message, Select } from "antd";  
import type { RcFile } from 'antd/es/upload/interface';  
import { useState } from "react";  
import * as XLSX from 'xlsx';  

const FormImportJobOrderNew: React.FC<IFormImportJobOrder> = ({  
    onFinish = () => {},  
    initialValues,  
    isLoading = false,  
    onReset,  
}) => {  
    const [form] = Form.useForm();  
    const [pmEntries, setPmEntries] = useState<{ merchant: string; type: string }[]>([]); // Store preventive maintenance entries  

    const reset = () => {  
        if (onReset) onReset();  
        form.resetFields();  
        setPmEntries([]);  
    };  

    const checkExcelForPM = (file: RcFile): Promise<boolean> => {  
        return new Promise((resolve) => {  
            const reader = new FileReader();  

            reader.onload = (e) => {  
                try {  
                    const data = e.target?.result;  
                    const workbook = XLSX.read(data, { type: 'binary' });  
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];  
                    const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 'A' });  
                    const dataRows = rows.slice(3);  

                    const pmDetected = dataRows  
                        .filter((row: any) => row['E']?.toString().toLowerCase() === 'preventive maintenance') // Find rows with 'Preventive Maintenance'  
                        .map((row: any) => ({  
                            merchant: row['I'], 
                            type: 'preventive maintenance'  
                        }));  

                    if (pmDetected.length > 0) {  
                        message.info(`Terdeteksi ${pmDetected.length} Job Order Preventive Maintenance. Silakan pilih tipe Preventive.`);  
                    }  

                    setPmEntries(pmDetected);   
                    resolve(true);  
                } catch (error) {  
                    console.error('Error reading Excel:', error);  
                    message.error('Gagal membaca file Excel');  
                    resolve(false);  
                }  
            };  

            reader.readAsBinaryString(file);  
        });  
    };  

    return (  
        <Form  
            form={form}  
            layout="vertical"  
            initialValues={initialValues}  
            onFinish={(values) => {  
                const formData = new FormData();  
                formData.append("files", values.files);  

                 pmEntries.forEach((entry, index) => {  
                    if (values[`preventiveType${index}`]) {  
                        formData.append(`preventive_type_${entry.merchant}`, values[`preventiveType${index}`]); 
                    }  
                });  

                onFinish(formData);  
            }}  
        >  
            <AlertValidation errorKey="import-job-order-new" />  
            <Space direction="vertical" className="w-full">  
                <p className="font-semibold text-lg">1. Download File Template</p>  
                <Button onClick={() => downloadTemplateJobOrderNew()}>  
                    Download File Template  
                </Button>  
                <p className="font-semibold text-lg">2. Upload Data</p>  
                <small>File sesuai dengan template dan dalam format xlsx</small>  
                <Form.Item  
                    name={["files"]}  
                    rules={[{ required: true, message: "File tidak boleh kosong" }]}  
                >  
                    <Upload.Dragger  
                        maxCount={1}  
                        onChange={(info) => {  
                            if (!["removed", "remove"].includes(info.file.status as string)) {  
                                form.setFieldsValue({ files: info.file });  
                            } else {  
                                form.setFieldsValue({ files: null });  
                                setPmEntries([]);    
                            }  
                        }}  
                        onRemove={() => {  
                            form.setFieldsValue({ files: null });  
                            setPmEntries([]);  
                        }}  
                        beforeUpload={async (file) => {  
                            const validFormat = [  
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",  
                                "application/vnd.ms-excel",  
                            ].includes(file.type);  

                            if (!validFormat) {  
                                message.error(`${file.name} bukan file Excel yang valid`);  
                                return Upload.LIST_IGNORE;  
                            }  

                            await checkExcelForPM(file);  
                            return false;  
                        }}  
                    >  
                        <p className="ant-upload-drag-icon">  
                            <InboxOutlined />  
                        </p>  
                        <p className="ant-upload-text">Klik atau seret file ke area ini untuk import data</p>  
                        <p className="ant-upload-hint">Support only for XLSX File</p>  
                    </Upload.Dragger>  
                </Form.Item>  

                {pmEntries.map((entry, index) => (  
                    <Form.Item  
                        key={index}  
                        name={`preventiveType${index}`}  
                        label={`Tipe Preventive Maintenance (${entry.merchant})`}  
                        rules={[{ required: true, message: "Pilih tipe Preventive Maintenance" }]}  
                    >  
                        <Select placeholder={`Pilih tipe Preventive Maintenance untuk ${entry.merchant}`}>  
                            <Select.Option value="Pemeliharaan secara berkala">Pemeliharaan Secara Berkala</Select.Option>  
                            <Select.Option value="Aktifitas reinisialisasi EDC">Aktifitas reinisialisasi EDC</Select.Option>  
                            <Select.Option value="Upgrade aplikasi">Upgrade Aplikasi dan Fitur EDC</Select.Option>  
                        </Select>  
                    </Form.Item>  
                ))}  

                <Form.Item>  
                    <Space>  
                        <Button type="primary" htmlType="submit" loading={isLoading}>  
                            Submit  
                        </Button>  
                        <Button htmlType="button" onClick={reset}>  
                            Reset  
                        </Button>  
                    </Space>  
                </Form.Item>  
            </Space>  
        </Form>  
    );  
};  

export default FormImportJobOrderNew;