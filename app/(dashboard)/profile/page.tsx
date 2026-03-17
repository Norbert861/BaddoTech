"use client";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Phone, Shield, Calendar, Wallet, Smartphone, ShieldCheck } from "lucide-react";

export default function ProfilePage() {
  const { userData } = useAuth();

  const formatDate = (ts: any) => {
    if (!ts) return "N/A";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const infoRows = [
    { label: "Full Name", value: userData?.name, icon: User },
    { label: "Email Address", value: userData?.email, icon: Mail },
    { label: "Phone Number", value: userData?.phone, icon: Phone },
    { label: "Account Role", value: userData?.role, icon: Shield, badge: true },
    { label: "Joined BaddoTech", value: formatDate(userData?.createdAt), icon: Calendar },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <User className="text-amber-500" /> My Profile
        </h1>
        <p className="text-gray-400 mt-2">Manage your account information and preferences.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Col: Avatar & Quick Stats */}
        <div className="md:col-span-1 space-y-6">
          <div className="card text-center py-10 relative overflow-hidden">
             {/* Background Decoration */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-10 -mt-10" />
             <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-500/5 rounded-full -ml-10 -mb-10" />
            
             <div className="w-24 h-24 bg-amber-500 rounded-full mx-auto flex items-center justify-center text-black font-black text-4xl shadow-xl shadow-amber-500/20 mb-6 relative z-10">
               {userData?.name?.charAt(0)}
             </div>
             <h2 className="text-2xl font-bold relative z-10">{userData?.name}</h2>
             <p className="text-gray-500 text-sm mt-1 mb-8 uppercase tracking-widest font-bold">{userData?.role}</p>
             
             <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-8 mt-4 relative z-10 text-left px-2">
                <div>
                   <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Status</p>
                   <div className="flex items-center gap-2 text-green-500 font-bold text-sm">
                      <ShieldCheck size={14} /> Active
                   </div>
                </div>
                <div>
                   <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Tier</p>
                   <p className="text-amber-500 font-bold text-sm">Reseller V1</p>
                </div>
             </div>
          </div>
          
          <div className="card flex items-center gap-4 bg-amber-500/5 border-amber-500/10">
             <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
               <Wallet size={24} />
             </div>
             <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Balance</p>
                <p className="text-xl font-black text-white italic">GH₵ {userData?.walletBalance?.toFixed(2)}</p>
             </div>
          </div>
        </div>

        {/* Right Col: Details List */}
        <div className="md:col-span-2 space-y-6">
           <div className="card space-y-0 p-0 overflow-hidden">
              <div className="p-6 border-b border-white/5">
                <h3 className="text-lg font-bold">Account Details</h3>
              </div>
              <div className="divide-y divide-white/5">
                 {infoRows.map((row) => (
                   <div key={row.label} className="p-6 flex items-center justify-between hover:bg-white/[0.01] transition-colors">
                      <div className="flex items-center gap-4">
                         <div className="text-gray-500">
                           <row.icon size={20} />
                         </div>
                         <div>
                            <p className="text-xs text-gray-500 font-medium">{row.label}</p>
                            <p className="text-white font-semibold mt-0.5">{row.value}</p>
                         </div>
                      </div>
                      {row.badge && (
                        <span className="text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full border border-amber-500/20">
                          Verified
                        </span>
                      )}
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <h3 className="text-red-500 font-bold mb-1">Security Zone</h3>
                <p className="text-sm text-gray-500">Update your password or manage sessions.</p>
              </div>
              <button className="text-sm font-bold text-red-500 hover:text-red-400 transition-colors">Manage Security</button>
           </div>
        </div>
      </div>
    </div>
  );
}
