"use client";

import { logout } from "@/services/api/auth.api.service";
import { UserRole } from "@/types/user.type";
import routes from "@/utils/routes";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const role = pathname.includes("admin")
    ? UserRole.ADMIN
    : pathname.includes("employee")
      ? UserRole.EMPLOYEE
      : UserRole.CLIENT;

  const navItems = routes[role];

  const router = useRouter();
  const handelLogout = async () => {
    await logout();
    router.push("/");
  };
  return (
    <aside className="h-screen w-full lg:w-52 xl:w-64 bg-white  shadow-sm flex flex-col justify-between">
      {/* Logo */}
      <div>
        <div className="h-16 flex items-center px-6 ">
          <h1 className="text-xl font-semibold tracking-tight text-gray-900">
            Project <span className="text-primary">Pulse</span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                className={`
                group flex items-center gap-3 rounded-lg px-4 py-2.5
                text-sm font-medium transition-all
                ${
                  isActive
                    ? "bg-primary/90 text-primary-content shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }
              `}
              >
                <span
                  className={`
                  h-5 w-1 rounded-full
                  ${isActive ? "bg-primary-content" : "bg-transparent group-hover:bg-gray-300"}
                `}
                />

                <Icon size={18} />

                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-3">
        <button
          onClick={handelLogout}
          className=" w-full bg-base-100 hover:bg-red-400/10 flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all hover:text-red-500 "
        >
          <LogOut size={20} />
          <span className="text-sm font-semibold ">Logout</span>
        </button>
      </div>
    </aside>
  );
}
