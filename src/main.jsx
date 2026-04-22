import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const previewParams = new URLSearchParams(window.location.search);

document.querySelectorAll('[data-thb-form]').forEach((mount) => {
  const variant = previewParams.get('preview') || mount.dataset.variant || 'full';
  const fullFormUrl = mount.dataset.fullFormUrl || window.location.origin + window.location.pathname;

  createRoot(mount).render(
    <StrictMode>
      <App variant={variant} fullFormUrl={fullFormUrl} />
    </StrictMode>,
  );
});
