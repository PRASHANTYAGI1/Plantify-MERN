import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

import { ProductProvider } from "./context/ProductContext";  // ✅ FIXED

const theme = createTheme({
  palette: {
    primary: { main: "#0f766e" },
    secondary: { main: "#059669" },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <ThemeProvider theme={theme}>
            <App />
            <Toaster position="top-right" />
          </ThemeProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
