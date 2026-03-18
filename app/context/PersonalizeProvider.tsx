"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Personalize from "@contentstack/personalize-edge-sdk";

const PersonalizeContext = createContext<{
  sdk: Awaited<ReturnType<typeof Personalize.init>> | null;
  ready: boolean;
  getExperienceShortUid: () => Promise<string | null>;
} | null>(null);

export const PersonalizeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sdk, setSdk] = useState<Awaited<ReturnType<typeof Personalize.init>> | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const projectUid = process.env.NEXT_PUBLIC_PERSONALIZE_PROJECT_UID;
    if (!projectUid) {
      setReady(true);
      return;
    }
    const initializeSDK = async () => {
      try {
        const personalizeSdk = await Personalize.init(projectUid);
        setSdk(personalizeSdk);
      } catch (error) {
        console.error("Error initializing Contentstack Personalize SDK:", error);
      } finally {
        setReady(true);
      }
    };
    void initializeSDK();
  }, []);

  const getExperienceShortUid = async (): Promise<string | null> => {
    if (!sdk) return null;
    try {
      await sdk.getActiveVariant("");
      const experienceShortUid = "";
      return experienceShortUid;
    } catch (error) {
      console.error("Error fetching Experience Short UID:", error);
      return null;
    }
  };

  return (
    <PersonalizeContext.Provider value={{ sdk, ready, getExperienceShortUid }}>
      {children}
    </PersonalizeContext.Provider>
  );
};

export const usePersonalize = () => {
  const context = useContext(PersonalizeContext);
  if (!context) {
    throw new Error("usePersonalize must be used within a PersonalizeProvider");
  }
  return context;
};