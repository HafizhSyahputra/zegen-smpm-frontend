import { Form, Input } from "antd";

export type FormFieldSigninProps = {
  username: string;
};

const FormFieldSignin = () => {
  return (
    <>
      <Form.Item
        label={"Username"}
        name={"username"}
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
        label={"Password"}
        name={"password"}
        rules={[
          {
            required: true,
            message: "Dibutuhkan",
          },
        ]}
      >
        <Input type={"password"} />
      </Form.Item>
    </>
  );
};

export default FormFieldSignin;
