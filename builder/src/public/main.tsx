import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import PublicCalculator from './PublicCalculator';
import '../app/app.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PublicCalculator />
  </StrictMode>,
);
