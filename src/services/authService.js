// Prototype authentication only. Passwords are never persisted or checked.
// Browser ownership checks are not production authentication or authorization.
import {
  CUSTOMER_SESSION_KEY,
  readCustomerStore,
  writeCustomerStore,
  ownedBusinesses,
  nextId,
} from "./customerStore.js";
const OLD_SESSION = "hospoHub.prototype.session";
const readSession = (storage) => {
  try {
    return JSON.parse(storage.getItem(CUSTOMER_SESSION_KEY));
  } catch {
    return null;
  }
};
export function createPrototypeAuth(local, session) {
  const saveSession = (value, remember = false) => {
    for (const storage of [local, session]) {
      storage.removeItem(CUSTOMER_SESSION_KEY);
      storage.removeItem(OLD_SESSION);
    }
    (remember ? local : session).setItem(
      CUSTOMER_SESSION_KEY,
      JSON.stringify(value),
    );
  };
  const snapshot = () => {
    const root = readCustomerStore(local);
    let saved = readSession(session) || readSession(local);
    if (!saved) {
      for (const storage of [session, local]) {
        let legacy;
        try {
          legacy = JSON.parse(storage.getItem(OLD_SESSION));
        } catch {
          /* Ignore invalid old session. */
        }
        const oldUser = root.customerUsers.find(
          (item) => item.id === legacy?.id,
        );
        if (oldUser) {
          saved = {
            userId: oldUser.id,
            selectedBusinessId: oldUser.preferredBusinessId,
          };
          saveSession(saved, storage === local);
          break;
        }
      }
    }
    const profile = root.customerUsers.find(
      (item) => item.id === saved?.userId && item.status === "Active",
    );
    if (!profile) return { user: null, businesses: [], currentBusiness: null };
    const businesses = ownedBusinesses(root, profile.id);
    const currentBusiness =
      businesses.find((item) => item.id === saved.selectedBusinessId) ||
      businesses.find((item) => item.id === profile.preferredBusinessId) ||
      businesses[0] ||
      null;
    return {
      user: { ...profile, businessName: currentBusiness?.businessName || "" },
      businesses,
      currentBusiness,
    };
  };
  return {
    getSnapshot: snapshot,
    getUser: () => snapshot().user,
    login({ email, remember = false }) {
      const root = readCustomerStore(local);
      const user = root.customerUsers.find(
        (item) =>
          item.email === email.trim().toLowerCase() && item.status === "Active",
      );
      if (!user)
        throw new Error(
          "No active prototype account was found. Create an account first.",
        );
      user.lastActiveAt = new Date().toISOString();
      writeCustomerStore(local, root);
      saveSession(
        { userId: user.id, selectedBusinessId: user.preferredBusinessId },
        remember,
      );
      return snapshot().user;
    },
    // Prototype customer registration only.
    // Replace with secure identity/authentication backend before production.
    register({ firstName, lastName, email, businessName = "" }) {
      const root = readCustomerStore(local);
      const normalizedEmail = email.trim().toLowerCase();
      if (root.customerUsers.some((item) => item.email === normalizedEmail))
        throw new Error(
          "This email already has a prototype account. Sign in instead.",
        );
      const businessId = businessName.trim()
        ? nextId(root.businesses, "BUS")
        : null;
      const user = {
        id: nextId(root.customerUsers, "CUS"),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: normalizedEmail,
        phone: "",
        businessIds: businessId ? [businessId] : [],
        preferredBusinessId: businessId,
        status: "Active",
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
      };
      root.customerUsers.push(user);
      if (businessId)
        root.businesses.push({
          id: businessId,
          ownerId: user.id,
          businessName: businessName.trim(),
          legalName: "",
          nzbn: "",
          address: "",
          activities: {},
        });
      writeCustomerStore(local, root);
      saveSession({ userId: user.id, selectedBusinessId: businessId });
      return snapshot().user;
    },
    selectBusiness(businessId) {
      const { user, businesses } = snapshot();
      if (!businesses.some((item) => item.id === businessId))
        throw new Error("Business not found in your account.");
      const root = readCustomerStore(local);
      root.customerUsers.find(
        (item) => item.id === user.id,
      ).preferredBusinessId = businessId;
      writeCustomerStore(local, root);
      saveSession(
        { userId: user.id, selectedBusinessId: businessId },
        Boolean(readSession(local)),
      );
    },
    updateProfile(input) {
      const { user, currentBusiness } = snapshot();
      if (!user) throw new Error("Sign in before saving your profile.");
      const root = readCustomerStore(local);
      const profile = root.customerUsers.find((item) => item.id === user.id);
      const email = String(input.email || "")
        .trim()
        .toLowerCase();
      if (
        !email ||
        !String(input.firstName || "").trim() ||
        !String(input.lastName || "").trim()
      )
        throw new Error("Enter your name and email address.");
      if (
        root.customerUsers.some(
          (item) => item.id !== user.id && item.email === email,
        )
      )
        throw new Error("This email already has a prototype account.");
      for (const key of ["firstName", "lastName", "phone"])
        profile[key] = String(input[key] || "").trim();
      profile.email = email;
      let business = root.businesses.find(
        (item) => item.id === currentBusiness?.id,
      );
      if (String(input.businessName || "").trim()) {
        if (!business) {
          business = { id: nextId(root.businesses, "BUS"), ownerId: user.id };
          root.businesses.push(business);
          profile.businessIds.push(business.id);
          profile.preferredBusinessId = business.id;
        }
        for (const key of [
          "businessName",
          "legalName",
          "nzbn",
          "address",
          "businessType",
          "stage",
        ])
          business[key] = String(input[key] || "").trim();
        business.activities = Object.fromEntries(
          ["food", "alcohol", "outdoor"].map((key) => [
            key,
            Boolean(input.activities?.[key]),
          ]),
        );
      } else if (business) throw new Error("Enter a business name.");
      writeCustomerStore(local, root);
      saveSession(
        { userId: user.id, selectedBusinessId: business?.id || null },
        Boolean(readSession(local)),
      );
      return snapshot();
    },
    logout() {
      for (const storage of [local, session]) {
        storage.removeItem(CUSTOMER_SESSION_KEY);
        storage.removeItem(OLD_SESSION);
      }
    },
  };
}
export const authService = () =>
  createPrototypeAuth(window.localStorage, window.sessionStorage);
