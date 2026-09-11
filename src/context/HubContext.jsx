import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { HubContext } from "../hooks/useHub";
import { emptyHub } from "../services/hubStore";
import { authService } from "../services/authService";
import {
  CUSTOMER_STORE_KEY,
  readCustomerStore,
  writeCustomerStore,
  customerWorkspace,
  updateCustomerWorkspace,
} from "../services/customerStore";
function Workspace({ user, business, children }) {
  const read = () => {
    if (!user || !business) return { data: emptyHub(), error: "" };
    try {
      return {
        data: customerWorkspace(
          readCustomerStore(window.localStorage),
          user.id,
          business.id,
        ),
        error: "",
      };
    } catch (error) {
      return { data: emptyHub(), error: error.message };
    }
  };
  const [state, setState] = useState(read);
  useEffect(() => {
    const sync = (event) => {
      if (!event.key || event.key === CUSTOMER_STORE_KEY) setState(read());
    };
    window.addEventListener("storage", sync);
    window.addEventListener("customer-workspace-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("customer-workspace-change", sync);
    };
    // Workspace remounts when the authenticated customer or selected business changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, business?.id]);
  const update = (change) => {
    try {
      const active = authService().getSnapshot();
      if (
        active.user?.id !== user?.id ||
        active.currentBusiness?.id !== business?.id
      )
        throw new Error(
          "Your selected account or business changed. Please try again.",
        );
      const root = updateCustomerWorkspace(
        readCustomerStore(window.localStorage),
        user?.id,
        business?.id,
        change,
      );
      writeCustomerStore(window.localStorage, root);
      setState({
        data: customerWorkspace(root, user.id, business.id),
        error: "",
      });
      return true;
    } catch (error) {
      setState((previous) => ({
        ...previous,
        error: error.message || "Unable to save in this browser.",
      }));
      return false;
    }
  };
  return (
    <HubContext.Provider
      value={{ ...state, update, currentUser: user, currentBusiness: business }}
    >
      {children}
    </HubContext.Provider>
  );
}
export function HubProvider({ children }) {
  const { user, currentBusiness } = useAuth();
  return (
    <Workspace
      key={`${user?.id || "visitor"}:${currentBusiness?.id || "none"}`}
      user={user}
      business={currentBusiness}
    >
      {children}
    </Workspace>
  );
}
