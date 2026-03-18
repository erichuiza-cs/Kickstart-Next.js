import React, { createContext, useContext, useEffect, useState } from "react";
import Personalize from "@contentstack/personalize-edge-sdk";

const PersonalizeContext = createContext<{
  sdk: Awaited<ReturnType<typeof Personalize.init>> | null;
  getExperienceShortUid: () => Promise<string | null>;
} | null>(null);

export const PersonalizeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sdk, setSdk] = useState<Awaited<ReturnType<typeof Personalize.init>> | null>(null);

  useEffect(() => {
    const initializeSDK = async () => {
      const projectUid = process.env.NEXT_PUBLIC_PERSONALIZE_PROJECT_UID;
      if (projectUid) {
        try {
          const personalizeSdk = await Personalize.init(projectUid);
          setSdk(personalizeSdk);
        } catch (error) {
          console.error("Error initializing Personalize SDK:", error);
        }
      } else {
        console.error("Project UID is not defined in environment variables.");
      }
    };
    initializeSDK();
  }, []);

  const getExperienceShortUid = async (): Promise<string | null> => {
    if (!sdk) return null;
    try {
      const activeVariant = await sdk.getActiveVariant('');
      const experienceShortUid = '';//Object.keys(activeVariant) || null; // Adjust based on structure
      return experienceShortUid;
    } catch (error) {
      console.error("Error fetching Experience Short UID:", error);
      return null;
    }
  };

  return (
    <PersonalizeContext.Provider value={{ sdk, getExperienceShortUid }}>
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