"use client";
import { useEffect, useState } from "react";
import { getAllTransactions } from "@/lib/firestore";
import { 
  History, 
  Search, 
  Calendar, 
  Smartphone,
  Zap,
  Loader2,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  User,
  ShieldAlert
} from "lucide-react";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllTransactions().then((data) => {
      setTransactions(data);
      setLoading(false);
    });
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "data_purchase": return <Smartphone className="text-amber-500" />;
      case "airtime": return <Zap className="text-blue-500" />;
      case "wallet_fund": return <ArrowDownLeft className="text-green-500" />;
      case "admin_credit": return <ArrowDownLeft className="text-purple-500" />;
      default: return <History className="text-gray-500" />;
    }
  };

  const formatDate = (ts: any) => {
    if (!ts) return "N/A";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <History className="text-amber-500" /> Platform Logs
          </h1>
          <p className="text-gray-400 mt-2">Audit all user activities and platform transactions.</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
             <input type="text" placeholder="Search logs..." className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-amber-500/50 w-full md:w-64" />
           </div>
           <button className="bg-white/5 border border-white/10 p-3 text-gray-400 rounded-xl hover:text-white transition-colors">
             <Filter size={18} />
           </button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">
              <th className="px-6 py-5">Transaction ID</th>
              <th className="px-6 py-5">User</th>
              <th className="px-6 py-5">Type / Detail</th>
              <th className="px-6 py-5">Amount</th>
              <th className="px-6 py-5">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center">
                  <Loader2 className="animate-spin mx-auto text-amber-500" size={32} />
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-gray-500 italic">No activity recorded yet.</td>
              </tr>
            ) : transactions.map((tx) => (
              <tr key={tx.id} className="text-sm hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-5 font-mono text-[10px] text-gray-500">#{tx.id.substring(0, 12)}</td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-gray-500 font-bold uppercase text-[10px]">
                         {tx.userName?.charAt(0) || 'U'}
                      </div>
                      <div>
                         <p className="font-bold">{tx.userName || 'Unknown User'}</p>
                         <p className="text-[10px] text-gray-500">{tx.userId.substring(0, 8)}</p>
                      </div>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                         {getIcon(tx.type)}
                      </div>
                      <div>
                         <p className="font-bold capitalize">{tx.type.replace('_', ' ')}</p>
                         <p className="text-xs text-gray-500 italic">{tx.bundle || tx.network || (tx.type === 'wallet_fund' ? 'Top up' : '-')}</p>
                      </div>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <span className={`font-black ${tx.type.includes('fund') || tx.type.includes('credit') ? 'text-green-500' : 'text-white'}`}>
                      {tx.type.includes('fund') || tx.type.includes('credit') ? '+' : '-'} GH₵ {parseFloat(tx.amount).toFixed(2)}
                   </span>
                </td>
                <td className="px-6 py-5 text-gray-500 text-xs">
                   {formatDate(tx.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-6 flex items-center gap-4">
         <ShieldAlert className="text-amber-500 flex-shrink-0" size={24} />
         <p className="text-sm text-gray-500 leading-relaxed italic">
           Platform logs are permanent and immutable. Any manually corrected wallet balance will appear here as `admin_credit`.
         </p>
      </div>
    </div>
  );
}
