import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { CLIENT } from './clientConfig';
import { ConfigProvider } from '../core/runtime/ConfigProvider';
import './styles.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element missing');

createRoot(root).render(
  <StrictMode>
    <ConfigProvider config={CLIENT}>
      <App />
    </ConfigProvider>
  </StrictMode>,
);
