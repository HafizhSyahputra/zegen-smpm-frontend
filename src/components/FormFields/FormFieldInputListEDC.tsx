import { Button, Col, Divider, Form, Input, Row, Typography } from "antd"  
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"  

const { Text } = Typography  

export type FormFieldInputListEDCProps = {  
	products?: {  
		product: string  
		serial_number: string  
		notes: string  
		action: string  
	}[]  
	disabled: boolean;   
}  

const FormFieldInputListEDC: React.FC<FormFieldInputListEDCProps> = ({ disabled, products = [] }) => {  
	return (  
	  <Form.List name="products" initialValue={products}>  
		{(fields, { add, remove }) => (  
		  <>  
			{fields.map(({ key, name, ...restField }, index) => (  
			  <>  
				<Text>No {index + 1}</Text>  
				<Row  
				  key={key}  
				  gutter={16}  
				  align={"middle"}  
				  style={{  
					padding: 5,  
				  }}  
				>  
				  <Col xs={24} md={5}>  
					<Form.Item  
					  {...restField}  
					  label={"Product"}  
					  name={[name, "product"]}  
					  rules={[{ required: true, message: "Dibutuhkan" }]}  
					>  
					  <Input readOnly={disabled} />  
					</Form.Item>  
				  </Col>  
				  <Col xs={24} md={5}>  
					<Form.Item  
					  {...restField}  
					  label={"Serial Number"}  
					  name={[name, "serial_number"]}  
					  rules={[{ required: true, message: "Dibutuhkan" }]}  
					>  
					  <Input readOnly={disabled} />  
					</Form.Item>  
				  </Col>  
				  <Col xs={24} md={5}>  
					<Form.Item  
					  {...restField}  
					  label={"Notes"}  
					  name={[name, "note"]}  
					  rules={[{ required: false, message: "" }]}  
					>  
					  <Input readOnly={disabled} />  
					</Form.Item>  
				  </Col>  
				  <Col xs={24} md={5}>  
					<Form.Item  
					  {...restField}  
					  label={"Action"}  
					  name={[name, "action"]}  
					  rules={[{ required: false, message: "" }]}  
					>  
					  <Input readOnly={disabled} />  
					</Form.Item>  
				  </Col>  
				  <Col>  
					<MinusCircleOutlined onClick={() => remove(name)} disabled={disabled} />  
				  </Col>  
				</Row>  
				<Divider />  
			  </>  
			))}  
			{!disabled && (  
			  <Form.Item>  
				<Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>  
				  Add Item  
				</Button>  
			  </Form.Item>  
			)}  
		  </>  
		)}  
	  </Form.List>  
	);  
}  

export default FormFieldInputListEDC;