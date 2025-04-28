import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import './ui/theme/globalStyles.css';
// Se importa la configuración de Axios para que se ejecute
import './common/config/api';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);
