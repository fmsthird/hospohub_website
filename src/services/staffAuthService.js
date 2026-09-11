// Prototype identity selection only; passwords are neither checked nor stored.
// Replace with the council identity provider and server-side access controls for production.
export const STAFF_SESSION_KEY = "hospoHub.staff.session.v1";
export function staffDestination(value) {
  const path =
    typeof value === "string"
      ? value
      : value?.pathname
        ? `${value.pathname}${value.search || ""}${value.hash || ""}`
        : "";
  return /^\/staff(?:\/(?:cases(?:\/[^/?#\\]+)?|tasks|teams|reports|content|notifications|users|settings))?(?:[?#].*)?$/.test(
    path,
  ) && !/[\\\r\n]/.test(path)
    ? path
    : "/staff";
}
export function createStaffAuth(local, session, getData) {
  const read = (storage) => {
    try {
      return JSON.parse(storage.getItem(STAFF_SESSION_KEY));
    } catch {
      return null;
    }
  };
  const logout = () => {
    local.removeItem(STAFF_SESSION_KEY);
    session.removeItem(STAFF_SESSION_KEY);
  };
  return {
    getUser() {
      const saved = read(session) || read(local);
      const user = getData().staffUsers.find(
        (item) => item.id === saved?.staffId && item.status === "Active",
      );
      if (!user && saved) logout();
      return user || null;
    },
    login({ email, remember = false }) {
      const user = getData().staffUsers.find(
        (item) =>
          item.email.toLowerCase() === String(email).trim().toLowerCase(),
      );
      if (!user || user.status !== "Active")
        throw new Error(
          "No active prototype staff account matches this email. Contact a staff administrator.",
        );
      logout();
      (remember ? local : session).setItem(
        STAFF_SESSION_KEY,
        JSON.stringify({ staffId: user.id }),
      );
      return user;
    },
    logout,
  };
}
