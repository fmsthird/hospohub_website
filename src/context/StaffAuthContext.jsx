import { useEffect, useRef, useState } from "react";
import { StaffAuthContext } from "../hooks/useStaffAuth";
import {
  createStaffAuth,
  STAFF_SESSION_KEY,
} from "../services/staffAuthService";
import {
  readStaffData,
  writeStaffData,
  applyStaffAction,
  STAFF_DATA_KEY,
} from "../services/staffStore";
import { createStaffSeed } from "../data/staffMockData";
import { hasStaffPermission } from "../data/staffRoles";

function initialState() {
  if (typeof window === "undefined")
    return { data: createStaffSeed(), staffId: null, error: "" };
  try {
    const data = readStaffData(window.localStorage);
    const user = createStaffAuth(
      window.localStorage,
      window.sessionStorage,
      () => data,
    ).getUser();
    return { data, staffId: user?.id || null, error: "" };
  } catch (error) {
    return {
      data: createStaffSeed(),
      staffId: null,
      error: error.message || "Staff browser storage is unavailable.",
    };
  }
}
export function StaffAuthProvider({ children }) {
  const [state, setState] = useState(initialState);
  const current = useRef(state);
  const commit = (next) => {
    current.current = next;
    setState(next);
  };
  useEffect(() => {
    const sync = (event) => {
      if ([STAFF_DATA_KEY, STAFF_SESSION_KEY, null].includes(event.key))
        commit(initialState());
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  const staffUser =
    state.data.staffUsers.find(
      (user) => user.id === state.staffId && user.status === "Active",
    ) || null;
  const staffLogin = (input) => {
    const data = readStaffData(window.localStorage);
    const service = createStaffAuth(
      window.localStorage,
      window.sessionStorage,
      () => data,
    );
    const user = service.login(input);
    const next = {
      ...data,
      staffUsers: data.staffUsers.map((item) =>
        item.id === user.id
          ? { ...item, lastActive: new Date().toISOString() }
          : item,
      ),
    };
    try {
      writeStaffData(window.localStorage, next);
    } catch {
      service.logout();
      throw new Error(
        "Unable to save the staff session. Check browser storage and try again.",
      );
    }
    commit({ data: next, staffId: user.id, error: "" });
  };
  const staffLogout = () => {
    try {
      createStaffAuth(
        window.localStorage,
        window.sessionStorage,
        () => current.current.data,
      ).logout();
    } finally {
      commit({ ...current.current, staffId: null, error: "" });
    }
  };
  const dispatch = (action) => {
    try {
      const data = readStaffData(window.localStorage);
      const service = createStaffAuth(
        window.localStorage,
        window.sessionStorage,
        () => data,
      );
      const user = service.getUser();
      const next = applyStaffAction(data, user?.id, action);
      writeStaffData(window.localStorage, next);
      commit({ data: next, staffId: user.id, error: "" });
      return true;
    } catch (error) {
      commit({
        ...current.current,
        error:
          error.message ||
          "Unable to save. Check browser storage and try again.",
      });
      return false;
    }
  };
  return (
    <StaffAuthContext.Provider
      value={{
        data: state.data,
        error: state.error,
        staffUser,
        isStaffAuthenticated: !!staffUser,
        staffLogin,
        staffLogout,
        hasPermission: (permission) =>
          hasStaffPermission(staffUser, permission),
        dispatch,
      }}
    >
      {children}
    </StaffAuthContext.Provider>
  );
}
