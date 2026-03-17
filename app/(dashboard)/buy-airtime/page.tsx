"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AIRTIME_NETWORKS, purchaseAirtime } from "@/lib/firestore";
import { 
  Zap, 
  ChevronRight, 
  Check, 
  Loader2, 
  AlertCircle,
  Phone
} from "lucide-react";
import toast from "react-hot-toast";

export default function BuyAirtimePage() {
  const { userData, refreshUserData } = useAuth();
  const [network, setNetwork] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    const val = parseFloat(amount);
    if (!network || !amount || !phone) return toast.error("Please fill all fields");
    if (isNaN(val) || val < 1) return toast.error("Minimum airtime is GH₵ 1");
    if (phone.length < 10) return toast.error("Invalid phone number");
    if (!userData) return;
    if (userData.walletBalance < val) {
      return toast.error("Insufficient wallet balance.");
    }

    setLoading(true);
    try {
      await purchaseAirtime(userData.uid, userData.name, network, phone, val, userData.walletBalance);
      toast.success(`Airtime of GH₵ ${val.toFixed(2)} sent to ${phone}!`);
      await refreshUserData();
      setAmount("");
      setPhone("");
    } catch (error: any) {
      toast.error(error.message || "Purchase failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Zap className="text-amber-500 fill-current" /> Buy Airtime
        </h1>
        <p className="text-gray-400 mt-2">Recharge your phone or send airtime to others instantly.</p>
      </div>

      <div className="card space-y-8">
        {/* Step 1: Select Network */}
        <div className="space-y-4">
          <label className="label">1. Select Network</label>
          <div className="grid grid-cols-3 gap-4">
             {AIRTIME_NETWORKS.map((net) => (
               <button
                 key={net}
                 onClick={() => setNetwork(net)}
                 className={`flex flex-col items-center justify-center p-6 rounded-xl border transition-all duration-200 ${network === net ? 'border-amber-500 bg-amber-500/10 text-white' : 'border-white/5 bg-white/5 text-gray-400 hover:border-white/20'}`}
               >
                 <span className="font-bold tracking-tight">{net}</span>
                 {network === net && <Check size={16} className="text-amber-500 mt-2" />}
               </button>
             ))}
          </div>
        </div>

        {/* Step 2: Details */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
               <label className="label">2. Recipient Number</label>
               <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="tel"
                    placeholder="024XXXXXXX"
                    className="input pl-12"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
               </div>
             </div>
             <div>
               <label className="label">3. Amount (GH₵)</label>
               <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">GH₵</span>
                  <input
                    type="number"
                    placeholder="2.00"
                    className="input pl-14 font-bold"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
               </div>
             </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 text-sm text-gray-500 bg-white/5 px-4 py-2 rounded-lg">
            <AlertCircle size={16} className="text-amber-500" />
            <p>Wallet Balance: <span className="text-white font-bold">GH₵ {userData?.walletBalance?.toFixed(2) || "0.00"}</span></p>
          </div>
          <button
            onClick={handlePurchase}
            disabled={loading || !network}
            className="btn-gold px-12 py-4 flex items-center gap-3 text-lg w-full md:w-auto"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : <>Buy Airtime <ChevronRight size={20} /></>}
          </button>
        </div>
      </div>

      <div className="flex justify-center gap-6 opacity-30 grayscale pointer-events-none">
         <span className="text-sm font-bold tracking-widest italic uppercase">MTN</span>
         <span className="text-sm font-bold tracking-widest italic uppercase">Telecel</span>
         <span className="text-sm font-bold tracking-widest italic uppercase">AirtelTigo</span>
      </div>
    </div>
  );
}
