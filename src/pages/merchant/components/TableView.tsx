

import {
  DeleteOutlined,
  EditOutlined
} from "@ant-design/icons";
import DataTable from "@smpm/components/DataTable";
import { IMerchantModel } from "@smpm/models/merchantModel";
import {
  deleteDataMerchant,
  getDataMerchant,
} from "@smpm/services/merchantService";
import { useDebounce } from "@smpm/utils/useDebounce";
import useTableHelper from "@smpm/utils/useTableHelper";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Modal, notification } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

interface DataTypeNew {
  id: number;
  key: React.Key;
  mid: string;
  tid: string;
  kode_wilayah: string;
  merchant_name: string;
  nama_nasabah: string;
  contact: string;
  phone: string;
  kode_cbg: string;
  kategori: string;
  address1: string;
  address2: string;
  address3: string;
  address4: string;
}

const data_new: DataTypeNew[] = [
  // ... (data_new array remains unchanged)
];

const TableView: React.FC = () => {
  const [searchColumn, setSearchColumn] = useState<string | null>(null);
  const navigate = useNavigate();
  const deleteMutation = useMutation({
    mutationFn: deleteDataMerchant,
  });

  const [api] = notification.useNotification();

  const setSelectedSearchColumn = useCallback((value: any) => {
    setSearchColumn(value);
  }, []);

  const { tableFilter, onChangeTable } = useTableHelper<IMerchantModel>({pagination : true});

  const [search, setSearch] = useState<string>("");

  const searchValue = useDebounce(search, 500);

  const onSearch = (value: string) => setSearch(value);

  const {
    data: merchant,
    isLoading,
    refetch,
    isSuccess,
  } = useQuery({
    queryKey: ["merchant", { ...tableFilter, search }],
    queryFn: () =>
      getDataMerchant({
        order: tableFilter.sort.order,
        order_by: tableFilter.sort.order_by,
        search: searchValue,
        search_by: tableFilter.searchBy,
        page: Number(tableFilter.pagination.current),
        take: Number(tableFilter.pagination.pageSize),
      }),
  });

  const [open, setOpen] = useState<boolean>(false);
  const [merchantData, setMerchantData] = useState<IMerchantModel>({});
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [modalText, setModalText] = useState<string>("Content of the modal");

  const showModal = (row: IMerchantModel) => {
    setMerchantData(row);
    setOpen(true);
  };

  const handleOk = () => {  
    setConfirmLoading(true);  
    deleteMutation.mutate(+String(merchantData.id), {  
      onSuccess: () => {  
        api.success({  
          message: "Merchant has been deleted and is waiting for approval.",  
        });  
        refetch();  
        setOpen(false);  
        setConfirmLoading(false);  
      },  
      onError: () => {  
        api.error({  
          message: "Something went wrong while deleting the merchant.",  
        });  
        setOpen(false);  
        setConfirmLoading(false);  
      },  
    });  
  };  

  const handleCancel = () => {
    setOpen(false);
  };

  const columns: ColumnsType<IMerchantModel> = useMemo(
    (): ColumnsType<IMerchantModel> => {
      return [
        {
          title: "MID",
          dataIndex: "mid",
          sorter: true,
          sortDirections: ["descend", "ascend"],
          render: (row) => row || "-",
        },
        {
          title: "Merchant Name",
          dataIndex: "name",
          sorter: true,
          sortDirections: ["descend", "ascend"],
          render: (row) => row || "-",
        },
        {
          title: "Category",
          dataIndex: "category",
          sorter: true,
          sortDirections: ["descend", "ascend"],
          render: (row) => row || "-",
        },
        {
          title: "Customer Name",
          dataIndex: "customer_name",
          sorter: true,
          sortDirections: ["descend", "ascend"],
          render: (row) => row || "-",
        },
        {
          title: "Telephone",
          dataIndex: "telephone",
          sorter: true,
          sortDirections: ["descend", "ascend"],
          render: (row) => row || "-",
        },
        {
          title: "PIC",
          dataIndex: "pic",
          sorter: true,
          sortDirections: ["descend", "ascend"],
          render: (row) => row || "-",
        },
        {
          title: "Phone 1",
          dataIndex: "phone1",
          sorter: true,
          sortDirections: ["descend", "ascend"],
          render: (row) => row || "-",
        },
        {
          title: "Phone 2",
          dataIndex: "phone2",
          sorter: true,
          sortDirections: ["descend", "ascend"],
          render: (row) => row || "-",
        },
        {
          title: "Address 1",
          dataIndex: "address1",
          sorter: true,
          sortDirections: ["descend", "ascend"],
          render: (row) => row || "-",
        },
        {
          title: "Address 2",
          dataIndex: "address2",
          sorter: true,
          sortDirections: ["descend", "ascend"],
          render: (row) => row || "-",
        },
        {
          title: "Address 3",
          dataIndex: "address3",
          sorter: true,
          sortDirections: ["descend", "ascend"],
          render: (row) => row || "-",
        },
        {
          title: "Address 4",
          dataIndex: "address4",
          sorter: true,
          sortDirections: ["descend", "ascend"],
          render: (row) => row || "-",
        },
        {
          title: "District",
          dataIndex: "district",
          sorter: true,
          sortDirections: ["descend", "ascend"],
          render: (row) => row || "-",
        },
        {
          title: "Sub District",
          dataIndex: "subdistrict",
          sorter: true,
          sortDirections: ["descend", "ascend"],
          render: (row) => row || "-",
        },
        {
          title: "City",
          dataIndex: "city",
          sorter: true,
          sortDirections: ["descend", "ascend"],
          render: (row) => row || "-",
        },
        {
          title: "Province",
          dataIndex: "province",
          sorter: true,
          sortDirections: ["descend", "ascend"],
          render: (row) => row || "-",
        },
        {
          title: "Postal Code",
          dataIndex: "postal_code",
          sorter: true,
          sortDirections: ["descend", "ascend"],
          render: (row) => row || "-",
        },
        {
          title: "ACTION",
          render: (row) => {
            return (
              <span style={{ display: "flex", alignItems: "center" }}>
                <Button
                  onClick={() =>
                    navigate("/merchant/list-merchant/edit/" + row.id)
                  }
                  icon={<EditOutlined />}
                  style={{ marginRight: 8, display: "inline-block" }}
                />
                <Button
                  onClick={() => showModal(row)}
                  icon={<DeleteOutlined />}
                  style={{ marginRight: 8, display: "inline-block" }}
                />
              </span>
            );
          },
        },
      ];
    },
    [navigate]
  );

  return (
    <>
      <Modal
        title={`Delete Merchant`}
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p style={{ fontSize: "18px" }}>
          Are you sure delete Merchant{" "}
          <span style={{ fontWeight: "bold" }}>{merchantData.name}</span> ?
        </p>
      </Modal>
      <DataTable<IMerchantModel>
        dataSource={merchant?.result.data}
        pagination={{
          current: merchant?.result.meta.page,
          pageSize: merchant?.result.meta.take,
          total: merchant?.result.meta.item_count,
        }}
        loading={isLoading}
        bordered
        onGlobalSearch={onSearch}
        columns={columns}
        useGlobalSearchInput
        onChange={onChangeTable}
        scroll={{ x: true }}

      />
    </>
  );
};

export default TableView;
