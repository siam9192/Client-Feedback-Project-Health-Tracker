"use client";

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

function SidebarModal() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close modal on  path change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Open Button */}
      <button
        onClick={() => setOpen(true)}
        className=" lg:hidden rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
      >
        <Menu size={22} />
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className=" w-10/12 h-full z-50 overflow-y-auto animate-slide-in-left">
            <Sidebar />
          </div>
        </div>
      )}
    </>
  );
}

export default SidebarModal;
