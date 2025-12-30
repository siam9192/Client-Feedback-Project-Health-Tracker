import { UserRole } from "@/types/user.type";
import {
  LayoutDashboard,
  FolderKanban,
  AlertTriangle,
  PlusSquare,
  ClipboardList,
} from "lucide-react";

export const adminRoutes = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Projects Group",
    href: "/admin/projects",
    icon: FolderKanban,
  },
  {
    label: "Risks",
    href: "/admin/risks",
    icon: AlertTriangle,
  },
  {
    label: "Add Project",
    href: "/admin/add-project",
    icon: PlusSquare,
  },
];

export const employeeRoutes = [
  {
    label: "Dashboard",
    href: "/employee",
    icon: LayoutDashboard,
  },
  {
    label: "Assigned Projects",
    href: "/employee/projects",
    icon: ClipboardList,
  },
];

export const clientRoutes = [
  {
    label: "Dashboard",
    href: "/client",
    icon: LayoutDashboard,
  },
  {
    label: "Assigned Projects",
    href: "/client/projects",
    icon: FolderKanban,
  },
];

export default {
  [UserRole.ADMIN]: adminRoutes,
  [UserRole.EMPLOYEE]: employeeRoutes,
  [UserRole.CLIENT]: clientRoutes,
};
