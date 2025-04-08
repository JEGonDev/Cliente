import { createRoot } from 'react-dom/client'
import { App } from './App'
import './ui/theme/globalStyles.css'
import axios from 'axios'
import { BrowserRouter } from 'react-router-dom'

window.axios = axios
window.axios.defaults.baseURL = 'https://reqres.in/api'
window.axios.defaults.headers.common['Accept'] = 'application/json'
window.axios.defaults.headers.common['Content-Type'] = 'application/json'
window.axios.defaults.headers.common['X-Requested-with'] = 'XMLHttpRequest'
// window.axios.defaults.withCredentials = true

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>

)
