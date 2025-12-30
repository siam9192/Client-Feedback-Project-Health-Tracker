"use client";
import { ReactNode } from "react";
import CurrentUserProvider from "./CurrentUserProvider";
import { Toaster } from "sonner";

interface Props {
  children: ReactNode;
}
function Providers({ children }: Props) {
  return (
    <CurrentUserProvider>
      {children}
      <Toaster />
    </CurrentUserProvider>
  );
}

export default Providers;
