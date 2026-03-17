"use client";
import { useEffect, useState } from "react";
import { DATA_PACKAGES } from "@/lib/firestore";
import { 
  Package, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Loader2,
  Filter,
  Network
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminPackagesPage() {
  const [loading, setLoading] = useState(false);
  const [activeNetwork, setActiveNetwork] = useState("MTN");

  const packages = DATA_PACKAGES[activeNetwork as keyof typeof DATA_PACKAGES] || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Package className="text-amber-500" /> Data Packages
          </h1>
          <p className="text-gray-400 mt-2">Manage data bundle prices and network offerings.</p>
        </div>
        <button className="btn-gold flex items-center gap-2 px-6">
          <Plus size={20} /> Add New Bundle
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
         {Object.keys(DATA_PACKAGES).map((net) => (
           <button
             key={net}
             onClick={() => setActiveNetwork(net)}
             className={`px-6 py-3 rounded-xl border font-bold transition-all whitespace-nowrap ${activeNetwork === net ? 'border-amber-500 bg-amber-500/10 text-white' : 'border-white/5 bg-white/5 text-gray-500 hover:border-white/20'}`}
           >
             {net}
           </button>
         ))}
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">
              <th className="px-6 py-5">Package Name</th>
              <th className="px-6 py-5">Validity</th>
              <th className="px-6 py-5">Cost Price</th>
              <th className="px-6 py-5">Selling Price</th>
              <th className="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center">
                  <Loader2 className="animate-spin mx-auto text-amber-500" size={32} />
                </td>
              </tr>
            ) : packages.map((pkg: any) => (
              <tr key={pkg.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-5">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500">
                         <Network size={16} />
                      </div>
                      <span className="font-bold">{pkg.name}</span>
                   </div>
                </td>
                <td className="px-6 py-5 text-gray-400">{pkg.validity}</td>
                <td className="px-6 py-5 font-mono text-gray-500 italic">GH₵ {(pkg.price * 0.9).toFixed(2)}</td>
                <td className="px-6 py-5">
                   <span className="font-black text-amber-500">GH₵ {pkg.price.toFixed(2)}</span>
                </td>
                <td className="px-6 py-5 text-right">
                   <div className="flex justify-end gap-2">
                      <button className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all" title="Edit">
                         <Edit3 size={18} />
                      </button>
                      <button className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all" title="Delete">
                         <Trash2 size={18} />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card border-dashed bg-transparent border-white/5 flex items-center gap-4 text-gray-500 p-6">
         <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center italic font-serif">i</div>
         <p className="text-sm italic">
           Note: Changes to packages here currently only affect the local data structure. In a full production setup with DataPlug API, 
           we would sync these with the provider's active catalog.
         </p>
      </div>
    </div>
  );
}
