import { Form } from "antd";

type FormWrapperProps<T> = {
  children: any;
  name?: string;
  onFinish: (value: T) => void;
};

const FormWrapper = <T extends unknown>({
  children,
  name,
  onFinish,
}: FormWrapperProps<T>) => {
  const [form] = Form.useForm();

  return (
    <Form form={form} layout={"vertical"} name={name} onFinish={onFinish}>
      {children}
    </Form>
  );
};

export default FormWrapper;
