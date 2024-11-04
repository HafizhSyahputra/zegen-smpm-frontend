import React from "react";  
import { Col, DatePicker, Form, Input, InputNumber, Row } from "antd";  
import dayjs from "dayjs";   

type FormFieldInputDetailJobActivityProps = {  
  arrival_time?: dayjs.Dayjs;  
  start_time?: dayjs.Dayjs;    
  end_time?: dayjs.Dayjs;      
  communication_line?: string;  
  direct_line_number?: string;  
  simcard_provider?: string;  
  paper_supply?: string;  
  merchant_pic?: string;  
  phone_provider?: string;  
  swipe_cash_indication?: string;  
  readOnly?: boolean;  
};  

const FormFieldInputDetailJobActivity: React.FC<FormFieldInputDetailJobActivityProps> = ({  
  arrival_time,  
  start_time,  
  end_time,  
  communication_line,  
  direct_line_number,  
  simcard_provider,  
  paper_supply,  
  merchant_pic,  
  phone_provider,  
  swipe_cash_indication,  
  readOnly  
}) => {  
  return (  
    <>  
      <Row gutter={16}>  
        <Col xs={24} md={8}>  
          <Form.Item label={"Waktu Kedatangan"} name={"arrival_time"}  initialValue={arrival_time ? arrival_time.format('YYYY-MM-DD HH:mm:ss') : ''}>  
            {readOnly ? (  
              <Input readOnly={readOnly} />  
            ) : (  
              <DatePicker  
                className="w-full"  
                showTime  
                inputReadOnly={readOnly}  
              />  
            )}  
          </Form.Item>  
        </Col>  
        <Col xs={24} md={8}>  
          <Form.Item label={"Waktu Mulai"} name={"start_time"} initialValue={start_time ? start_time.format('YYYY-MM-DD HH:mm:ss') : ''} >  
            {readOnly ? (  
              <Input readOnly={readOnly} />  
            ) : (  
              <DatePicker  
                className="w-full"  
                showTime  
                inputReadOnly={readOnly}  
              />  
            )}  
          </Form.Item>  
        </Col>  
        <Col xs={24} md={8}>  
          <Form.Item label={"Waktu Selesai"} name={"end_time"} initialValue={end_time ? end_time.format('YYYY-MM-DD HH:mm:ss') : ''} >  
            {readOnly ? (  
              <Input readOnly={readOnly}/>  
            ) : (  
              <DatePicker  
                className="w-full"  
                showTime  
                inputReadOnly={readOnly}  
              />  
            )}  
          </Form.Item>  
        </Col>  
      </Row>  
      <Row gutter={16}>  
        <Col xs={24} md={8}>  
          <Form.Item label={"Line Komunikasi"} name={"communication_line"} initialValue={communication_line}>  
            <Input readOnly={readOnly} />  
          </Form.Item>  
        </Col>  
        <Col xs={24} md={8}>  
          <Form.Item label={"No. Direct Line"} name={"direct_line_number"} initialValue={direct_line_number}>  
            <Input readOnly={readOnly} />  
          </Form.Item>  
        </Col>  
        <Col xs={24} md={8}>  
          <Form.Item label={"Operator Seluler"} name={"simcard_provider"} initialValue={simcard_provider}>  
            <Input readOnly={readOnly} />  
          </Form.Item>  
        </Col>  
      </Row>  
      <Row gutter={16}>  
        <Col xs={24} md={6}>  
          <Form.Item label={"Supply Kertas"} name={"paper_supply"} initialValue={paper_supply}>  
            <InputNumber className="w-full" readOnly={readOnly} />  
          </Form.Item>  
        </Col>  
        <Col xs={24} md={6}>  
          <Form.Item label={"PIC Merchant"} name={"merchant_pic"} initialValue={merchant_pic}>  
            <Input readOnly={readOnly} />  
          </Form.Item>  
        </Col>  
        <Col xs={24} md={6}>  
          <Form.Item label={"Phone"} name={"merchant_pic_phone"} initialValue={phone_provider}>  
            <Input readOnly={readOnly} />  
          </Form.Item>  
        </Col>  
        <Col xs={24} md={6}>  
          <Form.Item label={"Indikasi Gesek Tunai"} name={"swipe_cash_indication"} initialValue={swipe_cash_indication}>  
            <Input readOnly={readOnly} />  
          </Form.Item>  
        </Col>  
      </Row>  
    </>  
  );  
};  

export default FormFieldInputDetailJobActivity;