import { redirect } from "next/navigation";

export default function StudentIndex() {
  redirect("/students/auth/login");
}