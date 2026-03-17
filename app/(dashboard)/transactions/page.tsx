"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserTransactions } from "@/lib/firestore";
import { 
  History, 
  Search, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Smartphone,
  Zap,
  Loader2,
  Filter
} from "lucide-react";

export default function TransactionsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getUserTransactions(user.uid).then((data) => {
        setTransactions(data);
        setLoading(false);
      });
    }
  }, [user]);

  const getIcon = (type: string) => {
    switch (type) {
      case "data_purchase": return <Smartphone className="text-amber-500" />;
      case "airtime": return <Zap className="text-blue-500" />;
      case "wallet_fund": return <ArrowDownLeft className="text-green-500" />;
      default: return <History className="text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "success") return <span className="badge-success">Success</span>;
    if (s === "pending") return <span className="badge-pending">Pending</span>;
    return <span className="badge-failed">Failed</span>;
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
            <History className="text-amber-500" /> Transactions
          </h1>
          <p className="text-gray-400 mt-2">View and track all your account activities.</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
             <input type="text" placeholder="Search..." className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-amber-500/50" />
           </div>
           <button className="bg-white/5 border border-white/10 p-2 text-gray-400 rounded-xl hover:text-white transition-colors">
             <Filter size={18} />
           </button>
        </div>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-gray-500 text-sm uppercase font-bold tracking-widest">
              <th className="px-6 py-5">Activity</th>
              <th className="px-6 py-5">Amount</th>
              <th className="px-6 py-5">Details</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center">
                  <Loader2 className="animate-spin mx-auto text-amber-500" size={32} />
                  <p className="text-gray-500 mt-4 italic">Loading your history...</p>
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center">
                  <p className="text-gray-500 italic">No transactions found.</p>
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/5">
                        {getIcon(tx.type)}
                      </div>
                      <div>
                         <p className="font-bold capitalize">{tx.type.replace('_', ' ')}</p>
                         <p className="text-xs text-gray-500 uppercase tracking-tighter">{tx.network || 'Wallet Fund'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`font-black tracking-tight ${tx.type === 'wallet_fund' ? 'text-green-500' : 'text-white'}`}>
                      {tx.type === 'wallet_fund' ? '+' : '-'} GH₵ {parseFloat(tx.amount).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm max-w-[200px] truncate">
                      {tx.bundle && <p className="text-white font-medium">{tx.bundle}</p>}
                      {tx.recipientPhone && <p className="text-gray-500">{tx.recipientPhone}</p>}
                      {tx.reference && <p className="text-gray-500 text-xs">Ref: {tx.reference}</p>}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {getStatusBadge(tx.status)}
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <Calendar size={12} />
                      {formatDate(tx.createdAt)}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
