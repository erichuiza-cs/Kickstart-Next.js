"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { usePersonalize } from "../../context/PersonalizeProvider";

const SPECIALTIES = [
  "ophthalmology",
  "dermatology",
  "orthopedics",
  "primary_care",
  "cardiology",
];

/**
 * Sends specialty as a Contentstack Personalize user attribute (if configured)
 * and deep-links with ?specialty= for UI state.
 */
export default function SpecialtyPicker() {
  const sp = useSearchParams();
  const active = sp.get("specialty")?.toLowerCase();
  const { sdk } = usePersonalize();
  const attrKey =
    process.env.NEXT_PUBLIC_PERSONALIZE_SPECIALTY_ATTR || "specialty";

  return (
    <div className="mb-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
        Contentstack Personalize
      </p>
      <p className="mb-3 text-xs text-slate-500">
        Pick a specialty — calls{" "}
        <code className="rounded bg-slate-100 px-1">sdk.set</code> with{" "}
        <code className="rounded bg-slate-100 px-1">{`{ ${attrKey} }`}</code>{" "}
        when Personalize is initialized (create the same attribute in your
        Personalize project). Then refresh or revisit to pick up new variants.
      </p>
      <div className="flex flex-wrap gap-2">
        {SPECIALTIES.map((s) => (
          <Link
            key={s}
            href={`/news?specialty=${s}`}
            className={`rounded-full px-3 py-1 text-xs font-medium no-underline transition ${
              active === s
                ? "bg-teal-700 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-teal-100"
            }`}
            onClick={() => {
              if (sdk) {
                void sdk.set({ [attrKey]: s }).catch(() => {});
              }
            }}
          >
            {s.replace(/_/g, " ")}
          </Link>
        ))}
      </div>
    </div>
  );
}
