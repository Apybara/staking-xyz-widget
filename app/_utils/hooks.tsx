import { useState } from "react";

export const useProceduralStates = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  return {
    isLoading,
    setIsLoading,
    isSuccessful,
    setIsSuccessful,
    error,
    setError,
  };
};

export const useTooltipMobile = () => {
  const [open, setOpen] = useState(false);

  return {
    rootProps: {
      open,
      onOpenChange: setOpen,
    },
    triggerProps: {
      onClick: () => setOpen((prevOpen) => !prevOpen),
      onFocus: () => setTimeout(() => setOpen(true), 0),
      onBlur: () => setOpen(false),
    },
  };
};
