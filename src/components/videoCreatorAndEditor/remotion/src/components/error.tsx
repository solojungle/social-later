import React from "react";

export const ErrorComp: React.FC<{
  message: string;
}> = ({ message }) => {
  return (
    <div className="text-geist-error font-geist py-geist-half">
      <svg
        className="mr-1.5 inline h-5 align-text-bottom"
        fill="none"
        shapeRendering="geometricPrecision"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" fill="var(--geist-fill)" r="10" />
        <path d="M12 8v4" stroke="currentColor" />
        <path d="M12 16h.01" stroke="currentColor" />
      </svg>
      <strong>Error:</strong> {message}
    </div>
  );
};
