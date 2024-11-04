import React from 'react';
import { List, Button, Typography } from 'antd';
import { EllipsisOutlined, RightOutlined } from '@ant-design/icons';

const { Text, Link } = Typography;

interface NotificationViewAllProps {
  notifications: any[];
  onClose: () => void;        // Function to close the modal
  onViewLess: () => void;     // Function for handling "View Less"
}

const NotificationViewAll: React.FC<NotificationViewAllProps> = ({ notifications, onClose, onViewLess }) => {
  const handleViewLess = () => {
    onViewLess();  // Call the onViewLess function
    onClose();     // Close the modal
  };

  return (
    <div
      style={{
        backdropFilter: 'blur(24px)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Notifications Header with Clear Button aligned */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px',
        }}
      >
        <Text style={{ fontSize: '24px', fontWeight: 'bold' }}>Notifications</Text>
        <Button 
          type="default" 
          danger 
          style={{ 
            backgroundColor: '#006677', 
            color: '#ffffff', 
            borderColor: '#006677' 
          }}
          onClick={onClose} // Call onClose when "Clear" is clicked
        >
          Clear
        </Button>
      </div>

      {/* Mark All As Read and View Less */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Button 
          type="default" 
          style={{ 
            backgroundColor: '#006677', 
            color: '#ffffff', 
            borderColor: '#006677' 
          }}
        >
          Mark All As Read
        </Button>
        <Link 
          style={{ fontSize: '14px', display: 'flex', alignItems: 'center' }} 
          onClick={handleViewLess} // Call handleViewLess when "View Less" is clicked
        >
          {/* <div style={{ display: 'flex', alignItems: 'center' }}>
            <RightOutlined style={{ fontSize: '13px', marginRight: '4px' }} />
            View Less
          </div> */}
        </Link>
      </div>

      {/* Notifications List */}
      <List
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item
            actions={[<EllipsisOutlined key="ellipsis" />]}
            style={{ 
              padding: '16px', 
              marginBottom: '12px', 
              backgroundColor: '#ffffff', 
              borderRadius: '8px', 
              border: '1px solid #f0f0f0', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
            }}
          >
            <List.Item.Meta
              title={<Text strong>{item.title}</Text>}
              description={
                <>
                  <Text>{item.description}</Text>
                  <br />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text type="secondary">{item.time}</Text>
                    <Text type="secondary">{item.category}</Text>
                  </div>
                </>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default NotificationViewAll;