import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const mount = document.getElementById('thb-form');
const previewParams = new URLSearchParams(window.location.search);
const variant = previewParams.get('preview') || mount.dataset.variant || 'full';
const fullFormUrl = mount.dataset.fullFormUrl || window.location.origin + window.location.pathname;

createRoot(mount).render(
  <StrictMode>
    <App variant={variant} fullFormUrl={fullFormUrl} />
  </StrictMode>,
)
