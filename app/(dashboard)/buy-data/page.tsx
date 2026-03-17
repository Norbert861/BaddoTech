"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { DATA_PACKAGES, purchaseData } from "@/lib/firestore";
import { 
  Smartphone, 
  ChevronRight, 
  Check, 
  Loader2, 
  AlertCircle,
  Wifi
} from "lucide-react";
import toast from "react-hot-toast";

export default function BuyDataPage() {
  const { userData, refreshUserData } = useAuth();
  const [network, setNetwork] = useState<string | null>(null);
  const [bundleId, setBundleId] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedBundles = network ? (DATA_PACKAGES as any)[network] : [];
  const selectedBundle = selectedBundles.find((b: any) => b.id === bundleId);

  const handlePurchase = async () => {
    if (!network || !bundleId || !phone) return toast.error("Please fill all fields");
    if (phone.length < 10) return toast.error("Invalid phone number");
    if (!userData) return;
    if (userData.walletBalance < (selectedBundle?.price || 0)) {
      return toast.error("Insufficient wallet balance. Please fund your wallet.");
    }

    setLoading(true);
    try {
      if (selectedBundle) {
        await purchaseData(
          userData.uid,
          userData.name,
          network,
          selectedBundle,
          phone,
          userData.walletBalance
        );
        toast.success(`Purchase successful! ${selectedBundle.name} sent to ${phone}`);
        await refreshUserData();
        setBundleId(null);
        setPhone("");
      }
    } catch (error: any) {
      toast.error(error.message || "Purchase failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Wifi className="text-amber-500" /> Buy Data Bundle
        </h1>
        <p className="text-gray-400 mt-2">Select your network and choose a bundle to proceed.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step 1: Select Network */}
        <div className="card md:col-span-1 space-y-6">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-black text-xs flex items-center justify-center font-bold">1</span>
            Select Network
          </h2>
          <div className="space-y-3">
             {Object.keys(DATA_PACKAGES).map((net) => (
               <button
                 key={net}
                 onClick={() => { setNetwork(net); setBundleId(null); }}
                 className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${network === net ? 'border-amber-500 bg-amber-500/10 text-white' : 'border-white/5 bg-white/5 text-gray-400 hover:border-white/20'}`}
               >
                 <span className="font-bold">{net}</span>
                 {network === net && <Check size={18} className="text-amber-500" />}
               </button>
             ))}
          </div>
        </div>

        {/* Step 2: Select Bundle */}
        <div className="card md:col-span-2 space-y-6">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-black text-xs flex items-center justify-center font-bold">2</span>
            Choose Package
          </h2>
          {!network ? (
            <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/5">
              <Smartphone className="mx-auto text-gray-700 mb-4" size={48} />
              <p className="text-gray-500 italic">Please select a network first</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {selectedBundles.map((b: any) => (
                <button
                  key={b.id}
                  onClick={() => setBundleId(b.id)}
                  className={`flex flex-col p-4 rounded-xl border text-left transition-all duration-200 ${bundleId === b.id ? 'border-amber-500 bg-amber-500/10' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xl font-black">{b.name}</span>
                    <span className="text-amber-500 font-bold">GH₵ {b.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-auto text-sm">
                    <span className="text-gray-400">{b.validity}</span>
                    {bundleId === b.id && <span className="text-xs bg-amber-500 text-black px-2 py-0.5 rounded-full font-bold">Selected</span>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Step 3: Recipient & Confirm */}
      <div className={`card space-y-6 transition-all duration-500 ${!bundleId ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-amber-500 text-black text-xs flex items-center justify-center font-bold">3</span>
          Recipient Details
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="label">Recipient Phone Number</label>
              <input
                type="tel"
                placeholder="024XXXXXXX"
                className="input text-lg"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-2">Double check number. Data delivery is irreversible.</p>
            </div>
          </div>
          <div className="bg-amber-500/5 rounded-2xl p-6 border border-amber-500/10">
            <h3 className="text-sm font-bold uppercase text-amber-500 mb-4 tracking-wider">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Network</span>
                <span className="font-bold">{network || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Package</span>
                <span className="font-bold">{selectedBundle?.name || "-"}</span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-3 mt-3">
                <span className="text-white font-bold">Total Cost</span>
                <span className="text-xl font-black text-amber-500">GH₵ {selectedBundle?.price.toFixed(2) || "0.00"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 text-sm text-gray-500 bg-white/5 px-4 py-2 rounded-lg">
            <AlertCircle size={16} className="text-amber-500" />
            <span>Balance after purchase: <span className="text-white font-bold">GH₵ {((userData?.walletBalance || 0) - (selectedBundle?.price || 0)).toFixed(2)}</span></span>
          </div>
          <button
            onClick={handlePurchase}
            disabled={loading || !bundleId}
            className="btn-gold px-12 py-4 flex items-center gap-3 text-lg w-full md:w-auto"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : <>Pay & Proceed <ChevronRight size={20} /></>}
          </button>
        </div>
      </div>
    </div>
  );
}
