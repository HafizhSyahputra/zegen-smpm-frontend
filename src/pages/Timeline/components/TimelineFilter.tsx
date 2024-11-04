import React from 'react';  
import { Select, Space } from 'antd';  

const { Option } = Select;  

type TimelineFilterProps = {  
  onFilterChange: (filter: string) => void;  
};  

const TimelineFilter: React.FC<TimelineFilterProps> = ({ onFilterChange }) => {  
  const handleFilterChange = (value: string) => {  
    onFilterChange(value);  
  };  

  return (  
    <div className="mb-4">  
      <Space>  
        <Select  
          style={{ width: 200 }}  
          onChange={handleFilterChange}  
          placeholder="Select filter"  
        >  
          <Option value="all">All</Option>  
          <Option value="completed">Completed</Option>  
          <Option value="pending">Pending</Option>  
        </Select>  
      </Space>  
    </div>  
  );  
};  

export default TimelineFilter;