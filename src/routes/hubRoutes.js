import Dashboard from "../pages/Dashboard";
import MyApplications from "../pages/MyApplications";
import DigitalForms from "../pages/DigitalForms";
import DocumentUpload from "../pages/DocumentUpload";
import DocumentVault from "../pages/DocumentVault";
import PaymentsFees from "../pages/PaymentsFees";
import Messages from "../pages/Messages";
import Training from "../pages/Training";
import HubSettings from "../pages/HubSettings";
import CustomerNotifications from "../pages/CustomerNotifications";
export const hubRoutes = [
  { path: "/dashboard", component: Dashboard },
  { path: "/my-applications", component: MyApplications },
  { path: "/my-applications/:id", component: MyApplications },
  { path: "/forms", component: DigitalForms },
  { path: "/forms/:id", component: DigitalForms },
  { path: "/documents", component: DocumentVault },
  { path: "/document-upload", component: DocumentUpload },
  { path: "/payments", component: PaymentsFees },
  { path: "/messages", component: Messages },
  { path: "/notifications", component: CustomerNotifications },
  { path: "/training", component: Training },
  { path: "/profile", component: HubSettings, props: { profile: true } },
  { path: "/settings", component: HubSettings },
];
