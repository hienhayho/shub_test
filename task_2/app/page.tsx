"use client";

import React, { useState } from 'react';
import { Button, DatePicker, Input, Select, Typography, Space, Modal } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const { Title } = Typography;
const { Option } = Select;

type FormData = {
  time: dayjs.Dayjs;
  quantity: number;
  pump: string;
  revenue: number;
  price: number;
};

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    time: dayjs(),
    quantity: 0,
    pump: 'pump1',
    revenue: 0,
    price: 0,
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDateChange = (date: dayjs.Dayjs) => {
    setFormData({ ...formData, time: date });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, pump: value });
  };

  return (
    <div 
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
      }}
    >
      <div 
        style={{
          width: "50%",
          padding: 20,
          border: '1px solid #ddd',
          borderRadius: 8,
          backgroundColor: '#fff',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <Button type="link">Đóng</Button>
          <Title level={3}>Nhập giao dịch</Title>
          <Button type="primary" onClick={showModal}>
            Cập nhật
          </Button>
        </div>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={5}>Thời gian</Title>
            <DatePicker
              showTime
              value={formData.time}
              onChange={handleDateChange}
              format="DD/MM/YYYY HH:mm:ss"
              style={{ width: '100%' }}
            />
          </Space>

          <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={5}>Số lượng</Title>
            <Input
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="Nhập số lượng"
              style={{ width: '100%' }}
            />
          </Space>

          <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={5}>Trụ</Title>
            <Select
              value={formData.pump}
              onChange={handleSelectChange}
              placeholder="Chọn trụ"
              style={{ width: '100%' }}
              defaultValue={formData.pump}
            >
              <Option value="pump1">Trụ 1</Option>
              <Option value="pump2">Trụ 2</Option>
              <Option value="pump3">Trụ 3</Option>
            </Select>
          </Space>

          <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={5}>Doanh thu</Title>
            <Input
              name="revenue"
              type="number"
              value={formData.revenue}
              onChange={handleInputChange}
              placeholder="Nhập doanh thu"
              style={{ width: '100%' }}
            />
          </Space>

          <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={5}>Đơn giá</Title>
            <Input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Nhập đơn giá"
              style={{ width: '100%' }}
            />
          </Space>
        </Space>
        <Modal title="Thông tin đã nhập !" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <p><strong>Thời gian:</strong> {formData.time.format('DD/MM/YYYY HH:mm:ss')}</p>
          <p><strong>Số lượng:</strong> {formData.quantity}</p>
          <p><strong>Trụ:</strong> {formData.pump}</p>
          <p><strong>Doanh thu:</strong> {formData.revenue}</p>
          <p><strong>Đơn giá:</strong> {formData.price}</p>
        </Modal>

        <style jsx>{`
          @media (max-width: 768px) {
            div[style*="width: 50%"] {
              width: 90% !important;
            }
          }
      `}</style>
      </div>
    </div>
  );
};

export default Home;
