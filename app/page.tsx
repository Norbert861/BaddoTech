"use client";
import Link from "next/link";
import { MoveRight, Smartphone, Zap, ShieldCheck, CreditCard, ChevronRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0f]/80 backdrop-blur-lg border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Zap className="text-black fill-current" size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">
              Baddo<span className="text-amber-500">Tech</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/signin" className="btn-ghost font-semibold">Login</Link>
            <Link href="/signup" className="btn-gold px-8 py-2.5">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 hero-gradient overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full text-amber-500 font-bold text-sm mb-8 float">
            <Zap size={14} className="fill-current" />
            <span>Fast & Secure Data Delivery</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight leading-tight">
            Cheap Data <br />
            <span className="gradient-text italic">For The People.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed">
            The #1 platform in Ghana for instant MTN, Telecel, and AirtelTigo data bundles. 
            Stop paying more, start buying with BaddoTech.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/signup" className="btn-gold flex items-center gap-2 px-10 py-4 text-lg">
              Buy Data Now <ChevronRight size={20} />
            </Link>
            <Link href="#features" className="btn-outline px-10 py-4 text-lg">
              Learn More
            </Link>
          </div>

          <div className="mt-24 grid grid-cols-3 gap-12 max-w-4xl w-full opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="flex items-center justify-center text-4xl font-extrabold text-white tracking-widest italic">MTN</div>
             <div className="flex items-center justify-center text-4xl font-extrabold text-white tracking-widest italic uppercase">Telecel</div>
             <div className="flex items-center justify-center text-3xl font-extrabold text-white tracking-widest italic truncate">AirtelTigo</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose BaddoTech?</h2>
            <p className="text-gray-400">Everything you need to stay connected at a fraction of the cost.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-hover">
              <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/20">
                <Zap className="text-amber-500" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Delivery</h3>
              <p className="text-gray-400 leading-relaxed">Our system is automated. Your data bundle hits your phone the moment your payment is confirmed.</p>
            </div>
            <div className="card-hover">
              <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/20">
                <CreditCard className="text-amber-500" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Cheap Rates</h3>
              <p className="text-gray-400 leading-relaxed">We provide wholesale prices to individual users. Save up to 40% on your monthly data expenses.</p>
            </div>
            <div className="card-hover">
              <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/20">
                <ShieldCheck className="text-amber-500" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Wallet</h3>
              <p className="text-gray-400 leading-relaxed">Fund your wallet securely via Paystack and use your balance anytime to buy data or airtime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
            <Zap className="text-black fill-current" size={18} />
          </div>
          <span className="text-xl font-black uppercase italic">
            Baddo<span className="text-amber-500">Tech</span>
          </span>
        </div>
        <p className="text-gray-500 text-sm">© 2026 BaddoTech GH. All rights reserved.</p>
      </footer>
    </div>
  );
}
