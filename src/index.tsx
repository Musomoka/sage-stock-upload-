import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import './styles/wireframe.css';

const Office = (window as any).Office;

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);

  if (Office) {
    Office.onReady(() => {
      root.render(<App isOffice={true} />);
    });
  } else {
    // Running standalone (e.g., GitHub Pages)
    root.render(<App isOffice={false} />);
  }
}
