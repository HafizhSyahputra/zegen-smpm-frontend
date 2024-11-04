import React, { useEffect, useState } from 'react';  
import { StagingJobOrder } from '@smpm/models/timelineModel';  
import { getUserById } from '@smpm/services/userService';  
import { IUserModel } from '@smpm/models/userModel';  
import { formatDateIndo } from '@smpm/utils/dateUtils';  

interface TimelineItemProps {  
  data: StagingJobOrder;  
  isLast: boolean;  
}  

const TimelineItem: React.FC<TimelineItemProps> = ({ data, isLast }) => {  
  const [updatedByUser, setUpdatedByUser] = useState<IUserModel | null>(null);  

  useEffect(() => {  
    const fetchUserData = async () => {  
      if (data.updated_by) {  
        try {  
          const response = await getUserById(data.updated_by);  
          setUpdatedByUser(response.result);    
        } catch (error) {  
          console.error('Error fetching user data:', error);  
        }  
      }  
    };  

    fetchUserData();   
  }, [data.updated_by]);   

  const updatedAtDateString = data.updated_at.toString();  
  const updatedAtDate = formatDateIndo(updatedAtDateString);  

  return (  
    <div className={`relative flex flex-col md:flex-row items-start mb-6 ${isLast ? "" : "border-b"}`}>  
      <div className="w-full md:w-2/6 mb-2 md:mb-0 text-sm font-thin text-gray-400">  
        <span>{updatedAtDate}</span>  
      </div>  
      <div className="w-full md:w-4/5 relative">  
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#006677]"></div>  
        <div className="absolute left-[-4px] top-1 md:w-2.5 h-3 md:h-2.5 rounded-full bg-cyan-800"></div>  
        <div className="bg-gray-100 p-6 md:p-8 rounded-lg shadow-lg">  
          <h3 className="text-black font-semibold mb-2 text-lg">{data.staging?.name || 'No Title'}</h3>  
          {updatedByUser && <p className="mb-1">By: {updatedByUser.name}</p>}   
          {data.reason && <p className="mb-1">{data.reason}</p>}  
          {data.petugas && <p className="mb-1">Petugas: {data.petugas}</p>}  
          {data.photo_evidence && (  
            <p className="mb-1">  
              Photo Evidence: {data.photo_evidence}  
            </p>  
          )}  
          {data.photo_optional && (  
            <p className="mb-1">  
              Photo Optional: {data.photo_optional}  
            </p>  
          )}  
        </div>  
      </div>  
    </div>  
  );  
};  

export default TimelineItem;