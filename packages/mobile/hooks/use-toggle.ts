/**
 * Toggle Hook
 * 
 * A generic hook for managing boolean toggle state.
 * Useful for managing open/close states of modals, dropdowns, accordions, etc.
 */

import { useCallback, useState } from "react";

type UseToggleReturn = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export function useToggle(initialState: boolean = false): UseToggleReturn {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}