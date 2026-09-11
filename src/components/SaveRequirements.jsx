import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useHub } from "../hooks/useHub";

export default function SaveRequirements({
  categories,
  business = {},
  specialLicence = false,
}) {
  const { isAuthenticated } = useAuth();
  const { update, error } = useHub();
  const [saved, setSaved] = useState("");
  const signature = JSON.stringify({ categories, business, specialLicence });
  if (!isAuthenticated)
    return (
      <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-5 text-sm">
        <p className="font-bold text-primary">
          Keep your requirements in My Hub
        </p>
        <p className="mt-2 text-gray-600">
          You can continue browsing freely. Sign in to save a checklist from the
          results of your next check.
        </p>
        <Link to="/login" className="mt-3 inline-block font-bold text-primary">
          Sign in →
        </Link>
      </div>
    );
  return (
    <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-5">
      <button
        className="rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-secondary"
        onClick={() => {
          if (
            update((data) => ({
              ...data,
              requirements: {
                categories: [...new Set(categories)],
                business,
                specialLicence,
                savedAt: new Date().toISOString(),
              },
            }))
          )
            setSaved(signature);
        }}
      >
        Save to My Hub
      </button>
      <p role="status" className="mt-2 text-sm text-gray-600">
        {saved === signature
          ? "Requirements saved in this browser. Your training and fee estimates are updated."
          : "Save this checklist to update your My Hub requirements."}
      </p>
      {saved === signature && (
        <Link
          to="/dashboard"
          className="mt-2 inline-block text-sm font-bold text-primary"
        >
          Open My Hub →
        </Link>
      )}
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
