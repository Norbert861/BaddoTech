"use client";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, ShieldCheck, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || userData?.role !== "admin")) {
      router.push("/dashboard");
    }
  }, [user, userData, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <Loader2 className="animate-spin text-amber-500" size={40} />
      </div>
    );
  }

  if (userData?.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0f] text-center px-6">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-6">
          <AlertTriangle size={40} />
        </div>
        <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-400 mb-8 max-w-sm">This area is reserved for administrators only. Use the button below to return to your dashboard.</p>
        <Link href="/dashboard" className="btn-gold">Go Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080c]">
      <Sidebar />
      <main className="lg:ml-72 pt-20 lg:pt-0 p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-10">
           <div className="flex items-center gap-3 bg-amber-500/5 border border-amber-500/10 px-6 py-3 rounded-2xl">
              <ShieldCheck className="text-amber-500" size={20} />
              <p className="text-amber-500 font-black uppercase text-xs tracking-[0.2em]">Administrative Safe Mode Active</p>
           </div>
           {children}
        </div>
      </main>
    </div>
  );
}
