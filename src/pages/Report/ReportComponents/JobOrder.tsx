import DataTable from "@smpm/components/DataTable";  
import { useDebounce } from "@smpm/utils/useDebounce";  
import useTableHelper from "@smpm/utils/useTableHelper";  
import { useQuery } from "@tanstack/react-query";  
import { Badge, Button, DatePicker, Flex, Space, Typography } from "antd";  
import { ColumnsType } from "antd/es/table";  
import * as dayjs from "dayjs";  
import { useMemo, useState, useEffect } from "react";  
import FilterTable, { TOptions } from "./FilterTable";  
import ReportPDF from "./ReportPDF";  
import { pdf } from "@react-pdf/renderer";  
import saveAs from "file-saver";  
import { IJobOrderReportModel } from "@smpm/models/jobOrderModel";  
import { getJobOrderReports } from "@smpm/services/jobOrderService";  
import { getDataMerchant } from "@smpm/services/merchantService";  
import { getVendor } from "@smpm/services/vendorService";  
import { getAllRegion } from "@smpm/services/regionService";  
import { IPaginationRequest } from "@smpm/models";  

const { Title } = Typography;  
const { RangePicker } = DatePicker;  

const optionStatus: TOptions[] = [  
  { label: "All Status", value: "All Status" },  
  { label: "Tersedia", value: "Tersedia" },  
  { label: "Terpasang", value: "Terpasang" },  
  { label: "Rusak", value: "Rusak" },  
];  

