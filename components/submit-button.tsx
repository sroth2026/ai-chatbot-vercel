"use client";

import { useFormStatus } from "react-dom";

import { LoaderIcon } from "@/components/icons";

import { Button } from "./ui/button";

export function SubmitButton({
  children,
  isSuccessful,
  isLoading = false,
}: {
  children: React.ReactNode;
  isSuccessful: boolean;
  isLoading?: boolean;
}) {
  const { pending } = useFormStatus();
  const showLoader = pending || isSuccessful || isLoading;

  return (
    <Button
      aria-disabled={showLoader}
      className="relative"
      disabled={showLoader}
      type={showLoader ? "button" : "submit"}
    >
      {children}

      {showLoader && (
        <span className="absolute right-4 animate-spin">
          <LoaderIcon />
        </span>
      )}

      <output aria-live="polite" className="sr-only">
        {showLoader ? "Loading" : "Submit form"}
      </output>
    </Button>
  );
}
