import React, { useState } from 'react';
import { Modal, Button, Row, Col } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';

const SubmitPaymentModal: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Media queries for responsiveness
  const isMediumScreen = useMediaQuery({ query: '(max-width: 1024px)' });
  const isMobileScreen = useMediaQuery({ query: '(max-width: 768px)' });

  // Fungsi untuk menampilkan modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Fungsi untuk menutup modal (ketika tombol Cancel diklik)
  const handleCancel = () => {
    setIsModalVisible(false); // Menutup modal dengan mengubah state
  };

  // Fungsi untuk submit (bisa ditambahkan logika submit)
  const handleSubmit = () => {
    console.log('Submit for payment clicked');
    setIsModalVisible(false); // Menutup modal setelah submit
  };

  // Adjust width and height based on screen size
  const modalWidth = 1110; // Tetapkan width 1110px
  const modalHeight = 378; // Tetapkan height 378px

  return (
    <div>
      {/* Tombol untuk menampilkan modal */}
      <Button type="primary" onClick={showModal}>
        Show Payment Modal
      </Button>

      {/* Modal untuk Submit Payment */}
      <Modal
        visible={isModalVisible}
        onCancel={handleCancel} // Pastikan modal menutup saat onCancel dipanggil
        footer={null}
        centered
        width={modalWidth} // Tetapkan lebar modal menjadi 1110px
        bodyStyle={{
          padding: '30px',
          height: `${modalHeight}px`, // Tetapkan tinggi modal menjadi 378px
        }}
        style={{ animation: 'pop-up 0.5s ease' }}
      >
        <h2 style={{ textAlign: 'center', fontSize: isMobileScreen ? '18px' : '22px' }}> {/* Ukuran font dikurangi */}
          Submit from Payment
        </h2>
        <p style={{ textAlign: 'center', fontSize: isMobileScreen ? '12px' : '14px' }}> {/* Ukuran font deskripsi dikurangi */}
          Silahkan selesaikan invoice berikut
        </p>

        <Row gutter={16}>
          <Col span={12}>
            <p style={{ fontSize: isMobileScreen ? '12px' : '14px' }}><strong>No. Faktur:</strong> INV2343-10-11</p>
          </Col>
          <Col span={12}>
            <p style={{ fontSize: isMobileScreen ? '12px' : '14px' }}><strong>Subject:</strong> Service per Oktober 2024</p>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <p style={{ fontSize: isMobileScreen ? '12px' : '14px' }}><strong>Tanggal:</strong> 10 November 2024</p>
          </Col>
          <Col span={12}>
            <p style={{ fontSize: isMobileScreen ? '12px' : '14px' }}><strong>Mata Uang:</strong> IDR - Rupiah</p>
          </Col>
        </Row>

        <p style={{ fontSize: isMobileScreen ? '12px' : '14px' }}><strong>Penerima Invoice:</strong> PT. Prisma Vista Solusi</p>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: isMobileScreen ? 'center' : 'space-between',
          padding: '10px 20px',
          border: '1px solid #d9d9d9',
          borderRadius: '5px',
          margin: '20px 0',
          flexDirection: isMobileScreen ? 'column' : 'row',
          textAlign: isMobileScreen ? 'center' : 'left',
        }}>
          <CheckCircleOutlined style={{ fontSize: '22px', color: '#52c41a', marginBottom: isMobileScreen ? '10px' : '0' }} /> {/* Ukuran font icon dikurangi */}
          <p style={{ margin: 0, fontSize: isMobileScreen ? '16px' : '18px' }}>Rp. 19.700.000,00</p> {/* Ukuran font total invoice */}
          <p style={{ margin: 0, fontWeight: 'bold', fontSize: isMobileScreen ? '12px' : '14px' }}>Invoice Total</p> {/* Ukuran font total label */}
        </div>

        <p style={{ textAlign: 'center', marginBottom: '20px', fontSize: isMobileScreen ? '12px' : '14px' }}>
          Silakan konfirmasi bahwa invoice sudah benar
        </p>

        <Row justify="center" gutter={16} style={{ marginTop: isMobileScreen ? '10px' : '20px' }}>
          <Col span={isMobileScreen ? 24 : undefined}>
            <Button onClick={handleCancel} style={{ 
              width: isMobileScreen ? '100%' : '160px', // Lebar tombol Cancel lebih besar di desktop
              padding: '10px 20px', // Menambahkan padding agar tombol terlihat lebih proporsional
              borderRadius: '6px', // Border-radius untuk sudut halus
              marginBottom: isMobileScreen ? '10px' : '0',
              backgroundColor: '#f5f5f5', // Warna latar belakang untuk tombol Cancel
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Menambahkan shadow agar lebih rapi
            }}>
              Cancel
            </Button>
          </Col>
          <Col span={isMobileScreen ? 24 : undefined}>
            <Button onClick={handleSubmit} type="primary" style={{ 
              width: isMobileScreen ? '100%' : '180px', // Memperbesar lebar tombol Submit agar proporsional
              padding: '10px 20px', // Menambahkan padding agar tombol terlihat lebih proporsional
              borderRadius: '6px', // Border-radius untuk sudut halus
              backgroundColor: '#008080', // Warna tombol sesuai dengan tema
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Menambahkan shadow agar lebih rapi
            }}>
              Submit For Payment
            </Button>
          </Col>
        </Row>

        <style jsx>{`
          @keyframes pop-up {
            from {
              transform: scale(0.9);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>
      </Modal>
    </div>
  );
};

export default SubmitPaymentModal;
