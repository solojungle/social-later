import React from "react";

export const InputContainer: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="border-unfocused-border-color p-geist rounded-geist flex flex-col border bg-background">
      {children}
    </div>
  );
};
