import { Button, Drawer, List, Typography } from "antd";
import { FC, useState } from "react";
import { CloseOutlined } from '@ant-design/icons';
import NotificationViewAll from "./NotificationViewAll";
 
const { Text } = Typography;

interface INotification {
  title: string;
  description: string;
  time: string;
  category: string;
}

interface INotificationSidebar {
  notifications: INotification[];
  open: boolean;
  onClose: () => void;
  onDelete: (index: number) => void;
}

const NotificationSidebar: FC<INotificationSidebar> = ({ notifications, open, onClose, onDelete }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleViewAll = () => {
    setIsModalVisible(true);
    // Drawer tetap terbuka dan modal muncul di bawah tombol "View All"
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  // Handle notification deletion
  const handleDelete = (index: number) => {
    onDelete(index);
  };

  return (
    <>
      <Drawer
        title="Notifications"
        placement="right"
        onClose={onClose}
        open={open}
        width={414}
        bodyStyle={{
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          overflow: "auto",
        }}
        extra={
          <Button 
            onClick={onClose} 
            style={{ backgroundColor: "#006677", color: "#ffffff", borderRadius: "8px" }}
          >
            Clear
          </Button>
        }
      >
        {/* View All button */}
        <Button
          type="link"
          onClick={handleViewAll}
          style={{
            color: "#006677", 
            fontWeight: "normal",
            textDecoration: "underline",
            display: "block",
            marginBottom: "12px",
            marginLeft: "auto",
          }}
        >
          View All
        </Button>
        
        {/* Notifications List */}
        <List
          itemLayout="horizontal"
          dataSource={notifications}
          renderItem={(item, index) => (
            <List.Item
              style={{
                position: "relative",
                boxShadow: "0px 4px 12px rgba(0, 0, 3, 0.15)",
                borderRadius: "8px",
                marginBottom: "16px",
                padding: "12px",
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.5)",
              }}
            >
              <List.Item.Meta
                title={<Text strong>{item.title}</Text>}
                description={
                  <>
                    <Text>{item.description}</Text>
                    <br />
                    <Text type="secondary" className="text-xs">
                      {item.time} • {item.category}
                    </Text>
                  </>
                }
              />
              <span 
                onClick={() => handleDelete(index)}
                style={{
                  cursor: "pointer",
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                }}
              >
                <CloseOutlined style={{ color: "#000000" }} />
              </span>
            </List.Item>
          )}
        />
        
        {/* Modal Full Screen with Slide In Animation, inside the Drawer */}
        <div className={`fixed inset-0 z-50 bg-white transition-transform duration-500 ease-in-out ${isModalVisible ? 'translate-x-0' : 'translate-x-full'}`}>
          {/* Header for close button */}
          <div className="flex items-center justify-between p-4 border-b">
          
            <Button onClick={handleCloseModal} icon={<CloseOutlined />} />
          </div>

          {/* Full content area */}
          <div className="p-4 overflow-auto h-[calc(100vh-60px)]">
            <NotificationViewAll notifications={notifications} onClose={handleCloseModal} onViewLess={function (): void {
              throw new Error("Function not implemented.");
            } } />
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default NotificationSidebar;