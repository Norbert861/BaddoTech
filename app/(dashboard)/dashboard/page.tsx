"use client";
import { useAuth } from "@/context/AuthContext";
import { 
  Wallet, 
  ArrowUpRight, 
  Smartphone, 
  Zap, 
  TrendingUp,
  Clock,
  History,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";

export default function DashboardHome() {
  const { userData } = useAuth();

  const stats = [
    { label: "Wallet Balance", value: `GH₵ ${userData?.walletBalance?.toFixed(2) || "0.00"}`, icon: Wallet, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Total Spent", value: "GH₵ 0.00", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Successful Orders", value: "0", icon: ShieldCheck, color: "text-green-500", bg: "bg-green-500/10" },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Hello, {userData?.name?.split(' ')[0]} 👋</h1>
          <p className="text-gray-400 mt-1">Welcome back to your BaddoTech dashboard.</p>
        </div>
        <Link href="/fund-wallet" className="btn-gold flex items-center gap-2 px-8">
          Fund Wallet <ArrowUpRight size={20} />
        </Link>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card flex items-center gap-5">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <Icon size={28} />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Zap className="text-amber-500" size={20} /> Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link href="/buy-data" className="card-hover group p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-black transition-colors">
                <Smartphone size={32} />
              </div>
              <ArrowUpRight className="text-gray-600 group-hover:text-amber-500 transition-colors" />
            </div>
            <h3 className="text-xl font-bold mb-2">Buy Cheap Data</h3>
            <p className="text-gray-400">Instantly purchase MTN, Telecel, and AirtelTigo data bundles at best rates.</p>
          </Link>
          <Link href="/buy-airtime" className="card-hover group p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Zap size={32} />
              </div>
              <ArrowUpRight className="text-gray-600 group-hover:text-blue-500 transition-colors" />
            </div>
            <h3 className="text-xl font-bold mb-2">Refill Airtime</h3>
            <p className="text-gray-400">Top up airtime for any network in Ghana with just a phone number.</p>
          </Link>
        </div>
      </div>

      {/* Recent Transactions placeholder */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock className="text-amber-500" size={20} /> Recent Transactions
          </h2>
          <Link href="/transactions" className="text-amber-500 hover:text-amber-400 text-sm font-semibold">View All</Link>
        </div>
        <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-2xl">
          <History className="mx-auto text-gray-700 mb-4" size={48} />
          <p className="text-gray-400 italic">No transactions found yet. Your activity will appear here.</p>
        </div>
      </div>
    </div>
  );
}

