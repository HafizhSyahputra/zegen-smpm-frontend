import  { useState } from 'react';
import PageContent from "@smpm/components/PageContent";  
import PageLabel from "@smpm/components/pageLabel";  
import Page from "@smpm/components/pageTitle";  
import { Breadcrumb, Card, Divider, Typography, message } from "antd";   
import { HomeOutlined } from "@ant-design/icons";  
import { IconFile } from "@tabler/icons-react";
import BeritaTable from './components/BeritaTable';

const { Title } = Typography;  

const BeritaDanAcaraPage = () => {  
  const [fileList, setFileList] = useState<any[]>([]);

  const handleUpload = (info: any) => {
    const { file } = info;

    // Simulasikan bahwa file selesai diunggah setelah ditambahkan
    setFileList((prevFileList) => [
      ...prevFileList,
      {
        key: prevFileList.length,
        name: file.name,
        uploadDate: new Date().toLocaleDateString(),
        status: 'done',
      },
    ]);
    message.success(`${file.name} berhasil ditambahkan ke tabel.`);
  };

  return (  
    <Page title={"Berita dan Acara"}>  
      <PageLabel  
        title={<span className="font-semibold text-2xl">Berita dan Acara</span>}  
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
                href: "/berita-acara",  
                title: (  
                  <div className="flex gap-0">  
                    <IconFile className="w-5 h-[18px]" />  
                    <span>Berita dan Acara</span>  
                  </div>  
                ),  
              },  
            ]}  
          />  
        }  
      />  
      <PageContent>  
        <Card>  
          <div className="flex justify-between items-end mb-4">  
            <Title level={3} style={{ margin: 0 }}>Berita dan Acara</Title>  
          </div>  
          <Divider />  
          <BeritaTable fileList={fileList} /> {/* Mengoper fileList sebagai prop */}
        </Card>  
      </PageContent>  
    </Page>  
  );  
};  

export default BeritaDanAcaraPage;