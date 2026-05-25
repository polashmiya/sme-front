import React from 'react';
import { ConfigProvider, theme as antTheme } from 'antd';
import { useSelector } from 'react-redux';

// Light tokens: EXACT original values — do not change these
const lightTokens = {
  colorPrimary: '#8C57FF',
  colorBgBase: '#f3f4f6',
  colorTextBase: '#6b7280',
  borderRadiusLG: 12,
  colorBgContainer: '#ffffff',
  colorError: '#ff4d4f',
  colorSuccess: '#52c41a',
  colorWarning: '#faad14',
  colorInfo: '#1890ff',
};

const darkTokens = {
  colorPrimary: '#8C57FF',
  colorBgBase: '#0f172a',
  colorTextBase: '#e2e8f0',
  borderRadiusLG: 12,
  colorBgContainer: '#1e293b',
  colorBorderSecondary: '#334155',
  colorSplit: '#334155',
  colorError: '#ff4d4f',
  colorSuccess: '#52c41a',
  colorWarning: '#faad14',
  colorInfo: '#1890ff',
};

const AntThemeProvider = ({ children }) => {
  const darkMode = useSelector(s => s.ui.darkMode);

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: darkMode ? darkTokens : lightTokens,
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default AntThemeProvider;
