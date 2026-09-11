import {
  FaHome,
  FaRegFileAlt,
  FaEdit,
  FaRegFolder,
  FaCreditCard,
  FaRegEnvelope,
  FaGraduationCap,
  FaCog,
  FaBell,
} from "react-icons/fa";
export const hubLinks = [
  { to: "/dashboard", label: "Dashboard", icon: FaHome },
  { to: "/my-applications", label: "Applications", icon: FaRegFileAlt },
  { to: "/forms", label: "Digital Forms", icon: FaEdit },
  { to: "/documents", label: "Documents", icon: FaRegFolder },
  { to: "/payments", label: "Payments & Fees", icon: FaCreditCard },
  { to: "/messages", label: "Messages", icon: FaRegEnvelope },
  { to: "/notifications", label: "Notifications", icon: FaBell },
  { to: "/training", label: "Training", icon: FaGraduationCap },
  { to: "/settings", label: "Settings", icon: FaCog },
];
