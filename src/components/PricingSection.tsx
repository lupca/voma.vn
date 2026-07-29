import React, { useState } from 'react';
import { Check, ArrowRight, ShieldCheck, FileCheck2, HelpCircle } from 'lucide-react';
import { PricingPlan } from '../types';

interface PricingSectionProps {
  onOpenConsultation: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onOpenConsultation }) => {
  const [isYearly, setIsYearly] = useState(true);

  const plans: PricingPlan[] = [
    {
      id: 'hkd',
      name: 'Gói hộ kinh doanh (HKD)',
      tagline: 'Dành cho cửa hàng bán lẻ, hộ kinh doanh thuế khoán & kê khai',
      monthlyPrice: 80000,
      yearlyPrice: 80000,
      suitableFor: 'Theo doanh thu năm của HKD',
      ctaText: 'Đăng ký sử dụng gói HKD',
      hkdTiers: [
        { revenue: 'Dưới 1 tỷ đ/năm', price: 'Miễn phí (0đ)', note: 'Hỗ trợ khởi nghiệp bán lẻ' },
        { revenue: 'Từ 1 tỷ - 3 tỷ đ/năm', price: '80.000 đ/tháng', note: 'Đầy đủ hóa đơn & kê khai thuế' },
        { revenue: 'Trên 3 tỷ đ/năm', price: 'Liên hệ', note: 'Tư vấn giải pháp riêng' },
      ],
      features: [
        'Hóa đơn điện tử khởi tạo từ máy tính tiền (NĐ 70 & NĐ 123)',
        'Tự động lập tờ khai thuế GTGT (1%) & TNCN (0.5%)',
        'Quản lý 1 cửa hàng POS & 1 kho hàng WMS cơ bản',
        'Kết nối gian hàng Shopee / TikTok Shop',
        'Xuất file sổ sách kế toán chuẩn Thông tư 88',
        'Hỗ trợ kỹ thuật thuế & phần mềm',
      ],
    },
    {
      id: 'omni',
      name: 'Gói Omnichannel Pro',
      tagline: 'Giải pháp toàn diện PIM + OMS + WMS + Thuế đa kênh',
      popular: true,
      monthlyPrice: 890000,
      yearlyPrice: 690000,
      suitableFor: 'Nhà bán đa kênh 1.000 - 15.000 đơn/tháng',
      ctaText: 'Dùng thử miễn phí 14 ngày',
      features: [
        'Toàn bộ tính năng gói Hộ kinh doanh',
        'Trọn bộ PIM quản lý 20.000 SKU không giới hạn',
        'OMS tự động gom đơn Shopee, TikTok Shop, Lazada, Zalo',
        'WMS kho hàng thông minh + app mobile quét mã vạch',
        'CRM chăm sóc khách hàng tự động qua Zalo ZNS',
        'Tự động xuất hóa đơn Tổng cục Thuế theo thời gian thực',
        'Chuyên viên tư vấn thuế đồng hành 1-1',
      ],
    },
    {
      id: 'enterprise',
      name: 'Gói Chuỗi & Enterprise',
      tagline: 'Tùy biến riêng cho thương hiệu lớn, chuỗi showroom & tập đoàn',
      monthlyPrice: 2490000,
      yearlyPrice: 1990000,
      suitableFor: 'Chuỗi > 5 cửa hàng hoặc > 20.000 đơn/tháng',
      ctaText: 'Liên hệ tư vấn báo giá',
      features: [
        'Toàn bộ tính năng gói Omnichannel Pro',
        'Quản lý đa kho WMS, đa chi nhánh bán lẻ',
        'Kết nối API tùy chỉnh với ERP (SAP, Oracle, Odoo)',
        'Hạ tầng máy chủ riêng cam kết uptime 99.99%',
        'Tự động phân bổ đơn theo thuật toán tối ưu cước vận chuyển',
        'Tư vấn pháp lý & tối ưu thuế bởi chuyên gia',
      ],
    },
  ];

  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  return (
    <section id="pricing" className="py-20 md:py-28 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-medium mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Bảng giá minh bạch & tối ưu chi phí</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-100 tracking-tight">
            Gói cước phù hợp <span className="text-gradient-emerald">mọi quy mô bán hàng</span>
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg">
            Đầu tư nhỏ, lợi ích lớn. Tiết kiệm chi phí vận hành và loại bỏ nguy cơ phạt thuế.
          </p>

          {/* Monthly / Yearly Billing Switcher */}
          <div className="mt-8 inline-flex items-center bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                !isYearly
                  ? 'bg-slate-800 text-slate-100 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Thanh toán theo tháng
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                isYearly
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Thanh toán theo năm</span>
              <span className="bg-slate-950 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                Tiết kiệm 25%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const currentPrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between relative border ${
                  plan.popular
                    ? 'bg-slate-900 border-emerald-500/80 shadow-2xl md:-translate-y-2'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 font-bold text-xs px-4 py-1.5 rounded-full shadow-md flex items-center gap-1">
                    <span>Lựa chọn phổ biến nhất</span>
                  </div>
                )}

                <div>
                  <div className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider mb-2">
                    {plan.suitableFor}
                  </div>
                  <h3 className="text-xl font-bold text-slate-100 mb-2">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mb-6 leading-relaxed">{plan.tagline}</p>

                  {/* Price presentation */}
                  <div className="mb-6 pb-6 border-b border-slate-800">
                    {plan.hkdTiers ? (
                      <div className="space-y-2 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                        {plan.hkdTiers.map((tier, tIdx) => (
                          <div key={tIdx} className="flex items-center justify-between text-xs">
                            <span className="text-slate-300">{tier.revenue}:</span>
                            <span className="font-bold text-emerald-400">{tier.price}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl sm:text-4xl font-extrabold text-slate-100 font-mono">
                            {formatVND(currentPrice)}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">đ / tháng</span>
                        </div>
                        {isYearly && (
                          <div className="text-[11px] text-emerald-400 mt-1 font-medium">
                            Thanh toán theo năm ({formatVND(currentPrice * 12)} đ/năm)
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Feature list */}
                  <div className="space-y-3 mb-8">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <div className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5 shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={onOpenConsultation}
                  className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
