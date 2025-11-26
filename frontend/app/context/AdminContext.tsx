"use client";

import { createContext, useContext, useState } from "react";

type AdminData = {
  name: string;
  email: string;
  password: string;
  role: string
};

type AdminContextType = {
  admin: AdminData;
  setAdminData: (data: Partial<AdminData>) => void;
  clearAdminData: () => void;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [admin, setAdminState] = useState<AdminData>({
    name: "",
    email: "",
    password: "",
    role: ""
  });

  const setAdminData = (data: Partial<AdminData>) => {
    setAdminState((prev) => ({ ...prev, ...data }));
  };

  const clearAdminData = () => {
    setAdminState({
      name: "",
      email: "",
      password: "",
      role: ""
    });
  };

  return (
    <AdminContext.Provider value={{ admin, setAdminData, clearAdminData }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}