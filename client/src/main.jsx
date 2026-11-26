import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
      <SettingsProvider>
        <AuthProvider>
          <App />
        <Toaster
          position="top-right"
          containerStyle={{ top: 88 }}
          toastOptions={{
            duration: 3000,
            style: {
              background: "var(--toast-bg)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              color: "var(--toast-fg)",
              border: "1px solid var(--toast-border)",
              borderRadius: "12px",
            },
            success: {
              iconTheme: { primary: "#22c55e", secondary: "var(--toast-icon-secondary)" },
              style: { borderLeft: "3px solid #22c55e" },
            },
            error: {
              duration: 4000,
              iconTheme: { primary: "#ef4444", secondary: "var(--toast-icon-secondary)" },
              style: { borderLeft: "3px solid #ef4444" },
            },
          }}
        />
        </AuthProvider>
      </SettingsProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
