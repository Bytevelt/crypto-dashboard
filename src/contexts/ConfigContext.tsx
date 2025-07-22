import React, { createContext, ReactNode, useContext } from "react";
import configJson from "../config/config.json";

interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigContext = createContext<any>(null);

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  return (
    <ConfigContext.Provider value={configJson}>
      {children}
    </ConfigContext.Provider>
  );
};

export function useConfig(): any {
  return useContext(ConfigContext);
}
