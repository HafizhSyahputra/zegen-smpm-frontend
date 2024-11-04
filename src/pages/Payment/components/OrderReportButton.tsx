import React, { useState, useEffect } from 'react';  
import { Button, Typography, notification } from 'antd';  
import { FileTextOutlined, DownloadOutlined } from '@ant-design/icons';  
import jsPDF from 'jspdf';  
import logoBNI from '../../../assets/logo_bni-removebg-preview.png';
import { ColumnsType } from 'antd/es/table';  

interface InvoiceItem {  
  description: string;  
  hargaSusana: string;  
}  

interface OrderReportButtonProps {  
  columns: ColumnsType<InvoiceItem>;  
  data: InvoiceItem[];  
}  

const { Text } = Typography;  

const OrderReportButton: React.FC<OrderReportButtonProps> = ({ columns, data }) => {  
  const [pdfSize, setPdfSize] = useState<string | null>('0kb');  
  const [logoBNIBase64, setLogoBNIBase64] = useState<string | null>(null);  

  useEffect(() => {  
    const loadLogo = async () => {  
      try {  
        const response = await fetch(logoBNI);  
        const blob = await response.blob();  
        const base64 = await new Promise<string>((resolve) => {  
          const reader = new FileReader();  
          reader.onload = () => resolve(reader.result as string);  
          reader.readAsDataURL(blob);  
        });  
        setLogoBNIBase64(base64);  
      } catch (error) {  
        console.error('Error loading logo:', error);  
      }  
    };  
    loadLogo();  
  }, []);  

  const downloadPDF = () => {  
    try {  
      const doc = new jsPDF('p', 'pt', 'a4');  

      // Add BNI logo using addSvgAsImage  
      if (logoBNIBase64) {  
        const logoWidth = 90;  
        const logoHeight = 30;  
        doc.addImage(logoBNIBase64, 'PNG', 40, 40, logoWidth, logoHeight);  
      }

      // Margin and padding settings  
      const marginX = 40;  
      const marginY = 95;  
      const lineHeight = 15;  
      let currentY = marginY;  

      // PDF header  
      doc.setFontSize(20);  
      doc.setFont('helvetica', 'bold');  
      doc.text('Invoice Report', marginX, currentY);  
      currentY += lineHeight * 2;  

      // Use data from InvoiceHeader  
      const invoiceNumber = 'INV23434-10-11';  
      const dueDate = '10 November 2024';  
      const billedTo = 'PT. PRISMA VISTA SOLUSI';  
      const currency = 'IDR - Indonesian Rupiah';  

      doc.setFontSize(12);  
      doc.setFont('helvetica', 'normal');  
      doc.text(`No. Faktur: ${invoiceNumber}`, marginX, currentY);  
      doc.text(`Due Date: ${dueDate}`, marginX, currentY + lineHeight);  
      doc.text(`Billed to: ${billedTo}`, marginX, currentY + 2 * lineHeight);  
      doc.text(`Currency: ${currency}`, marginX, currentY + 3 * lineHeight);  
      currentY += 4 * lineHeight;  

      // Separator line  
      doc.setLineWidth(1.5);  
      doc.line(marginX, currentY, 550, currentY);  
      currentY += lineHeight;  

      // Define column widths  
      const columnWidths = {  
        description: 300,  
        hargaSusana: 150,  
      };  

      // Add table headers  
      doc.setFont('helvetica', 'bold');  
      doc.setFillColor(230, 230, 230);  
      doc.rect(marginX, currentY, 500, 25, 'F');  

      columns.forEach((column, index) => {  
        let columnX = marginX;  
        if (index > 0) {  
          columnX += columnWidths.description;  
        }  
        doc.text(column.title, columnX, currentY + 17);  
      });  

      currentY += 35;  

      // Add data rows  
      data.forEach((item, index) => {  
        if (index % 2 === 0) {  
          doc.setFillColor(245, 245, 245);  
          doc.rect(marginX, currentY - 15, 500, 20, 'F');  
        }  
        doc.setFont('helvetica', 'normal');  

        let descriptionX = marginX;  
        let hargaSusanaX = marginX + columnWidths.description;  

        doc.text(item.description, descriptionX, currentY);  
        doc.text(item.hargaSusana, hargaSusanaX, currentY);  

        currentY += 20;  
      });  

      // Separator line below the table  
      doc.line(marginX, currentY - 10, 550, currentY - 10);  

      // Subtotal, Tax, and Total with closer spacing  
      currentY += lineHeight;  
      doc.setFontSize(12);  
      doc.text('Subtotal', marginX + 300, currentY);  
      doc.text('Rp 19,000,000.00', marginX + 400, currentY);  
      currentY += lineHeight;  
      doc.text('Pajak 10%', marginX + 300, currentY);  
      doc.text('Rp 1,900,000.00', marginX + 400, currentY);  
      currentY += lineHeight * 0.75;  

      // Separator line before total, raised slightly  
      doc.setLineWidth(1.5);  
      doc.line(marginX + 300, currentY - 7, 550, currentY - 7);  
      currentY += lineHeight * 0.75;  

      doc.setFontSize(14);  
      doc.setFont('helvetica', 'bold');  
      doc.text('Total', marginX + 300, currentY);  
      doc.text('Rp 19,700,000.00', marginX + 400, currentY);  

      // Separator line below total  
      doc.setLineWidth(1.5);  
      doc.line(marginX, currentY + 10, 550, currentY + 10);  

      // Footer without "Finance Dept"  
      const footerY = currentY + 60;  
      doc.setFontSize(12);  
      doc.setFont('helvetica', 'normal');  
      doc.text('PT. PRISMA VISTA SOLUSI', marginX, footerY);  

      // Calculate PDF size before saving  
      const pdfBlob = doc.output('blob');  
      const pdfSize = `${(pdfBlob.size / 1024).toFixed(1)}kb`;  
      setPdfSize(pdfSize);  

      // Save the PDF  
      doc.save('invoice_report.pdf');  
    } catch (error) {  
      console.error('Error generating PDF:', error);  
      notification.error({  
        message: 'Failed to generate PDF',  
        description: 'Please try again later.',  
      });  
    }  
  };  

  return (  
    <Button  
      icon={<FileTextOutlined />}  
      type="text"  
      className="mt-4 flex items-center border rounded-md shadow-sm hover:bg-gray-50 border-gray-300"  
      style={{ height: 'auto', padding: '8px 16px' }}  
      onClick={downloadPDF}  
    >  
      <div className="flex flex-col items-start">  
        <span className="font-medium">Order Report</span>  
        <Text type="secondary" className="text-xs">  
          {pdfSize}  
        </Text>  
      </div>  
      <div className="ml-5 flex items-center">  
        <Text className="text-blue-500 mr-1">Download</Text>  
        <DownloadOutlined className="text-blue-500" />  
      </div>  
    </Button>  
  );  
};  

export default OrderReportButton;