import { createContext, useContext } from "react";
export const StaffAuthContext = createContext(null);
export function useStaffAuth() {
  const context = useContext(StaffAuthContext);
  if (!context)
    throw new Error("Staff components must be inside StaffAuthProvider.");
  return context;
}
