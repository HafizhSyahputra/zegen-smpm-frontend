import React, { useState, useEffect } from 'react';  
import { Breadcrumb, Card, Divider, Flex, Spin, Typography } from "antd";  
import { HomeOutlined } from "@ant-design/icons";  
import PageContent from "@smpm/components/PageContent";  
import PageLabel from "@smpm/components/pageLabel";  
import { IconSortDescendingNumbers, IconTimeline } from "@tabler/icons-react";  
import Page from "@smpm/components/pageTitle";  
import { getTimelineData } from '@smpm/services/timelineService';  
import { useParams } from 'react-router-dom';  
import { StagingJobOrder } from '@smpm/models/timelineModel';  
import TimelineItem from './components/TimelineItem';
 
const { Title } = Typography;  

const TimelinePage: React.FC = () => {  
  const { no_jo } = useParams<{ no_jo: string }>();  
  const [staging, setTimelineData] = useState<StagingJobOrder[]>([]);  
  const [loading, setLoading] = useState(false);  

  useEffect(() => {  
    const fetchTimelineData = async () => {  
      setLoading(true);  
      try {  
        const response = await getTimelineData({  
          page: 1,  
          take: 10,  
          order: 'desc',  
          order_by: 'date',  
          search_by: ['job_order_no', 'title'],  
          no_jo: no_jo || '',  
        });  
    
        if (response.status.code === 200) {  
          // Sort data in descending order based on created_at  
          const sortedData = response.result.sort((a, b) => {  
            return new Date(b.created_at) - new Date(a.created_at);  
          });  
          setTimelineData(sortedData); // Use sorted data  
        } else {  
          setTimelineData([]);  
        }  
      } catch (error) {  
        console.error('Error fetching timeline data:', error);  
        setTimelineData([]);  
      } finally {  
        setLoading(false);  
      }  
    };

    if (no_jo) {  
      fetchTimelineData();  
    }  
  }, [no_jo]);  

  return (  
    <Page title="Timeline">  
      {loading ? (  
        <div className="flex justify-center items-center h-64">  
          <Spin size="large" />  
        </div>  
      ) : (  
        <>  
          <PageLabel  
            title={<span className="font-semibold text-2xl">Activity Timeline</span>}  
            subtitle={  
              <Breadcrumb  
                items={[  
                  {  
                    href: "/",  
                    title: (  
                      <>  
                        <HomeOutlined />  
                        <span>Home</span>  
                      </>  
                    ),  
                  },  
                  {  
                    title: (  
                      <>  
                        <IconSortDescendingNumbers size="1rem" className='mr-1' />  
                        <span>Job Order</span>  
                      </>  
                    ),  
                  },  
                  {  
                    href: "/job-order/activity",  
                    title: (  
                      <>  
                        <IconSortDescendingNumbers size="1rem" className='mr-1' />  
                        <span>Activity Job Order</span>  
                      </>  
                    ),  
                  },  
                  {  
                    href: "#",  
                    title: (  
                      <div className="flex gap-0">  
                        <IconTimeline className="w-5 h-[18px]" />  
                        <span>Activity Timeline</span>  
                      </div>  
                    ),  
                  },  
                ]}  
              />  
            }  
          />  
          <PageContent>  
            <Card className="w-full">  
              <Flex justify="space-between" align="flex-end">  
                <Title level={3}>Activity Timeline</Title>  
              </Flex>  
              <Divider />  
              <div className="flex justify-center pb-10 px-4 sm:px-0">  
                <div className="w-full sm:w-4/3 lg:w-4/5 bg-white p-5 sm:p-10 rounded-lg">  
                                {Array.isArray(staging) && staging.length > 0 ? (  
                  staging.map((item, index) => (  
                    <TimelineItem key={item.id} data={item} isLast={index === staging.length - 1} />  
                  ))  
                ) : (  
                  <div className="flex justify-center items-center h-64">  
                    <Typography.Text>No timeline data available.</Typography.Text>  
                  </div>  
                )}
                </div>  
              </div>  
            </Card>  
          </PageContent>  
        </>  
      )}  
    </Page>  
  );  
};  

export default TimelinePage;