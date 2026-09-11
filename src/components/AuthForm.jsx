import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { authDestination, validateAuth } from '../utils/authValidation';

function Field({ name, label, type = 'text', value, onChange, error, autoComplete, optional = false, hint }) {
  const [visible, setVisible] = useState(false);
  const password = type === 'password';
  return <div>
    <label htmlFor={name} className="mb-1.5 block text-sm font-bold text-gray-800">{label}{optional && <span className="font-normal text-gray-500"> (optional)</span>}</label>
    <div className="relative">
      <input id={name} name={name} type={password && visible ? 'text' : type} value={value} onChange={onChange} autoComplete={autoComplete} required={!optional} aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined} className={`w-full rounded-lg border bg-white px-3 py-3 text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-blue-100 ${password ? 'pr-14' : ''} ${error ? 'border-red-600' : 'border-gray-300'}`} />
      {password && <button type="button" onClick={() => setVisible(!visible)} aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`} aria-pressed={visible} className="absolute right-1 top-1 rounded-md p-3 text-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">{visible ? <FaEyeSlash /> : <FaEye />}</button>}
    </div>
    {hint && <p id={`${name}-hint`} className="mt-1 text-xs text-gray-600">{hint}</p>}
    {error && <p id={`${name}-error`} className="mt-1 text-sm text-red-700">{error}</p>}
  </div>;
}

export default function AuthForm({ registering = false }) {
  const { login, register, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [values, setValues] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', businessName: '', agreed: false, remember: false });
  const [errors, setErrors] = useState({});
  const [failure, setFailure] = useState('');
  const [busy, setBusy] = useState(false);
  const destination = authDestination(location.state?.from);
  if (isAuthenticated) return <Navigate to={destination} replace />;
  const change = (event) => {
    const { name, value, type, checked } = event.target;
    setValues((previous) => ({ ...previous, [name]: type === 'checkbox' ? checked : value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
    setFailure('');
  };
  const submit = async (event) => {
    event.preventDefault();
    if (busy) return;
    const nextErrors = validateAuth(values, registering);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      event.currentTarget.elements.namedItem(Object.keys(nextErrors)[0])?.focus();
      return;
    }
    setBusy(true);
    try {
      await (registering ? register(values) : login(values));
      setValues((previous) => ({ ...previous, password: '', confirmPassword: '' }));
      navigate(destination, { replace: true });
    } catch (error) {
      setFailure(error instanceof Error ? error.message : 'Unable to continue. Please try again.');
    } finally { setBusy(false); }
  };
  const field = (name, label, props = {}) => <Field name={name} label={label} value={values[name]} onChange={change} error={errors[name]} {...props} />;
  return <section className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)]">
    <div className="border-b border-gray-200 bg-[#F4F8FA] p-6 md:flex md:flex-col md:justify-center md:border-b-0 md:border-r lg:p-8">
    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">Hospo Hub</p>
    <h1 className="text-3xl font-extrabold text-gray-900">{registering ? 'Create your Hospo Hub account' : 'Welcome back'}</h1>
    <p className="mt-3 text-sm leading-6 text-gray-600">{registering ? 'Save your business information, applications, documents and messages in one place.' : 'Sign in to access your saved applications, documents and business information.'}</p>
    <p className="mt-5 rounded-lg bg-blue-50 p-3 text-sm leading-5 text-blue-900">Prototype only: accounts work in this browser. Passwords are not stored or checked; use a made-up password. This does not secure real personal information.</p>
    </div>
    <div className="min-w-0 p-6 lg:p-8">
    <form noValidate onSubmit={submit} className="space-y-4" aria-busy={busy}>
      <div className={registering ? 'grid items-start gap-4 sm:grid-cols-2' : 'grid gap-4'}>
      {registering && <>{field('firstName', 'First name', { autoComplete: 'given-name' })}{field('lastName', 'Last name', { autoComplete: 'family-name' })}</>}
      {field('email', 'Email address', { type: 'email', autoComplete: 'email' })}
      {registering && field('businessName', 'Business name', { optional: true, autoComplete: 'organization' })}
      {field('password', 'Password', { type: 'password', autoComplete: registering ? 'new-password' : 'current-password', hint: registering ? 'Password must contain at least 8 characters.' : undefined })}
      {registering && field('confirmPassword', 'Confirm password', { type: 'password', autoComplete: 'new-password' })}
      </div>
      {registering ? <div>
        <div className="flex items-start gap-2"><input id="agreed" name="agreed" type="checkbox" required checked={values.agreed} onChange={change} aria-invalid={Boolean(errors.agreed)} aria-describedby={errors.agreed ? 'agreed-error' : undefined} className="mt-1 h-4 w-4 accent-primary" /><label htmlFor="agreed" className="text-sm leading-6 text-gray-600">I agree to the <Link to="/terms" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline">Terms of Use</Link> and <Link to="/privacy" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline">Privacy Policy</Link>.</label></div>
        {errors.agreed && <p id="agreed-error" className="mt-1 text-sm text-red-700">{errors.agreed}</p>}
      </div> : <div className="flex flex-wrap justify-between gap-3 text-sm"><label className="flex items-center gap-2"><input name="remember" type="checkbox" checked={values.remember} onChange={change} className="h-4 w-4 accent-primary" />Remember me</label><Link to="/forgot-password" className="font-semibold text-primary hover:underline">Forgot password?</Link></div>}
      {failure && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{failure}</p>}
      <button disabled={busy} className="w-full rounded-lg bg-primary px-4 py-3 font-bold text-white transition hover:bg-secondary disabled:opacity-60">{busy ? 'Please wait…' : registering ? 'Create account' : 'Sign in'}</button>
    </form>
    {!registering && <><div className="my-3 flex items-center gap-3 text-sm text-gray-500"><span className="h-px flex-1 bg-gray-200" />or<span className="h-px flex-1 bg-gray-200" /></div><Link to="/create-account" state={location.state} className="block rounded-lg border border-primary px-4 py-3 text-center font-bold text-primary hover:bg-blue-50">Create an account</Link></>}
    <p className="mt-4 text-center text-sm text-gray-600">{registering ? 'Already have an account?' : "Don't have an account?"} <Link to={registering ? '/login' : '/create-account'} state={location.state} className="font-bold text-primary hover:underline">{registering ? 'Sign in' : 'Create account'} →</Link></p>
    </div>
  </section>;
}
