import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Toast notification container - hiển thị ở góc trên bên phải */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: "DM Sans, sans-serif",
            fontSize: "14px",
            background: "#1a1812",
            color: "#f5f4f0",
          },
          success: { iconTheme: { primary: "#f59e0b", secondary: "#1a1812" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
        }}
      />
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
