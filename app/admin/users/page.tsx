"use client";
import { useEffect, useState } from "react";
import { getAllUsers, adminCreditWallet } from "@/lib/firestore";
import { 
  Users, 
  Search, 
  MoreVertical, 
  CreditCard, 
  Smartphone, 
  Loader2,
  Plus,
  Minus,
  Shield,
  User
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const { userData: adminUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [creditAmount, setCreditAmount] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    getAllUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  const handleAction = async (type: "credit" | "debit") => {
    if (!selectedUser || !creditAmount) return;
    const amount = parseFloat(creditAmount);
    if (isNaN(amount) || amount <= 0) return toast.error("Invalid amount");

    setActionLoading(true);
    try {
      const finalAmount = type === "credit" ? amount : -amount;
      await adminCreditWallet(selectedUser.uid, finalAmount, adminUser?.name || "Admin");
      toast.success(`Wallet successfully ${type}ed!`);
      // Update local state
      setUsers(users.map(u => u.uid === selectedUser.uid ? { ...u, walletBalance: u.walletBalance + finalAmount } : u));
      setSelectedUser(null);
      setCreditAmount("");
    } catch (error: any) {
      toast.error("Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="text-amber-500" /> User Management
          </h1>
          <p className="text-gray-400 mt-2">Manage all registered users and their wallet balances.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input type="text" placeholder="Filter by email or phone..." className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-amber-500/50 w-full md:w-80" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
         <div className="lg:col-span-3 card p-0 overflow-hidden">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-white/5 text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">
                     <th className="px-6 py-4">User</th>
                     <th className="px-6 py-4">Contact</th>
                     <th className="px-6 py-4">Balance</th>
                     <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                       <td colSpan={4} className="px-6 py-20 text-center">
                          <Loader2 className="animate-spin mx-auto text-amber-500" size={32} />
                       </td>
                    </tr>
                  ) : users.map((u) => (
                    <tr key={u.id} className={`hover:bg-amber-500/[0.02] transition-colors cursor-pointer ${selectedUser?.uid === u.uid ? 'bg-amber-500/[0.05]' : ''}`} onClick={() => setSelectedUser(u)}>
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center font-bold text-gray-500 border border-white/10 uppercase">
                                {u.name?.charAt(0)}
                             </div>
                             <div>
                                <p className="font-bold">{u.name}</p>
                                <div className="flex items-center gap-2">
                                   <span className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-tighter ${u.role === 'admin' ? 'bg-amber-500 text-black' : 'bg-gray-700 text-gray-300'}`}>
                                      {u.role}
                                   </span>
                                </div>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <p className="text-sm">{u.email}</p>
                          <p className="text-xs text-gray-500">{u.phone}</p>
                       </td>
                       <td className="px-6 py-4">
                          <span className="font-black text-amber-500">GH₵ {u.walletBalance?.toFixed(2)}</span>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <button className="text-gray-500 hover:text-white"><MoreVertical size={20} /></button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>

         <div className="lg:col-span-1 space-y-6">
            {!selectedUser ? (
              <div className="card border-dashed border-2 flex flex-col items-center justify-center py-16 text-center">
                 <User className="text-gray-700 mb-4" size={48} />
                 <p className="text-gray-500 text-sm italic">Select a user to perform actions</p>
              </div>
            ) : (
              <div className="card space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                 <h3 className="font-bold flex items-center gap-2 text-lg">
                    <Shield className="text-amber-500" size={18} /> Admin Actions
                 </h3>
                 
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Target Account</p>
                    <p className="font-bold truncate">{selectedUser.name}</p>
                    <p className="text-xs text-amber-500 font-bold">Bal: GH₵ {selectedUser.walletBalance.toFixed(2)}</p>
                 </div>

                 <div className="space-y-4">
                    <div>
                       <label className="label">Amount (GH₵)</label>
                       <input 
                         type="number" 
                         className="input font-bold" 
                         placeholder="0.00" 
                         value={creditAmount}
                         onChange={(e) => setCreditAmount(e.target.value)}
                       />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                       <button
                         onClick={() => handleAction("credit")}
                         disabled={actionLoading}
                         className="flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/20 py-3 rounded-xl font-bold transition-all"
                       >
                          {actionLoading ? <Loader2 className="animate-spin" size={16} /> : <><Plus size={16} /> Credit</>}
                       </button>
                       <button
                         onClick={() => handleAction("debit")}
                         disabled={actionLoading}
                         className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 py-3 rounded-xl font-bold transition-all"
                       >
                          {actionLoading ? <Loader2 className="animate-spin" size={16} /> : <><Minus size={16} /> Debit</>}
                       </button>
                    </div>
                 </div>

                 <div className="text-[10px] text-center text-gray-500 leading-relaxed pt-2">
                    Credits/debits are recorded in the system audit logs. This action cannot be undone.
                 </div>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
