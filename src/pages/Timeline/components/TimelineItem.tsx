import React, { useEffect, useState } from 'react';  
import { message } from 'antd';  
import { StagingJobOrder } from '@smpm/models/timelineModel';  
import { getUserById } from '@smpm/services/userService';  
import { IUserModel } from '@smpm/models/userModel';  
import { formatDateIndo } from '@smpm/utils/dateUtils';  
import { downloadMedia } from '@smpm/services/timelineService';  

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

  const handleDownload = async (filename: string) => {  
    if (!filename) return;  
    
    try {  
       const actualFileName = filename.split('/').pop();  
      if (!actualFileName) {  
        throw new Error('Invalid filename');  
      }  
      
      console.log('Downloading file:', actualFileName);   
      
      const blob = await downloadMedia(actualFileName);  
      
      const url = window.URL.createObjectURL(blob);  
      const link = document.createElement('a');  
      link.href = url;  
      link.download = actualFileName; 
      
      document.body.appendChild(link);  
      link.click();  
      
      setTimeout(() => {  
        link.remove();  
        window.URL.revokeObjectURL(url);  
      }, 100);  
      
      message.success('File downloaded successfully');  
    } catch (error) {  
      console.error('Error downloading file:', error);  
      message.error('Failed to download file');  
    }  
  };

  const updatedAtDateString = data.updated_at.toString();  
  const updatedAtDate = formatDateIndo(updatedAtDateString);  

  return (  
    <div className={`relative flex flex-col md:flex-row items-start mb-6 ${isLast ? "" : "border-b pb-6"}`}>  
      <div className="w-full md:w-2/6 mb-2 md:mb-0 text-sm font-thin text-gray-400">  
        <span>{updatedAtDate}</span>  
      </div>  
      <div className="w-full md:w-4/5 relative">  
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#006677]"></div>  
        <div className="absolute left-[-4px] top-1 md:w-2.5 h-3 md:h-2.5 rounded-full bg-cyan-800"></div>  
        <div className="bg-gray-100 p-6 md:p-8 rounded-lg shadow-lg">  
            <h3 className="text-black font-semibold text-lg">  
              {data.staging?.name || 'No Title'}  
            </h3>  

          {updatedByUser && (  
            <p className="text-sm text-black mb-2">  
              By: {updatedByUser.name}  
            </p>  
          )}  

          {data.reason && (  
            <p className="mb-2 text-black">  
              Reason: {data.reason}  
            </p>  
          )}  

          {data.cancel_type && (  
            <p className="mb-2 text-black">  
              Cancel Type: {data.cancel_type}  
            </p>  
          )}  

          {data.petugas && (  
            <p className="mb-2 text-black">  
              Petugas: {data.petugas}  
            </p>  
          )}  
          {data.photo_evidence && data.photo_evidence.length > 0 && (  
            <div className="border-t pt-3">  
              <p className="text-sm text-black">  
                Photo Evidence: {' '}  
                <span  
                  onClick={() => data.photo_evidence && handleDownload(data.photo_evidence)}  
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"  
                >  
                  {data.photo_evidence.split('/').pop()}  
                </span>  
              </p>  
            </div>  
          )}  

          {data.photo_optional && data.photo_optional.length > 0 && (  
            <div className="mt-2">  
              <p className="text-sm text-black">  
                Photo Optional: {' '}  
                <span  
                  onClick={() => data.photo_optional && handleDownload(data.photo_optional)}  
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"  
                >  
                  {data.photo_optional.split('/').pop()}  
                </span>  
              </p>  
            </div>  
          )}  
        </div>  
      </div>  
    </div>  
  );  
};  

export default TimelineItem;