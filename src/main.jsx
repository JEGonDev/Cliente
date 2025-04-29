import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import './ui/theme/globalStyles.css';
// Se importa la configuración de Axios para que se ejecute
import './common/config/api';
import { AppProviders } from './context/AppProviders';

createRoot(document.getElementById('root')).render(
    <AppProviders>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </AppProviders>
);
