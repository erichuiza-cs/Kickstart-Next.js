import React, { useState, useEffect } from "react";
import { usePersonalize } from "../context/PersonalizeProvider";
import Personalize from "@contentstack/personalize-edge-sdk";

interface ShortFormProps {
  title: string;
  description: string;
  cta: string;
  first_name_label: string;
  email_label: string;
  experienceShortUid?: string; // Make optional to allow dynamic fetching
  $?: any;
}

const ShortFormComponent: React.FC<ShortFormProps> = ({
  title,
  description,
  cta,
  first_name_label,
  email_label,
  experienceShortUid,
  $,
}) => {
  const personalizeSdk = usePersonalize();
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [resolvedExperienceUid, setResolvedExperienceUid] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperienceUid = async () => {
      if (!experienceShortUid && personalizeSdk) {
        try {
          //const activeVariant = await personalizeSdk.sdk.getActiveVariant('');
          const experienceUid = '' //Object.keys(activeVariants)[0] || null; // Adjust based on structure
          setResolvedExperienceUid(experienceUid);
        } catch (error) {
          console.error("Failed to fetch Experience Short UID:", error);
        }
      }
    };

    fetchExperienceUid();
  }, [personalizeSdk, experienceShortUid]);

  useEffect(() => {
    const trackImpression = async () => {
      const uidToUse = experienceShortUid || resolvedExperienceUid;
      if (personalizeSdk && uidToUse) {
        try {
          await personalizeSdk?.sdk?.triggerImpression(uidToUse); // Use resolved UID
        } catch (error) {
          console.error("Failed to track impression:", error);
        }
      }
    };

    trackImpression();
  }, [personalizeSdk, experienceShortUid, resolvedExperienceUid]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (personalizeSdk) {
        await personalizeSdk?.sdk?.set({
          name: formData.name,
          email: formData.email,
        });
        await personalizeSdk?.sdk?.triggerEvent("Form Submission");
      } else {
        console.error("Personalize SDK is not initialized.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="short-form" {...$}>
      <h2>{title}</h2>
      <p>{description}</p>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <label>
          {first_name_label}
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
        <label>
          {email_label}
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </label>
        <button type="submit">{cta}</button>
      </form>
    </div>
  );
};

export default ShortFormComponent;