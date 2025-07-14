import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import './index.css';
// import App from './App';
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes /> {/* atau <App /> kalau routing di App.js */}
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// root.render(<App />);

// root.render(
//   <React.StrictMode>
//     <ThemeProvider>
//       <App />
//     </ThemeProvider>
//   </React.StrictMode>
// );

