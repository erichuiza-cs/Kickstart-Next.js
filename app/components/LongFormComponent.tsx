import React, { useState, useEffect } from "react";
import { usePersonalize } from "../context/PersonalizeProvider";

interface LongFormProps {
  title: string;
  description: string;
  cta: string;
  first_name_label: string;
  last_name_label: string;
  email_label: string;
  experienceShortUid?: string; // Make optional to allow dynamic fetching
  $?: any;
}

const LongFormComponent: React.FC<LongFormProps> = ({
  title,
  description,
  cta,
  first_name_label,
  last_name_label,
  email_label,
  experienceShortUid,
  $,
}) => {
  const { sdk, getExperienceShortUid } = usePersonalize();
  const [formData, setFormData] = useState({ name: "", lastname: "", email: "", message: "" });
  const [resolvedExperienceUid, setResolvedExperienceUid] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperienceUid = async () => {
      if (!experienceShortUid && getExperienceShortUid) {
        const uid = await getExperienceShortUid();
        setResolvedExperienceUid(uid);
      }
    };

    fetchExperienceUid();
  }, [experienceShortUid, getExperienceShortUid]);

  useEffect(() => {
    const trackImpression = async () => {
      const uidToUse = experienceShortUid || resolvedExperienceUid;
      if (sdk && uidToUse) {
        try {
          await sdk.triggerImpression(uidToUse);
        } catch (error) {
          console.error("Failed to track impression:", error);
        }
      }
    };

    trackImpression();
  }, [sdk, experienceShortUid, resolvedExperienceUid]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (sdk) {
        await sdk.set({
          name: formData.name,
          lastname: formData.lastname,
          email: formData.email,
        });
        await sdk.triggerEvent("Form Submission");
      } else {
        console.error("Personalize SDK is not initialized.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="long-form" {...$}>
      <h2>{title}</h2>
      <p>{description}</p>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <label>
          {first_name_label}
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
        <label>
          {last_name_label}
          <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} />
        </label>
        <label>
          {email_label}
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </label>
        <label>
          Message
          <textarea name="message" value={formData.message} onChange={handleChange} />
        </label>
        <button type="submit">{cta}</button>
      </form>
    </div>
  );
};

export default LongFormComponent;