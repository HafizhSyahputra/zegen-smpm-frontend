import React, { useState } from 'react';  
import { Modal, Typography, Button, Space, message } from 'antd';  
import { CheckCircleFilled } from '@ant-design/icons';  
import { Link } from 'react-router-dom';  

const { Title, Text } = Typography;  

interface SuccessModalProps {  
  visible: boolean;  
  onClose: () => void;  
}  

const SuccessModal: React.FC<SuccessModalProps> = ({ visible, onClose }) => {  
  const [previewLink, setPreviewLink] = useState('http://localhost:5173/payment/:id');  

  const copyToClipboard = () => {  
    navigator.clipboard.writeText(previewLink);  
    message.success('Link copied to clipboard!');  
  };  

  return (  
    <Modal  
      visible={visible}  
      onCancel={onClose}  
      footer={null}  
      width={1400}  
      centered  
      bodyStyle={{ padding: '24px', textAlign: 'center' }}  
    >  
      <Title level={3} style={{ marginBottom: 8 }}>You're All Set!</Title>  
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>  
        Jangan ragu untuk mengirimkan pesan kepada kami dengan detail atau file tambahan  
      </Text>  
      <div style={{  
        background: '#f0f2f5',  
        padding: '12px 24px',  
        borderRadius: '8px',  
        marginBottom: 32,  
        display: 'flex',  
        flexDirection: 'column',  
        alignItems: 'center',  
        justifyContent: 'center',  
        margin: '0 auto'  
      }}>  
        <Space direction="vertical" size={4} style={{ width: '100%', marginBottom: '20px' }}>  
          <Text strong style={{ textAlign: 'left' }}>Upload Berhasil!</Text>  
          <Space align="start">  
            <CheckCircleFilled style={{ color: '#52c41a', fontSize: '16px' }} />  
            <Text>Invoice berhasil di upload. Link bisa di salin ke papan klip</Text>  
          </Space>  
        </Space>  
        <Space size="middle">  
          <Link to="/preview"><Button type="primary" style={{ backgroundColor: '#006d75', borderColor: '#006d75' }}>Preview</Button></Link>  
          <Button type="primary" style={{ backgroundColor: '#006d75', borderColor: '#006d75' }} onClick={copyToClipboard}>Copy Link</Button>  
          <Button type="primary" style={{ backgroundColor: '#006d75', borderColor: '#006d75' }} onClick={onClose}>Done</Button>  
        </Space>  
      </div>  
    </Modal>  
  );  
};  

export default SuccessModal;