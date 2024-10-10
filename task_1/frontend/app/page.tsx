"use client";

import { useState } from 'react';
import type { Dayjs } from 'dayjs';
import type { UploadProps } from 'antd';
import { UploadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, message, Upload, UploadFile, TimePicker, Space } from 'antd';

const Home = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [detail, setDetail] = useState<string | null>(null);

  const props: UploadProps = {
    beforeUpload: (file) => {
      const isXLSX = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      if (!isXLSX) {
        message.error(`${file.name} is not a .xlsx file`);
      }
      return isXLSX || Upload.LIST_IGNORE;
    },
    onChange: (info) => {
      setFileList(info.fileList);
    },
    fileList,
    customRequest: async ({ file, onSuccess }) => {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
            method: 'POST',
            body: formData,
        });


        if (!response.ok) {
          throw new Error('Upload failed');
        }

        message.success(`File uploaded successfully`);
        if (onSuccess)
          onSuccess(response, file);
      } catch (error) {
        message.error(`File upload failed.`);
        console.error(error);
      }
    },
  };

  const handleQuery = async () => {
    if (startTime && endTime) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/query?startTime=${startTime.format('HH:mm:ss')}&endTime=${endTime.format('HH:mm:ss')}`);

      const data = await response.json();

      if (!response.ok) {
        message.error(data.message);
        return;
      }

      setTotalAmount(data.totalAmount);
      setDetail(data.detail);
      
    } else {
      message.warning('Please select both start and end times');
    }
  };

  return (
    <div className='h-screen flex justify-center items-center'>
      <div className='flex space-x-8'>
        <div>
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </div>
        <div className='flex flex-col space-y-4'>
          <Space direction="vertical" size={12}>
            <TimePicker 
              format="HH:mm:ss" 
              placeholder="Start Time" 
              onChange={(time) => setStartTime(time)}
            />
            <TimePicker 
              format="HH:mm:ss" 
              placeholder="End Time" 
              onChange={(time) => setEndTime(time)}
            />
          </Space>
          <Button 
            type="primary" 
            icon={<SearchOutlined />} 
            onClick={handleQuery}
          >
            Query
          </Button>

          {totalAmount !== null && (
            <div>Total Amount: {totalAmount}</div>
          )}
          {detail && <p>{detail}</p>}
        </div>
      </div>
    </div>
  );
};

export default Home;