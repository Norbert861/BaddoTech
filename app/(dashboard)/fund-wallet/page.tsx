"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { fundWallet } from "@/lib/firestore";
import { 
  CreditCard, 
  ArrowUpRight, 
  Loader2, 
  CheckCircle2,
  Lock,
  Zap
} from "lucide-react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";

// dynamic import to avoid SSR issues with Paystack
const PaystackButton = dynamic(
  () => import("react-paystack").then((mod) => mod.PaystackButton),
  { ssr: false }
);

export default function FundWalletPage() {
  const { userData, user, refreshUserData } = useAuth();
  const [amount, setAmount] = useState<string>("");
  const [funding, setFunding] = useState(false);
  
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";
  const actualAmount = parseFloat(amount);

  const componentProps = {
    email: user?.email || "",
    amount: (actualAmount || 0) * 100, // Paystack takes amount in kobo/pesewas
    publicKey,
    text: "Pay with Paystack",
    onSuccess: async (reference: any) => {
      setFunding(true);
      try {
        await fundWallet(userData!.uid, userData!.name, actualAmount, reference.reference);
        toast.success(`Successfully funded GH₵ ${actualAmount.toFixed(2)}!`);
        await refreshUserData();
        setAmount("");
      } catch (error: any) {
        toast.error("Failed to update wallet. Contact support.");
      } finally {
        setFunding(false);
      }
    },
    onClose: () => toast("Transaction cancelled", { icon: "ℹ️" }),
  };

  const quickAmounts = ["5", "10", "20", "50", "100", "200"];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <CreditCard className="text-amber-500" /> Fund Wallet
        </h1>
        <p className="text-gray-400 mt-2">Add money to your BaddoTech wallet securely.</p>
      </div>

      <div className="card space-y-8">
         {/* Wallet Status */}
         <div className="bg-amber-500/10 rounded-2xl p-6 border border-amber-500/20 text-center">
            <p className="text-sm text-amber-500 font-bold uppercase tracking-widest mb-1">Current Balance</p>
            <p className="text-4xl font-black text-white italic tracking-tighter">GH₵ {userData?.walletBalance?.toFixed(2) || "0.00"}</p>
         </div>

         <div className="space-y-6">
            <div>
              <label className="label">Enter Amount (GH₵)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">GH₵</span>
                <input
                  type="number"
                  placeholder="0.00"
                  className="input pl-14 text-2xl font-bold"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
               {quickAmounts.map((q) => (
                 <button
                   key={q}
                   onClick={() => setAmount(q)}
                   className={`py-3 rounded-xl border font-bold transition-all ${amount === q ? 'border-amber-500 bg-amber-500 text-black' : 'border-white/5 bg-white/5 text-gray-400 hover:border-white/20'}`}
                 >
                   {q}
                 </button>
               ))}
            </div>

            <div className="pt-4">
              {actualAmount > 0 ? (
                /* @ts-ignore */
                <PaystackButton
                  {...componentProps}
                  className="btn-gold w-full flex items-center justify-center gap-3 text-lg py-4 shadow-xl"
                />
              ) : (
                <button disabled className="btn-gold w-full opacity-50 cursor-not-allowed py-4">
                  Enter Amount to Proceed
                </button>
              )}
            </div>
         </div>
         
         <div className="flex flex-col items-center gap-3 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium bg-white/5 px-3 py-1.5 rounded-full">
              <Lock size={12} />
              <span>Secured by Paystack & SSL Encryption</span>
            </div>
            <div className="flex gap-4 opacity-40">
               {/* Simplified logos */}
               <div className="text-[10px] font-black italic tracking-tighter">MTN MoMo</div>
               <div className="text-[10px] font-black italic tracking-tighter uppercase">Telecel Cash</div>
               <div className="text-[10px] font-black italic tracking-tighter">AT Money</div>
            </div>
         </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-6 flex gap-4">
         <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="text-blue-500" size={20} />
         </div>
         <p className="text-sm text-gray-400 leading-relaxed">
           Funding is instant. Once your payment is successful on Paystack, your BaddoTech wallet will be credited automatically. 
           If you encounter any issues, please copy your Paystack reference and contact our 24/7 support.
         </p>
      </div>
    </div>
  );
}
