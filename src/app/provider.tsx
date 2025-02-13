"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Dashboard from "./components/dashboard";
import { extendTheme } from "@mui/material/styles";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const [isClient, setClient] = useState<boolean>(false);

  const currentPath = usePathname();
  const excludedPaths = ["/auth/signin", "auth/signup"];
  const isExcluded = excludedPaths.includes(currentPath);

  useEffect(() => {
    setClient(true);
  }, []);

  if (!isClient) {
    return null; // Não renderiza nada até estar no cliente
  }

  return isExcluded ? children : <Dashboard>{children}</Dashboard>;
};

export default Provider;
