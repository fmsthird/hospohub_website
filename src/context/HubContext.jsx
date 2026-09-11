import { useEffect, useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { HubContext } from "../hooks/useHub";
import { emptyHub, hubKey, readHub, writeHub } from "../services/hubStore";

function Workspace({ user, children }) {
  const [data, setData] = useState(() =>
    typeof window !== "undefined" && user
      ? readHub(window.localStorage, user.id)
      : emptyHub(),
  );
  const current = useRef(data);
  const [error, setError] = useState("");
  useEffect(() => {
    const sync = (event) => {
      if (user && (event.key === hubKey(user.id) || event.key === null)) {
        current.current = readHub(window.localStorage, user.id);
        setData(current.current);
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [user]);
  const update = (change) => {
    try {
      const next = change(current.current);
      writeHub(window.localStorage, user?.id, next);
      current.current = next;
      setData(next);
      setError("");
      return true;
    } catch {
      setError(
        "Unable to save in this browser. Check available storage and try again.",
      );
      return false;
    }
  };
  return (
    <HubContext.Provider value={{ data, update, error }}>
      {children}
    </HubContext.Provider>
  );
}
export function HubProvider({ children }) {
  const { user } = useAuth();
  return (
    <Workspace key={user?.id || "visitor"} user={user}>
      {children}
    </Workspace>
  );
}
