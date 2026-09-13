import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { tangkapKodRujukan } from './config/contactAdmin';

// Fasa 2: tangkap ?ref= SEBELUM React dimuatkan, supaya kod affiliate tidak
// hilang apabila URL dibersihkan oleh navigasi/pelayar.
tangkapKodRujukan();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
