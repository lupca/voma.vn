import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  Info
} from 'lucide-react';
import { BusinessType } from '../types';

interface InteractiveTaxCalculatorProps {
  onOpenConsultation: () => void;
}

export const InteractiveTaxCalculator: React.FC<InteractiveTaxCalculatorProps> = ({ onOpenConsultation }) => {
  const [businessType, setBusinessType] = useState<BusinessType>('hkd');
  const [monthlyOrders, setMonthlyOrders] = useState<number>(3500);
  const [avgOrderValue, setAvgOrderValue] = useState<number>(280000); // 280k VND
  const [channelsCount, setChannelsCount] = useState<number>(3);

  // Math calculation logic
  const calculations = useMemo(() => {
    // Total Revenue per month
    const monthlyRevenue = monthlyOrders * avgOrderValue;
    const annualRevenue = monthlyRevenue * 12;

    // Tax rate for HKD: 1% GTGT + 0.5% TNCN = 1.5% for general commerce
    // For enterprise: 10% VAT + Corporate income tax
    const estimatedTaxRate = businessType === 'hkd' ? 0.015 : 0.10;
    const estimatedMonthlyTax = monthlyRevenue * estimatedTaxRate;

    // Time saved: avg 2.5 minutes per manual invoice + stock check
    const hoursSavedPerMonth = Math.round((monthlyOrders * 2.5) / 60);

    // Cost saved
    const staffSalarySaved = Math.round((monthlyOrders / 800) * 8500000);

    const penaltyRiskSaved = monthlyRevenue > 500000000 ? 35000000 : 15000000;

    return {
      monthlyRevenue,
      annualRevenue,
      estimatedMonthlyTax,
      hoursSavedPerMonth,
      staffSalarySaved,
      penaltyRiskSaved,
    };
  }, [monthlyOrders, avgOrderValue, channelsCount, businessType]);

  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <section id="calculator" className="py-20 md:py-28 relative bg-slate-950">
      {/* Background Accent Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-medium mb-4">
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>Tính toán hiệu quả tiết kiệm</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-100 tracking-tight">
            Ước tính hiệu quả cho <span className="text-gradient-emerald">Nhà bán của bạn</span>
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg">
            Kéo thả các thông số bên dưới để xem VOMA giúp tiết kiệm bao nhiêu giờ làm việc và bảo vệ bạn khỏi rủi ro vi phạm thuế.
          </p>
        </div>

        {/* Calculator Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-8">
            {/* Business Type Switcher */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                1. Loại hình mô hình kinh doanh:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setBusinessType('hkd')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    businessType === 'hkd'
                      ? 'bg-slate-950 border-emerald-500 text-slate-100 shadow-md ring-1 ring-emerald-500/50'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-sm font-bold text-slate-100">Hộ kinh doanh (HKD)</div>
                  <div className="text-xs text-slate-400 mt-1">Khai thuế khoán / Phương pháp kê khai</div>
                </button>

                <button
                  type="button"
                  onClick={() => setBusinessType('enterprise')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    businessType === 'enterprise'
                      ? 'bg-slate-950 border-emerald-500 text-slate-100 shadow-md ring-1 ring-emerald-500/50'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-sm font-bold text-slate-100">Doanh nghiệp (TNHH / CP)</div>
                  <div className="text-xs text-slate-400 mt-1">Hóa đơn máy tính tiền Nghị định 123 & 70</div>
                </button>
              </div>
            </div>

            {/* Monthly Orders Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  2. Số lượng đơn hàng / tháng:
                </label>
                <span className="text-lg font-mono font-bold text-emerald-400 bg-slate-950 border border-slate-800 px-3 py-1 rounded-lg">
                  {monthlyOrders.toLocaleString('vi-VN')} đơn
                </span>
              </div>
              <input
                type="range"
                min="300"
                max="50000"
                step="200"
                value={monthlyOrders}
                onChange={(e) => setMonthlyOrders(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>300 đơn/tháng</span>
                <span>10.000 đơn</span>
                <span>50.000 đơn/tháng</span>
              </div>
            </div>

            {/* Average Order Value Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  3. Giá trị đơn hàng trung bình (AOV):
                </label>
                <span className="text-base font-mono font-bold text-emerald-400 bg-slate-950 border border-slate-800 px-3 py-1 rounded-lg">
                  {formatVND(avgOrderValue)}
                </span>
              </div>
              <input
                type="range"
                min="50000"
                max="2500000"
                step="25000"
                value={avgOrderValue}
                onChange={(e) => setAvgOrderValue(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>50.000 đ</span>
                <span>1.000.000 đ</span>
                <span>2.500.000 đ</span>
              </div>
            </div>

            {/* Number of Sales Channels */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                4. Số kênh bán hàng kết nối (Shopee, TikTok Shop, Lazada, POS...):
              </label>
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4, 5].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setChannelsCount(count)}
                    className={`flex-1 py-2.5 rounded-xl border font-semibold text-sm transition-all ${
                      channelsCount === count
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-bold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {count} {count === 5 ? 'kênh+' : 'kênh'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-5 bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Kết quả tự động hóa VOMA
              </span>
              <span className="text-xs bg-slate-950 text-emerald-300 px-2.5 py-1 rounded-full border border-slate-800 font-medium">
                Nghị định 123 & Thông tư 78
              </span>
            </div>

            {/* Main Stats Output Grid */}
            <div className="space-y-4">
              {/* Revenue */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div className="text-xs text-slate-400 mb-1">Doanh thu dự kiến / tháng:</div>
                <div className="text-2xl font-bold text-slate-100 font-mono">
                  {formatVND(calculations.monthlyRevenue)}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Doanh thu năm: {formatVND(calculations.annualRevenue)}
                </div>
              </div>

              {/* Time Saved */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Thời gian tiết kiệm / tháng:</span>
                  </div>
                  <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
                    {calculations.hoursSavedPerMonth} giờ xuất hóa đơn & kiểm kho
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500">Giảm 99%</span>
                  <div className="text-xs text-emerald-300 font-bold">Thao tác thủ công</div>
                </div>
              </div>

              {/* Cost Savings */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Chi phí nhân sự tiết kiệm:</span>
                  </div>
                  <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
                    ~ {formatVND(calculations.staffSalarySaved)} / tháng
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500">Tối ưu</span>
                  <div className="text-xs text-emerald-300 font-bold">Bộ máy kế toán</div>
                </div>
              </div>

              {/* Tax Penalty Risk Prevention */}
              <div className="p-4 bg-slate-950/90 border border-emerald-500/30 rounded-xl">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Tuân thủ quy định thuế 100%</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Hạn chế rủi ro phạt vi phạm chậm xuất hóa đơn điện tử máy tính tiền theo quy định của Cơ quan Thuế.
                </p>
              </div>
            </div>

            {/* CTA inside calculator */}
            <button
              onClick={onOpenConsultation}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <span>Nhận tư vấn cài đặt VOMA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
