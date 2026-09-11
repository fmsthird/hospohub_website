import { useEffect, useState } from "react";
import { authService } from "../services/authService";
import {
  CUSTOMER_STORE_KEY,
  CUSTOMER_SESSION_KEY,
} from "../services/customerStore";
import { AuthContext } from "../hooks/useAuth";
function snapshot() {
  try {
    return { ...authService().getSnapshot(), error: "" };
  } catch (error) {
    return {
      user: null,
      businesses: [],
      currentBusiness: null,
      error: error.message,
    };
  }
}
export function AuthProvider({ children }) {
  const [state, setState] = useState(snapshot);
  const refresh = () => setState(snapshot());
  useEffect(() => {
    const sync = (event) => {
      if (
        !event.key ||
        [CUSTOMER_STORE_KEY, CUSTOMER_SESSION_KEY].includes(event.key)
      )
        setState(snapshot());
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  const login = async (input) => {
    authService().login(input);
    refresh();
  };
  const register = async (input) => {
    authService().register(input);
    refresh();
  };
  const logout = () => {
    authService().logout();
    refresh();
  };
  const selectBusiness = (id) => {
    authService().selectBusiness(id);
    refresh();
  };
  const updateProfile = (input) => {
    authService().updateProfile(input);
    refresh();
    window.dispatchEvent(new Event("customer-workspace-change"));
  };
  return (
    <AuthContext.Provider
      value={{
        ...state,
        isAuthenticated: Boolean(state.user),
        login,
        register,
        logout,
        selectBusiness,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
