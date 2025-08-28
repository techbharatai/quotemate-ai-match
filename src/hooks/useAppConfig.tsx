import { useState, useEffect } from 'react';

export interface AppConfig {
  appName: string;
  logo: {
    text: string;
    fullName: string;
    imagePath: string;
  };
}

const defaultConfig: AppConfig = {
  appName: "QuoteMate",
  logo: {
    text: "QM",
    fullName: "QuoteMate AI",
    imagePath: "/logo.png"
  }
};

export const useAppConfig = (): AppConfig => {
  const [config, setConfig] = useState<AppConfig>(defaultConfig);

  useEffect(() => {
    // This could fetch from an API in the future
    // but for now we're using the default config
    setConfig(defaultConfig);
  }, []);

  return config;
};
