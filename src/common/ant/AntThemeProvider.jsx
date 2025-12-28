import React from 'react';
import { ConfigProvider } from 'antd';

const theme = {
  token: {
    colorPrimary: '#8C57FF',
    colorBgBase: '#f3f4f6',
    colorTextBase: '#6b7280',
    borderRadiusLG: 12,
    colorBgContainer: '#ffffff',
    colorError: '#ff4d4f',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorInfo: '#1890ff',
  },
};

const AntThemeProvider = ({ children }) => (
  <ConfigProvider theme={theme}>
    {children}
  </ConfigProvider>
);

export default AntThemeProvider;
