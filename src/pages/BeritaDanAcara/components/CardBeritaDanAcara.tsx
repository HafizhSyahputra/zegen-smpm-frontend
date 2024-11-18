import React from 'react';
import { Card, Typography, Button } from 'antd';
import { CalendarOutlined, ReadOutlined } from '@ant-design/icons';


const { Title, Paragraph } = Typography;

interface CardBeritaDanAcaraProps {
  title: string;
  date: string;
  description: string;
  imageUrl: string;
  link: string;
}

const CardBeritaDanAcara: React.FC<CardBeritaDanAcaraProps> = ({ title, date, description, imageUrl, link }) => {
  return (
    <Card
      hoverable
      cover={<img alt={title} src={imageUrl} />}
      className="card-berita-acara"
    >
      <div className="card-content">
        <Title level={4}>{title}</Title>
        <Paragraph type="secondary">
          <CalendarOutlined /> {date}
        </Paragraph>
        <Paragraph ellipsis={{ rows: 2 }}>{description}</Paragraph>
        <Button type="link" href={link} target="_blank" icon={<ReadOutlined />}>
          Read more
        </Button>
      </div>
    </Card>
  );
};

export default CardBeritaDanAcara;