import { createContext, useContext, useEffect, useState } from "react";
import * as settingsService from "../services/settingsService";

const emptySettings = {
  name: "",
  role: "",
  greeting: "",
  tagline: "",
  location: "",
  email: "",
  profileImageUrl: "",
  bio: [],
};

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(emptySettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    settingsService
      .getSettings()
      .then((res) => setSettings({ ...emptySettings, ...res.data?.data }))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const initials = settings.name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <SettingsContext.Provider value={{ settings, initials, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
