import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// ==========================================
// LAYOUTS
// ==========================================

import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import { hubRoutes } from "./routes/hubRoutes";
import { HubProvider } from "./context/HubContext";
import AccountInformation from "./pages/AccountInformation";

// ==========================================
// PUBLIC PAGES
// ==========================================

import Home from "./pages/Home";
import GetStarted from "./pages/GetStarted";
import NewBusiness from "./pages/NewBusiness";
import BuyingBusiness from "./pages/BuyingBusiness";
import ChangingBusiness from "./pages/ChangingBusiness";

import LicensingGuide from "./pages/LicensingGuide";

import RequirementsResult from "./pages/RequirementsResult";

import LearningCentre from "./pages/LearningCentre";
import Resources from "./pages/Resources";
import HelpSupport from "./pages/HelpSupport";
import HelpAssistant from "./pages/HelpAssistant";
import CallbackRequest from "./pages/CallbackRequest";
import HelpFaqs from "./pages/HelpFaqs";

const StaffPortal = lazy(() => import("./pages/StaffPortal"));

function App() {
  return (
    <Router>
      <AuthProvider>
        <HubProvider>
          <Routes>
            <Route
              path="/staff/*"
              element={
                <Suspense
                  fallback={
                    <div
                      role="status"
                      className="min-h-screen bg-slate-50 p-8 text-slate-600"
                    >
                      Loading Staff Portal…
                    </div>
                  }
                >
                  <StaffPortal />
                </Suspense>
              }
            />
            <Route
              path="/login"
              element={
                <PublicLayout>
                  <Login />
                </PublicLayout>
              }
            />
            <Route
              path="/create-account"
              element={
                <PublicLayout>
                  <CreateAccount />
                </PublicLayout>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicLayout>
                  <AccountInformation type="recovery" />
                </PublicLayout>
              }
            />
            <Route
              path="/terms"
              element={
                <PublicLayout>
                  <AccountInformation type="terms" />
                </PublicLayout>
              }
            />
            <Route
              path="/privacy"
              element={
                <PublicLayout>
                  <AccountInformation type="privacy" />
                </PublicLayout>
              }
            />
            {hubRoutes.map(({ path, component: Page, props }) => (
              <Route
                key={path}
                path={path}
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Page {...props} />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
            ))}

            {/* ========================================== */}
            {/* PUBLIC ROUTES                              */}
            {/* ========================================== */}

            <Route
              path="/"
              element={
                <PublicLayout>
                  <Home />
                </PublicLayout>
              }
            />

            {/* GET STARTED */}

            <Route
              path="/get-started"
              element={
                <PublicLayout>
                  <GetStarted />
                </PublicLayout>
              }
            />

            <Route
              path="/get-started/new-business"
              element={
                <PublicLayout>
                  <NewBusiness />
                </PublicLayout>
              }
            />

            <Route
              path="/get-started/buying-business"
              element={
                <PublicLayout>
                  <BuyingBusiness />
                </PublicLayout>
              }
            />

            <Route
              path="/get-started/changing-business"
              element={
                <PublicLayout>
                  <ChangingBusiness />
                </PublicLayout>
              }
            />

            {/* LICENSING GUIDE */}

            <Route
              path="/licensing-guide"
              element={
                <PublicLayout>
                  <LicensingGuide />
                </PublicLayout>
              }
            />

            {/* CHECK REQUIREMENTS */}

            <Route
              path="/requirements"
              element={<Navigate to="/get-started" replace />}
            />

            <Route
              path="/requirements/result"
              element={
                <PublicLayout>
                  <RequirementsResult />
                </PublicLayout>
              }
            />

            {/* LEARNING CENTRE */}

            <Route
              path="/learning-centre"
              element={
                <PublicLayout>
                  <LearningCentre />
                </PublicLayout>
              }
            />

            {/* RESOURCES */}

            <Route
              path="/resources"
              element={
                <PublicLayout>
                  <Resources />
                </PublicLayout>
              }
            />

            {/* HELP */}
            <Route
              path="/help/assistant"
              element={
                <PublicLayout>
                  <HelpAssistant />
                </PublicLayout>
              }
            />
            <Route
              path="/help/callback"
              element={
                <PublicLayout>
                  <CallbackRequest />
                </PublicLayout>
              }
            />
            <Route
              path="/help/faqs"
              element={
                <PublicLayout>
                  <HelpFaqs />
                </PublicLayout>
              }
            />

            <Route
              path="/help"
              element={
                <PublicLayout>
                  <HelpSupport />
                </PublicLayout>
              }
            />

            {/* ========================================== */}
            {/* CATCH ALL                                  */}
            {/* ========================================== */}

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HubProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
