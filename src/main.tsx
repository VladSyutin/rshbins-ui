import '@fontsource/ubuntu/300.css';
import '@fontsource/ubuntu/300-italic.css';
import '@fontsource/ubuntu/400.css';
import '@fontsource/ubuntu/400-italic.css';
import '@fontsource/ubuntu/500.css';
import '@fontsource/ubuntu/500-italic.css';
import '@fontsource/ubuntu/700.css';
import '@fontsource/ubuntu/700-italic.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles/global.scss';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
