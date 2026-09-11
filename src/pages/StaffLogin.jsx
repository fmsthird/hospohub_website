import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash, FaShieldAlt } from "react-icons/fa";
import logo from "../assets/logo.svg";
import skyline from "../assets/auckland-skyline.png";
import { useStaffAuth } from "../hooks/useStaffAuth";
import { staffDestination } from "../services/staffAuthService";
import { Field, Button, inputClass } from "../components/staff/StaffUI";
export default function StaffLogin() {
  const {
    isStaffAuthenticated,
    staffLogin,
    error: storageError,
  } = useStaffAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [recovery, setRecovery] = useState(false);
  if (isStaffAuthenticated)
    return <Navigate to={staffDestination(location.state?.from)} replace />;
  const submit = (event) => {
    event.preventDefault();
    setError("");
    try {
      staffLogin({ email, remember });
      setPassword("");
    } catch (failure) {
      setPassword("");
      setError(failure.message);
    }
  };
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#f3f8fc] p-4 sm:p-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg md:grid-cols-[.9fr_1.1fr]">
        <section className="relative overflow-hidden bg-[#063B5A] p-7 text-white sm:p-10">
          <Link to="/" className="relative z-10 flex items-center gap-3">
            <img src={logo} className="h-12 w-12" alt="" />
            <strong className="text-xl">Hospo Hub</strong>
          </Link>
          <div className="relative z-10 mt-8 md:mt-16">
            <FaShieldAlt className="mb-4 text-3xl text-sky-300" />
            <h1 className="text-3xl font-bold">Staff Portal</h1>
            <p className="mt-4 max-w-xs text-sm leading-6 text-sky-100">
              One place to review cases, manage your work and support
              hospitality businesses.
            </p>
            <p className="mt-5 text-xs text-sky-200">
              Food · Alcohol · Outdoor dining
            </p>
          </div>
          <img
            src={skyline}
            alt=""
            className="absolute bottom-0 left-0 w-full opacity-15"
          />
        </section>
        <section className="p-6 sm:p-9">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-primary">
            Authorised staff access only
          </p>
          <h2 className="text-2xl font-bold text-[#173346]">
            Sign in to Hospo Hub
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Use your authorised council staff account.
          </p>
          <div className="my-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
            <strong>Prototype staff login</strong>
            <p className="mt-1 text-xs leading-5">
              Fictional identities for local testing. Passwords are not checked
              or saved. This is not connected to a council identity service.
            </p>
          </div>
          <form onSubmit={submit} className="space-y-4">
            {(error || storageError) && (
              <p role="alert" className="text-sm text-red-700">
                {error || storageError}
              </p>
            )}
            <Field
              label="Council email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Field
              label="Password"
              hint="Optional for prototype UI testing; never stored."
            >
              <div className="relative">
                <input
                  aria-label="Password"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  aria-label={show ? "Hide password" : "Show password"}
                  onClick={() => setShow(!show)}
                  className="absolute right-1 top-1 p-3 text-slate-500"
                >
                  {show ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </Field>
            <div className="flex flex-wrap justify-between gap-2 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  className="accent-sky-600"
                />
                Remember me
              </label>
              <button
                type="button"
                className="font-semibold text-primary"
                onClick={() => setRecovery(!recovery)}
              >
                Forgot password?
              </button>
            </div>
            {recovery && (
              <p
                role="status"
                className="rounded-lg bg-slate-50 p-3 text-xs leading-5"
              >
                The prototype does not use passwords or send reset emails. Use a
                demo identity below, or ask a staff administrator to create a
                local staff record.
              </p>
            )}
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
          <div className="mt-5 border-t pt-4">
            <p className="mb-2 text-xs font-semibold text-slate-500">
              Choose a fictional demo identity
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                [
                  "Jane Smith",
                  "Licensing Officer",
                  "jane.smith@council.example.nz",
                ],
                [
                  "Emma Taylor",
                  "Administrator",
                  "emma.taylor@council.example.nz",
                ],
              ].map(([name, role, address]) => (
                <button
                  type="button"
                  key={address}
                  onClick={() => {
                    setEmail(address);
                    setError("");
                  }}
                  className="rounded-lg border p-3 text-left text-xs hover:border-sky-400 hover:bg-sky-50"
                >
                  <strong className="block text-sm">{name}</strong>
                  <span className="block text-slate-500">{role}</span>
                  <span className="mt-1 block break-all text-[10px] text-primary">
                    {address}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <Link
            to="/"
            className="mt-5 inline-block text-sm text-slate-500 hover:text-primary"
          >
            ← Back to public website
          </Link>
        </section>
      </div>
    </main>
  );
}
