import React, { useState, useEffect } from 'react';
import { VomaLogo } from './VomaLogo';
import { ShieldCheck, Menu, X, Phone, ArrowRight, FileCheck2, LogIn } from 'lucide-react';

interface NavbarProps {
  onOpenConsultation: () => void;
  onOpenSandbox: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenConsultation, onOpenSandbox }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Tính năng đột phá', href: '#features' },
    { name: 'PIM / OMS / WMS', href: '#modules' },
    { name: 'Hóa đơn & thuế', href: '#tax-engine' },
    { name: 'Tính tiết kiệm thuế', href: '#calculator' },
    { name: 'Bảng giá', href: '#pricing' },
    { name: 'Hỏi đáp', href: '#faq' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Banner Ticker */}
      <div className="bg-slate-900 border-b border-slate-800 py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-slate-300">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 font-medium px-2 py-0.5 rounded border border-emerald-500/30 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Tổng Cục Thuế Live API
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="truncate text-slate-300">
              Chuẩn hóa hóa đơn máy tính tiền theo <strong className="text-emerald-400 font-medium">Nghị định 70/2024 & Thông tư 78</strong> cho hộ kinh doanh & shop đa kênh
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-slate-300 text-xs shrink-0">
            <a 
              href="https://zalo.me/0983650552" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1.5 text-slate-200 hover:text-emerald-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hotline / Zalo: <strong className="text-emerald-400 font-semibold">0983 650 552</strong></span>
            </a>
            <span className="text-slate-700">|</span>
            <button
              onClick={onOpenSandbox}
              className="flex items-center gap-1 text-slate-300 hover:text-emerald-400 font-medium transition-colors"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Thử xuất hóa đơn</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl py-3'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center">
            <VomaLogo size="md" />
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden xl:flex items-center gap-1 bg-slate-900/80 border border-slate-800 rounded-full px-4 py-1.5 backdrop-blur-md">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-emerald-400 hover:bg-slate-800/50 rounded-full transition-all"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={onOpenSandbox}
              className="px-3.5 py-2 text-sm font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 rounded-xl transition-all flex items-center gap-1.5"
            >
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <span>Thử xuất hóa đơn</span>
            </button>

            <a
              href="https://identity.voma.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 text-sm font-semibold text-emerald-400 bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 hover:border-emerald-400 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
            >
              <LogIn className="w-4 h-4 text-emerald-400" />
              <span>Đăng nhập</span>
            </a>

            <button
              onClick={onOpenConsultation}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <span>Nhận tư vấn</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <a
              href="https://identity.voma.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="sm:hidden px-3 py-1.5 text-xs font-semibold text-emerald-400 bg-slate-900 border border-emerald-500/40 rounded-lg flex items-center gap-1"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-400" />
              <span>Đăng nhập</span>
            </a>
            <button
              onClick={onOpenConsultation}
              className="sm:hidden px-3 py-1.5 text-xs font-bold bg-emerald-500 text-slate-950 rounded-lg"
            >
              Tư vấn
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-emerald-400 bg-slate-900 border border-slate-800 rounded-xl"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Sheet */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-slate-800 px-4 pt-4 pb-6 mt-2 space-y-3">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 text-base font-medium text-slate-200 hover:text-emerald-400 hover:bg-slate-900 rounded-xl"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <a
                href="https://identity.voma.vn"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-slate-900 border border-emerald-500/50 text-emerald-400 hover:text-emerald-300 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4 text-emerald-400" />
                <span>Đăng nhập hệ thống (identity.voma.vn)</span>
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSandbox();
                }}
                className="w-full py-3 px-4 bg-slate-900 border border-slate-700 text-slate-100 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
              >
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                <span>Thử xuất hóa đơn trực tiếp</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenConsultation();
                }}
                className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2"
              >
                <span>Đăng ký tư vấn thuế tự động</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center">
                <a 
                  href="https://zalo.me/0983650552" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-emerald-400"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Hotline / Zalo hỗ trợ: <strong className="text-emerald-400">0983 650 552</strong></span>
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

