"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Smartphone,
  CreditCard,
  History,
  User,
  LogOut,
  Zap,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const { logOut, userData } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Buy Data", href: "/buy-data", icon: Smartphone },
    { name: "Buy Airtime", href: "/buy-airtime", icon: Zap },
    { name: "Fund Wallet", href: "/fund-wallet", icon: CreditCard },
    { name: "Transactions", href: "/transactions", icon: History },
    { name: "Profile", href: "/profile", icon: User },
  ];

  if (userData?.role === "admin") {
    navItems.push({ name: "Admin Panel", href: "/admin", icon: ShieldCheck });
  }

  const handleLogout = async () => {
    await logOut();
    router.push("/signin");
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full z-40 bg-[#13131f] border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Zap className="text-amber-500 fill-current" size={20} />
          <span className="font-black uppercase italic tracking-tight">BaddoTech</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#13131f] border-r border-white/5 flex flex-col transition-transform duration-300 transform ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-8">
          <Link href="/dashboard" className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Zap className="text-black fill-current" size={24} />
            </div>
            <span className="text-2xl font-black uppercase italic tracking-tighter">
              Baddo<span className="text-amber-500">Tech</span>
            </span>
          </Link>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={active ? "sidebar-link-active" : "sidebar-link"}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 font-semibold w-full"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
