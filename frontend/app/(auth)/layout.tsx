import { Toaster } from "@/components/ui/toast";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen flex items-center justify-center">{children}<Toaster/></div>;
}