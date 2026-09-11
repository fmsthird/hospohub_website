// Prototype authentication only.
// Replace with production authentication/API before deployment.
// Passwords are never persisted or verified. Browser storage is not a security boundary.
const SESSION_KEY = 'hospoHub.prototype.session';
const PROFILES_KEY = 'hospoHub.prototype.profiles';

function read(storage, key, fallback) {
  try { return JSON.parse(storage.getItem(key)) ?? fallback; } catch { return fallback; }
}

function profileOnly(value) {
  if (!value || typeof value.email !== 'string' || typeof value.id !== 'string') return null;
  return Object.fromEntries(['id', 'firstName', 'lastName', 'email', 'businessName'].map((key) => [key, typeof value[key] === 'string' ? value[key] : '']));
}

export function createPrototypeAuth(local, session) {
  const profiles = () => {
    const stored = read(local, PROFILES_KEY, []);
    return Array.isArray(stored) ? stored.map(profileOnly).filter(Boolean) : [];
  };
  const saveSession = (user, remember) => {
    local.removeItem(SESSION_KEY);
    session.removeItem(SESSION_KEY);
    (remember ? local : session).setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  };
  return {
    getUser: () => profileOnly(read(session, SESSION_KEY, null)) || profileOnly(read(local, SESSION_KEY, null)),
    login({ email, remember = false }) {
      const user = profiles().find((item) => item.email === email.trim().toLowerCase());
      if (!user) throw new Error('No prototype account was found in this browser. Create an account first.');
      return saveSession(user, remember);
    },
    register({ firstName, lastName, email, businessName }) {
      const users = profiles();
      const normalizedEmail = email.trim().toLowerCase();
      if (users.some((item) => item.email === normalizedEmail)) throw new Error('This email already has a prototype account in this browser. Sign in instead.');
      const user = { id: crypto.randomUUID(), firstName: firstName.trim(), lastName: lastName.trim(), email: normalizedEmail, businessName: businessName.trim() };
      local.setItem(PROFILES_KEY, JSON.stringify([...users, user]));
      return saveSession(user, false);
    },
    logout() {
      local.removeItem(SESSION_KEY);
      session.removeItem(SESSION_KEY);
    },
  };
}

export const authService = () => createPrototypeAuth(window.localStorage, window.sessionStorage);
