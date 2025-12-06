"use client";

import { createContext, useContext, useState } from "react";

type StudentData = {
  name: String,
  schoolId: String,
  email: String,
  password: String,
  role: String,
  course: String,
};

type StudentContexType = {
  student: StudentData,
  setStudentData: (data: Partial<StudentData>) => void;
  clearStudentData: () => void
};

const StudentContext = createContext<StudentContexType | undefined>(undefined);

export const StudentProvider = ({ children } : { children: React.ReactNode }) => {
  const [student, setStudentState] = useState<StudentData>({
    name: "",
    schoolId: "",
    email: "",
    password: "",
    role: "",
    course: "",
  });

  const setStudentData = (data:Partial<StudentData>) => {
    setStudentState((prev) => ({...prev, ...data}));
  };

  const clearStudentData = () => {
    setStudentState({
      name: "",
      schoolId: "",
      email: "",
      password: "",
      role: "",
      course: "",
    });
  };

  return (
    <StudentContext.Provider value={{student, setStudentData, clearStudentData }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudent must be used within an StudentProvider");
  }

  return context;
}
