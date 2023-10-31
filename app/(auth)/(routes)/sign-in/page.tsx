import { Metadata } from "next";

import UserAuthForm from "@/components/form/form-auth-user";

export const metadata: Metadata = {
  title: "Co-Notes | Authentication",
  description: "Page d'autentification de l'application Co-Notes",
};

export default function AuthenticationPage() {
  return <UserAuthForm />;
}
