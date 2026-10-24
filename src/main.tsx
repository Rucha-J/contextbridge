import React from 'react';
import ReactDOM from 'react-dom/client';
import { ContextBridgePRView } from './ContextBridgePRView';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ContextBridgePRView />
    </React.StrictMode>
  );
}
