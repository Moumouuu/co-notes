import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Co-Notes - Login",
  description:
    "Co-Notes is a collaborative note-taking app in realtime for teams and individuals. You can easily share and custom your notes.",
};

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-[100vh] flex items-center justify-center">{children}</div>
  );
};

export default AuthLayout;
