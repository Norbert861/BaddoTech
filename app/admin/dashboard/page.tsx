"use client";
import { useEffect, useState } from "react";
import { getAllTransactions, getAllUsers } from "@/lib/firestore";
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Smartphone, 
  History, 
  Loader2,
  DollarSign,
  ShoppingCart
} from "lucide-react";

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllUsers(), getAllTransactions()]).then(([u, t]) => {
      setUsers(u);
      setTransactions(t);
      setLoading(false);
    });
  }, []);

  const totalWalletBalances = users.reduce((acc, curr) => acc + (curr.walletBalance || 0), 0);
  const totalRevenue = transactions
    .filter(t => t.type !== 'wallet_fund' && t.status === 'success')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);
  
  const totalFunds = transactions
    .filter(t => t.type === 'wallet_fund' && t.status === 'success')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const stats = [
    { label: "Total Users", value: users.length, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Total Revenue", value: `GH₵ ${totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Total Sales", value: transactions.filter(t => t.type !== 'wallet_fund').length, icon: ShoppingCart, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Wallet Liabilities", value: `GH₵ ${totalWalletBalances.toFixed(2)}`, icon: CreditCard, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center">
        <Loader2 className="animate-spin text-amber-500 mb-4" size={40} />
        <p className="text-gray-500 italic">Compiling platform data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">Admin Overview</h1>
        <p className="text-gray-500 mt-2 text-lg">Platform performance and statistics at a glance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {stats.map((stat) => (
           <div key={stat.label} className="card relative overflow-hidden group">
              <div className={`absolute -right-4 -bottom-4 opacity-5 group-hover:scale-125 transition-transform duration-500 ${stat.color}`}>
                 <stat.icon size={80} />
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.bg} ${stat.color}`}>
                 <stat.icon size={24} />
              </div>
              <p className="text-sm font-bold text-gray-400 mb-1 uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-black">{stat.value}</p>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
               <History className="text-amber-500" /> Recent Activity
            </h2>
            <div className="card p-0 overflow-hidden">
               <table className="w-full text-left">
                  <thead>
                     <tr className="border-b border-white/5 text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Action</th>
                        <th className="px-6 py-4 text-right">Amount</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     {transactions.slice(0, 10).map((tx) => (
                       <tr key={tx.id} className="text-sm hover:bg-white/[0.02]">
                          <td className="px-6 py-4">
                             <p className="font-bold">{tx.userName || 'Unknown'}</p>
                             <p className="text-[10px] text-gray-500">{tx.userId.substring(0, 8)}</p>
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${tx.type === 'wallet_fund' ? 'bg-green-500' : 'bg-amber-500'}`} />
                                <span className="capitalize">{tx.type.replace('_', ' ')}</span>
                             </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <span className="font-black">GH₵ {parseFloat(tx.amount).toFixed(2)}</span>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
               <Smartphone className="text-amber-500" /> Inventory Stats
            </h2>
            <div className="card h-fit space-y-6">
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                     <span className="text-sm font-bold text-gray-400">Total Profit Margin (Static)</span>
                     <span className="text-xs font-black bg-blue-500 text-white px-2 py-0.5 rounded">AUTO</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex">
                     <div className="h-full bg-amber-500 w-[60%]" title="MTN" />
                     <div className="h-full bg-red-500 w-[25%]" title="Telecel" />
                     <div className="h-full bg-blue-600 w-[15%]" title="AirtelTigo" />
                  </div>
                  <div className="grid grid-cols-3 text-[10px] font-black uppercase tracking-widest pt-2">
                     <div className="text-amber-500">MTN (60%)</div>
                     <div className="text-red-500">TEL (25%)</div>
                     <div className="text-blue-500">AT (15%)</div>
                  </div>
               </div>
               
               <div className="pt-6 border-t border-white/5">
                  <p className="text-xs text-center text-gray-500 italic leading-relaxed">
                    DataPlug API connectivity is active. Orders are fulfilled automatically via your reseller wallet balance.
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
