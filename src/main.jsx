import { GoogleOAuthProvider } from "@react-oauth/google";
import ReactDOM from 'react-dom/client';
import AppRouter from './router/AppRouter.jsx';
import './index.css';
import "./css/global.css";


ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <AppRouter/>
  </GoogleOAuthProvider>
);