function JobOrder() {  
  const { tableFilter, onChangeTable, onChangeSearchBy } = useTableHelper<IJobOrderReportModel>({ pagination: true });  
  const [search, setSearch] = useState<string>("");  
  const searchValue = useDebounce(search, 500);  
 const [selectedStatus, setSelectedStatus] = useState("All Status");  
  const [selectedWilayah, setSelectedWilayah] = useState("All Wilayah");  
  const [selectedVendor, setSelectedVendor] = useState("All Vendor");  
  const [selectedMerchant, setSelectedMerchant] = useState("All Merchant");  
  const [merchantOptions, setMerchantOptions] = useState<TOptions[]>([{ label: "All Merchant", value: "All Merchant" }]);  
  const [vendorOptions, setVendorOptions] = useState<TOptions[]>([{ label: "All Vendor", value: "All Vendor" }]);  
  const [regionOptions, setRegionOptions] = useState<TOptions[]>([{ label: "All Wilayah", value: "All Wilayah" }]);  

  useEffect(() => {  
    const fetchOptions = async () => {  
      try {  
        const merchantRequest: IPaginationRequest = {  
          page: 1,  
          take: 1000,  
          order: "asc",  
          order_by: "name",  
        };  
        const merchantResponse = await getDataMerchant(merchantRequest);  
        setMerchantOptions((prevOptions) => [  
          prevOptions[0],  
          ...merchantResponse.result.data.map((merchant) => ({  
            label: merchant.name,  
            value: merchant.id?.toString(),  
          })),  
        ]);  

        const vendorRequest: IPaginationRequest = {  
          page: 1,  
          take: 1000,  
          order: "asc",  
          order_by: "name",  
        };  
        const vendorResponse = await getVendor(vendorRequest);  
        setVendorOptions((prevOptions) => [  
          prevOptions[0],  
          ...vendorResponse.result.data.map((vendor) => ({  
            label: vendor.name,  
            value: vendor.id.toString(),  
          })),  
        ]);  

        const regionResponse = await getAllRegion();  
        setRegionOptions((prevOptions) => [  
          prevOptions[0],  
          ...regionResponse.result.map((region) => ({  
            label: region.name,  
            value: region.code,  
          })),  
        ]);  
      } catch (error) {  
        console.error("Error fetching options:", error);  
      }  
    };  

    fetchOptions();  
  }, []);  

  const { data: jobOrders, isLoading } = useQuery({  
    queryKey: ["job-order-report", { ...tableFilter, searchValue }],  
    queryFn: () =>  
      getJobOrderReports({  
        order: tableFilter.sort.order,  
        order_by: tableFilter.sort.order_by,  
        search: searchValue,  
        search_by: ["job_order.no", "job_order.type"],  
        page: Number(tableFilter.pagination.current) || 1,  
        take: Number(tableFilter.pagination.pageSize) || 10,
      }),  
  });  

  const columns: ColumnsType<IJobOrderReportModel> = useMemo(() => {  
    return [  
      {  
        title: "NO. JO",  
        dataIndex: "job_order_no",  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
      },  
      {  
        title: "JENIS JO",  
        dataIndex: ["job_order", "type"],  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
        render: (jenis_jo) => {  
          return (jenis_jo || "").includes("Cancel") ? <Badge color="red" text={jenis_jo} /> : jenis_jo;  
        },  
      },  
      {  
        title: "TANGGAL",  
        dataIndex: ["job_order", "date"],  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
        render: (tanggal_jo) => {  
          return dayjs(tanggal_jo).format("DD-MMM-YYYY");  
        },  
      },  
      {  
        title: "MID",  
        dataIndex: ["job_order", "mid"],  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
      },  
      {  
        title: "TID",  
        dataIndex: ["job_order", "tid"],  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
      },  
      {  
        title: "NAMA MERCHANT",  
        dataIndex: ["job_order", "merchant_name"],  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
      },  
      {  
        title: "ADDRESS 1",  
        dataIndex: ["job_order", "address1"],  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
      },  
      {  
        title: "ADDRESS 2",  
        dataIndex: ["job_order", "address2"],  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
      },  
      {  
        title: "ADDRESS 3",  
        dataIndex: ["job_order", "address3"],  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
      },  
      {  
        title: "ADDRESS 4",  
        dataIndex: ["job_order", "address4"],  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
      },  
      {  
        title: "Status Kunjungan",  
        dataIndex: "status",  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
        render: (status:  "Done" | "Cancel", record) => (  
          <div>
          <Badge  
            color={status === 'Done' ? "green" : "red"}  
            text={status}  
          />  
           {status === "Cancel" && (  
              <div className="mt-2 text-gray-400 text-xs">  
                {record.information}  
              </div>  
            )}  
          </div>
        ),  
      },  
      {  
        title: "Status Approval",  
        dataIndex: "status_approve",  
        sorter: true,  
        sortDirections: ["descend", "ascend"],  
        render: (status: "Waiting" | "Approved" | "Rejected", record) => (  
          <div>   
           <Badge  
            color={status === 'Waiting' ? "blue" : status === 'Approved' ? "green" : "red"}  
            text={status}  
          />   
            {status === "Rejected" && (  
              <div className="mt-2 text-gray-400 text-xs">  
                {record.reason}  
              </div>  
            )}  
          </div>  
        ),  
      },  
      {  
        title: "ACTION",  
        render: (record) => {  
          return (  
            <Button type="primary" onClick={() => handleDownload(record)}>  
            Job Order Report  
        </Button>   
          );  
        },  
      },  
    ];  
  }, []);  

    const handleDownload = async (record: any) => {  
      try {  
        const requiredProperties = [  
          'job_order',  
          'JobOrderReportEdcEquipmentDongle',  
          'JobOrderReportMaterialPromo',  
          'JobOrderReportMaterialTraining',  
          'MediaJobOrderReportProofOfVisit',  
          'MediaJobOrderReportOptionalPhoto'  
        ];  
    
        const missingProperties = requiredProperties.filter(prop => !record[prop]);  
    
        if (missingProperties.length > 0) {  
          console.error("Record is missing required properties:", missingProperties, record);  
          alert(`Unable to generate report. Missing properties: ${missingProperties.join(', ')}`);  
          return;  
        }  
    
        const transformedData = {  
          job_order_no: record.job_order_no || '',  
          job_order: {  
              merchant_name: record.job_order?.merchant_name || '',  
              target_date: record.job_order?.date || '',  
              mid: record.job_order?.mid || '',  
              type: record.job_order?.type || '',  
              tid: record.job_order?.tid || '',  
              case_type: record.job_order?.case_type || '',  
              city: record.job_order?.city || '',  
              vendor: {  
                  name: record.job_order?.vendor?.name || '',    
              },  
              merchant: {  
                  mid: record.job_order?.merchant?.mid || '',    
                  address1: record.job_order?.merchant?.address1 || '',  
                  address2: record.job_order?.merchant?.address2 || '',  
                  address3: record.job_order?.merchant?.address3 || '',  
                  address4: record.job_order?.merchant?.address4 || '',  
                  city: record.job_order?.merchant?.city || '',  
                  province: record.job_order?.merchant?.province || '',  
                  postal_code: record.job_order?.merchant?.postal_code || '',  
                  village: record.job_order?.merchant?.village || '',  
                  customer_name: record.job_order?.merchant?.customer_name || '',  
                  phone1: record.job_order?.merchant?.phone1 || '',  
                  phone2: record.job_order?.merchant?.phone2 || '',  
              }  
          },  
          products: [  
            {  
              name: record.edc_brand || '',  
              serial_number: record.edc_serial_number || '',  
              notes: record.edc_note || '',  
              action: record.edc_action || '',  
            },  
          ],  
          status: record.status || '',  
          status_approve: record.status_approve || '',  
          arrival_time: record.arrival_time || null,  
          start_time: record.start_time || null,  
          end_time: record.end_time || null,  
          communication_line: record.communication_line || '',  
          direct_line_number: record.direct_line_number || '',  
          simcard_provider: record.simcard_provider || '',  
          paper_supply: record.paper_supply || '',  
          merchant_pic: record.merchant_pic || '',  
          merchant_pic_phone: record.merchant_pic_phone || '',  
          swipe_cash_indication: record.swipe_cash_indication || '',  
          information: record.information || '',
          reason: record.reason || '',
          info_remark: record.info_remark || '',
          dongle: {  
            battery_cover: record.JobOrderReportEdcEquipmentDongle[0]?.battery_cover || false,  
            battery: record.JobOrderReportEdcEquipmentDongle[0]?.battery || false,  
            edc_adapter: record.JobOrderReportEdcEquipmentDongle[0]?.edc_adapter || false,  
            edc_bracket: record.JobOrderReportEdcEquipmentDongle[0]?.edc_bracket || false,  
            edc_holder: record.JobOrderReportEdcEquipmentDongle[0]?.edc_holder || false,  
            dongle_holder: record.JobOrderReportEdcEquipmentDongle[0]?.dongle_holder || false,  
            dongle_adapter: record.JobOrderReportEdcEquipmentDongle[0]?.dongle_adapter || false,  
            cable_ecr: record.JobOrderReportEdcEquipmentDongle[0]?.cable_ecr || false,  
            cable_lan: record.JobOrderReportEdcEquipmentDongle[0]?.cable_lan || false,  
            cable_telephone_line: record.JobOrderReportEdcEquipmentDongle[0]?.cable_telephone_line || false,  
            mid_tid: record.JobOrderReportEdcEquipmentDongle[0]?.mid_tid || false,  
            magic_box: record.JobOrderReportEdcEquipmentDongle[0]?.magic_box || false,  
            transaction_guide: record.JobOrderReportEdcEquipmentDongle[0]?.transaction_guide || false,  
            pin_cover: record.JobOrderReportEdcEquipmentDongle[0]?.pin_cover || false,  
            telephone_line_splitter: record.JobOrderReportEdcEquipmentDongle[0]?.telephone_line_splitter || false,  
            sticker_bank: record.JobOrderReportEdcEquipmentDongle[0]?.sticker_bank || false,  
            sticer_dongle: record.JobOrderReportEdcEquipmentDongle[0]?.sticer_dongle || false,  
            sticer_gpn: record.JobOrderReportEdcEquipmentDongle[0]?.sticer_gpn || false,  
            sticker_qrcode: record.JobOrderReportEdcEquipmentDongle[0]?.sticker_qrcode || false,  
          },  
          promo_materials: {  
            flyer: record.JobOrderReportMaterialPromo[0]?.flyer || false,  
            tent_card: record.JobOrderReportMaterialPromo[0]?.tent_card || false,  
            holder_card: record.JobOrderReportMaterialPromo[0]?.holder_card || false,  
            holder_pen: record.JobOrderReportMaterialPromo[0]?.holder_pen || false,  
            holder_bill: record.JobOrderReportMaterialPromo[0]?.holder_bill || false,  
            sign_pad: record.JobOrderReportMaterialPromo[0]?.sign_pad || false,  
            pen: record.JobOrderReportMaterialPromo[0]?.pen || false,  
            acrylic_open_close: record.JobOrderReportMaterialPromo[0]?.acrylic_open_close || false,  
            logo_sticker: record.JobOrderReportMaterialPromo[0]?.logo_sticker || false,  
            banner: record.JobOrderReportMaterialPromo[0]?.banner || false,  
          },  
          training_materials: {  
            fraud_awareness: record.JobOrderReportMaterialTraining[0]?.fraud_awareness || false,  
            sale_void_settlement_logon: record.JobOrderReportMaterialTraining[0]?.sale_void_settlement_logon || false,  
            installment: record.JobOrderReportMaterialTraining[0]?.installment || false,  
            audit_report: record.JobOrderReportMaterialTraining[0]?.audit_report || false,  
            top_up: record.JobOrderReportMaterialTraining[0]?.top_up || false,  
            redeem_point: record.JobOrderReportMaterialTraining[0]?.redeem_point || false,  
            cardverif_preauth_offline: record.JobOrderReportMaterialTraining[0]?.cardverif_preauth_offline || false,  
            manual_key_in: record.JobOrderReportMaterialTraining[0]?.manual_key_in || false,  
            tips_adjust: record.JobOrderReportMaterialTraining[0]?.tips_adjust || false,  
            mini_atm: record.JobOrderReportMaterialTraining[0]?.mini_atm || false,  
            fare_non_fare: record.JobOrderReportMaterialTraining[0]?.fare_non_fare || false,  
            dcc_download_bin: record.JobOrderReportMaterialTraining[0]?.dcc_download_bin || false,  
            first_level_maintenance: record.JobOrderReportMaterialTraining[0]?.first_level_maintenance || false,  
            transaction_receipt_storage: record.JobOrderReportMaterialTraining[0]?.transaction_receipt_storage || false,  
          },  
          proofOfVisitImages: record.MediaJobOrderReportProofOfVisit.filter((media: any) => media.media && media.media.path).map((media: any) => ({  
            media_id: media.media.id,  
            media: { path: `http://localhost:46/media/${media.media.id}` },  
          })),  
          optionalPhotos: record.MediaJobOrderReportOptionalPhoto.filter((media: any) => media.media && media.media.path).map((media: any) => ({  
            media_id: media.media.id,  
            media: { path: `http://localhost:46/media/${media.media.id}` },  
          })),
        };
        console.log("transformedData", transformedData);
        
        if (transformedData.proofOfVisitImages.length === 0) {  
          console.warn("No proof of visit images found.");  
        }  
        if (transformedData.optionalPhotos.length === 0) {  
          console.warn("No optional photos found.");  
        }  

      const blob = await pdf(<ReportPDF data={transformedData} />).toBlob();  
      saveAs(blob, `${record.job_order_no}_Report.pdf`);  
    } catch (error) {  
      console.error("Error generating PDF report:", error);  
      alert("An error occurred while generating the report. Please try again.");  
    }  
    };  
  
  return (  
    <>  
      <Flex justify="space-between" align="flex-end">  
        <Title level={3}>Job Order Report</Title>  
        <Space direction="vertical" size={12}>  
          <RangePicker />  
        </Space>  
      </Flex>  
      <FilterTable  
        optionStatus={optionStatus}  
        optionWilayah={regionOptions}  
        optionVendor={vendorOptions}  
        optionMerchant={merchantOptions}  
        hasDownloadReportOrder={false}  
        handleChangeFilterStatus={(value) => setSelectedStatus(value)}  
        valueStatus={selectedStatus}  
        handleChangeFilterWilayah={(value) => setSelectedWilayah(value)}  
        valueWilayah={selectedWilayah}  
        handleChangeFilterVendor={(value) => setSelectedVendor(value)}  
        valueVendor={selectedVendor}  
        handleChangeFilterMerchant={(value) => setSelectedMerchant(value)}  
        valueMerchant={selectedMerchant}  
      />  
      <DataTable<IJobOrderReportModel>  
        dataSource={jobOrders?.result.data}  
        pagination={{  
          current: jobOrders?.result.meta.page,  
          pageSize: jobOrders?.result.meta.take,  
          total: jobOrders?.result.meta.item_count,  
        }}  
        loading={isLoading}  
        bordered  
        onChangeSearchBy={onChangeSearchBy}  
        onGlobalSearch={(value) => setSearch(value)}  
        columns={columns}  
        useGlobalSearchInput  
        onChange={onChangeTable}  
        scroll={{  
          x: 3000,  
        }}  
      />  
    </>  
  );  
}  

export default JobOrder;