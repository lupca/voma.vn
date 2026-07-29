import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { InteractiveTaxCalculator } from './components/InteractiveTaxCalculator';
import { ModulesMatrix } from './components/ModulesMatrix';
import { LiveSandboxDemo } from './components/LiveSandboxDemo';
import { PricingSection } from './components/PricingSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FAQSection } from './components/FAQSection';
import { ConsultationModal } from './components/ConsultationModal';
import { Footer } from './components/Footer';
import { MessageSquare, FileCheck2 } from 'lucide-react';

export default function App() {
  const [consultationOpen, setConsultationOpen] = useState(false);

  const scrollToSandbox = () => {
    const el = document.getElementById('tax-engine');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Be_Vietnam_Pro',sans-serif] relative selection:bg-emerald-500 selection:text-slate-950">
      {/* Navigation Bar */}
      <Navbar
        onOpenConsultation={() => setConsultationOpen(true)}
        onOpenSandbox={scrollToSandbox}
      />

      {/* Main Sections */}
      <main>
        {/* 1. Hero Section */}
        <HeroSection
          onOpenConsultation={() => setConsultationOpen(true)}
          onOpenSandbox={scrollToSandbox}
        />

        {/* 2. Interactive Tax Savings & ROI Calculator */}
        <InteractiveTaxCalculator
          onOpenConsultation={() => setConsultationOpen(true)}
        />

        {/* 3. Core 5 Modules Matrix (PIM + OMS + WMS + Tax + CRM) */}
        <ModulesMatrix
          onOpenConsultation={() => setConsultationOpen(true)}
        />

        {/* 4. Live Interactive E-Invoice Sandbox Demo */}
        <LiveSandboxDemo />

        {/* 5. Pricing Plans */}
        <PricingSection
          onOpenConsultation={() => setConsultationOpen(true)}
        />

        {/* 6. Real Merchant Testimonials */}
        <TestimonialsSection />

        {/* 7. FAQ Accordion */}
        <FAQSection />
      </main>

      {/* Footer */}
      <Footer onOpenConsultation={() => setConsultationOpen(true)} />

      {/* Modal Popup */}
      <ConsultationModal
        isOpen={consultationOpen}
        onClose={() => setConsultationOpen(false)}
      />

      {/* Floating Action Button Bar */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        <button
          onClick={scrollToSandbox}
          className="bg-slate-900 border border-emerald-500/50 hover:bg-slate-800 text-emerald-400 p-3 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-2 text-xs font-bold transition-all hover:scale-105 group"
          title="Chạy thử Sandbox Hóa đơn"
        >
          <FileCheck2 className="w-5 h-5 text-emerald-400" />
          <span className="hidden sm:inline">Chạy thử Sandbox</span>
        </button>

        <a
          href="https://zalo.me/0983650552"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 p-3.5 rounded-2xl shadow-2xl shadow-emerald-500/30 flex items-center gap-2 text-xs font-bold transition-all hover:scale-105"
        >
          <MessageSquare className="w-5 h-5 fill-slate-950" />
          <span>Tư vấn Zalo 0983 650 552</span>
        </a>
      </div>
    </div>
  );
}

