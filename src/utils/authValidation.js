export function validateAuth(values, registering = false) {
  const errors = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Enter a valid email address.';
  if (!values.password) errors.password = 'Enter your password.';
  if (registering) {
    if (!values.firstName.trim()) errors.firstName = 'Enter your first name.';
    if (!values.lastName.trim()) errors.lastName = 'Enter your last name.';
    if (values.password.length < 8) errors.password = 'Use at least 8 characters.';
    if (values.confirmPassword !== values.password) errors.confirmPassword = 'Passwords must match.';
    if (!values.agreed) errors.agreed = 'Agree to the Terms of Use and Privacy Policy to continue.';
  }
  return errors;
}

export function authDestination(from) {
  const allowed = ['/dashboard', '/my-applications', '/forms', '/document-upload', '/documents', '/payments', '/messages', '/notifications', '/training', '/profile', '/settings'];
  if (typeof from !== 'string') return '/dashboard';
  const path = from.split('?')[0];
  return allowed.includes(path) || /^\/(forms|my-applications)\/[a-zA-Z0-9-]+$/.test(path) ? from : '/dashboard';
}
