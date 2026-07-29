import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Store, 
  ShoppingBag, 
  FileCheck2, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Database, 
  RefreshCw,
  QrCode,
  Building2,
  Receipt,
  Check
} from 'lucide-react';
import { BusinessType } from '../types';

interface HeroSectionProps {
  onOpenConsultation: () => void;
  onOpenSandbox: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenConsultation, onOpenSandbox }) => {
  const [businessType, setBusinessType] = useState<BusinessType>('hkd');
  const [activeStep, setActiveStep] = useState(0);
  const [invoiceCount, setInvoiceCount] = useState(148290);

  // Auto increment invoice ticker for live realistic feeling
  useEffect(() => {
    const interval = setInterval(() => {
      setInvoiceCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Step cycle simulation for hero interactive engine
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 3500);
    return () => clearInterval(stepInterval);
  }, []);

  const flowSteps = [
    {
      step: '01',
      title: 'Nhận đơn đa kênh',
      subtitle: 'Shopee, TikTok Shop, Lazada, POS',
      icon: ShoppingBag,
      color: 'from-slate-800 to-slate-900 border-slate-700',
      tag: 'Omnichannel OMS',
    },
    {
      step: '02',
      title: 'Đồng bộ PIM & WMS',
      subtitle: 'Trừ tồn kho chính xác theo SKU',
      icon: Layers,
      color: 'from-slate-800 to-slate-900 border-slate-700',
      tag: 'Real-time WMS',
    },
    {
      step: '03',
      title: 'Tự động xuất hóa đơn',
      subtitle: 'Theo Nghị định 123 và Nghị định 70',
      icon: Receipt,
      color: 'from-emerald-950 to-slate-900 border-emerald-500/40',
      tag: 'Hóa đơn máy tính tiền',
    },
    {
      step: '04',
      title: 'Khai thuế tự động',
      subtitle: 'Truyền dữ liệu tới cổng Tổng cục Thuế',
      icon: ShieldCheck,
      color: 'from-emerald-900 to-slate-900 border-emerald-500/40',
      tag: 'Chuẩn Tổng cục Thuế',
    },
  ];

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-grid-pattern">
      {/* Background Lighting Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Highlight Badge */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs sm:text-sm font-medium mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Nền tảng CRM đa kênh tích hợp thuế tự động cho Nhà bán Việt Nam</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-100 max-w-5xl leading-[1.15]">
            Giải pháp <span className="text-gradient-emerald">CRM đa kênh</span> kết hợp{' '}
            <span className="text-gradient-amber">thuế tự động</span> cho Nhà bán Việt Nam
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl leading-relaxed font-normal">
            Hợp nhất <strong className="text-slate-100 font-semibold">PIM</strong> (Sản phẩm),{' '}
            <strong className="text-slate-100 font-semibold">OMS</strong> (Đơn hàng),{' '}
            <strong className="text-slate-100 font-semibold">WMS</strong> (Kho hàng) và{' '}
            <strong className="text-emerald-400 font-semibold">hóa đơn điện tử tự động</strong> kết nối trực tiếp Tổng cục Thuế. An tâm bán hàng, tối ưu chi phí vận hành.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <button
              onClick={onOpenConsultation}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 group"
            >
              <span>Đăng ký tư vấn & dùng thử 14 ngày</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenSandbox}
              className="w-full sm:w-auto px-7 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-emerald-500/50 font-semibold text-base rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <FileCheck2 className="w-5 h-5 text-emerald-400" />
              <span>Chạy thử sandbox xuất hóa đơn</span>
            </button>
          </div>

          {/* Social Proof Stats Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Chuẩn Thông tư 78 & Nghị định 123</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Khởi tạo từ máy tính tiền (Nghị định 70)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Đồng bộ Shopee, TikTok Shop, Lazada</span>
            </div>
          </div>
        </div>

        {/* Interactive Engine Display Panel */}
        <div className="mt-6 relative rounded-2xl p-1 bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
          {/* Top Panel Controls Header */}
          <div className="bg-slate-950/90 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-700" />
              <div className="w-3 h-3 rounded-full bg-slate-700" />
              <div className="w-3 h-3 rounded-full bg-slate-700" />
              <span className="ml-2 text-xs font-mono text-slate-400">voma.vn/live-tax-engine</span>
            </div>

            {/* Business Model Selector Toggle */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setBusinessType('hkd')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  businessType === 'hkd'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Hộ kinh doanh (Thuế khoán / Kê khai)
              </button>
              <button
                onClick={() => setBusinessType('enterprise')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  businessType === 'enterprise'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Doanh nghiệp (Khấu trừ / Chuỗi)
              </button>
            </div>

            {/* Live TCT Connection Badge */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Hóa đơn đã phát hành hôm nay: <strong className="text-emerald-400 font-mono">{invoiceCount.toLocaleString('vi-VN')}</strong></span>
            </div>
          </div>

          {/* Interactive Flow Diagram */}
          <div className="p-6 md:p-8 bg-slate-950/90 relative">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
              {flowSteps.map((item, idx) => {
                const Icon = item.icon;
                const isActive = activeStep === idx;

                return (
                  <div
                    key={item.step}
                    onClick={() => setActiveStep(idx)}
                    className={`cursor-pointer rounded-xl p-5 transition-all duration-300 relative border ${
                      isActive
                        ? 'bg-slate-900 border-emerald-500 shadow-md scale-[1.01]'
                        : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold text-slate-500">{item.step}</span>
                      <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-800 text-slate-300`}>
                        {item.tag}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-emerald-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-100">{item.title}</h4>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">{item.subtitle}</p>

                    {/* Step Status Indicator */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Trạng thái:</span>
                      <span className="text-emerald-400 font-medium flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Tự động
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Context Card Based on Business Type */}
            <div className="mt-6 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h5 className="text-sm font-bold text-slate-100">
                      {businessType === 'hkd'
                        ? 'Cấu hình thuế hộ kinh doanh kê khai (Thông tư 88 & Nghị định 123)'
                        : 'Cấu hình doanh nghiệp bán hàng đa kênh (Thông tư 78)'}
                    </h5>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                      {businessType === 'hkd' ? 'Tự động kê khai thuế GTGT 1% + TNCN 0.5%' : 'Hóa đơn máy tính tiền khấu trừ'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    VOMA tự động liên kết mã tra cứu hóa đơn XML gửi cổng Tổng cục Thuế ngay khi đơn Shopee, TikTok, Lazada được bàn giao cho đơn vị vận chuyển.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right hidden sm:block">
                  <div className="text-xs text-slate-400">Tốc độ phát hành:</div>
                  <div className="text-sm font-mono font-bold text-emerald-400">&lt; 0.3s / hóa đơn</div>
                </div>
                <button
                  onClick={onOpenSandbox}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5"
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>Thử xuất hóa đơn</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Strategic Brand Integration Marquee */}
        <div className="mt-16 pt-8 border-t border-slate-800/80">
          <p className="text-center text-xs font-medium uppercase tracking-widest text-slate-400 mb-6">
            Tích hợp liền mạch với hệ sinh thái thương mại điện tử & thuế Việt Nam
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-90">
            <div className="flex items-center gap-2 text-slate-300 text-sm bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span>Shopee API Platinum</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 text-sm bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-100" />
              <span>TikTok Shop Partner</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 text-sm bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Lazada Direct Sync</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 text-sm bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
              <span>Zalo OA Official</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400 text-sm bg-slate-900 px-4 py-2 rounded-xl border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Kết nối trực tiếp Tổng cục Thuế</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
