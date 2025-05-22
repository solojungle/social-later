import React, { forwardRef } from "react";

import { cn } from "../lib/utils";
import { Spacing } from "./spacing";
import { Spinner } from "./spinner";

const ButtonForward: React.ForwardRefRenderFunction<
  HTMLButtonElement,
  {
    children: React.ReactNode;
    disabled?: boolean;
    loading?: boolean;
    onClick?: () => void;
    secondary?: boolean;
  }
> = ({ children, disabled, loading, onClick, secondary }, ref) => {
  return (
    <button
      className={cn(
        "rounded-geist px-geist-half font-geist hover:border-focused-border-color disabled:bg-button-disabled-color disabled:text-disabled-text-color disabled:border-unfocused-border-color inline-flex h-10 appearance-none items-center border border-foreground bg-foreground text-sm font-medium text-background transition-all duration-150 ease-in-out hover:bg-background hover:text-foreground disabled:cursor-not-allowed",
        secondary
          ? "border-unfocused-border-color bg-background text-foreground"
          : undefined,
      )}
      disabled={disabled}
      onClick={onClick}
      ref={ref}
      type="button"
    >
      {loading && (
        <>
          <Spinner size={20} />
          <Spacing />
        </>
      )}
      {children}
    </button>
  );
};

export const Button = forwardRef(ButtonForward);
