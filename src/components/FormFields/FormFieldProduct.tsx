import { Form, Input, InputNumber } from "antd";

export type FormFieldProductProps = {
  product_name: string;
  product_qty: number;
};

const FormFieldProduct = () => {
  return (
    <>
      <Form.Item
        label={"Product Name"}
        name={"product_name"}
        rules={[
          {
            required: true,
            message: "Dibutuhkan",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={"Product Qty"}
        name={"product_qty"}
        rules={[
          {
            required: true,
            message: "Dibutuhkan",
          },
        ]}
      >
        <InputNumber />
      </Form.Item>
    </>
  );
};

export default FormFieldProduct;
