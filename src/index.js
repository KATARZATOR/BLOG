import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import App from './App';
import './index.css';
import { UserProvider } from './UserContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <HashRouter>
      <ConfigProvider
        theme={{
          components: {
            Pagination: {
              itemActiveBg: '#1890ff',
              itemActiveColor: '#ffffff',
              itemBg: '#EBEEF3',
              itemHoverBg: '#d6dbe0',
            },
          },
        }}
      >
        <UserProvider>
          <App />
        </UserProvider>
      </ConfigProvider>
    </HashRouter>
  </React.StrictMode>,
);
