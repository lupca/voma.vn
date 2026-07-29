import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react';
import { FAQItem } from '../types';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      category: 'Tax',
      question: 'Hộ kinh doanh bán hàng trên Shopee/TikTok Shop có bắt buộc xuất hóa đơn điện tử không?',
      answer: 'Theo Nghị định 123/2020/NĐ-CP, Thông tư 78/2021/TT-BTC và Nghị định 70/2024/NĐ-CP, hộ kinh doanh thuộc diện kê khai hoặc có doanh thu từ bán lẻ trực tuyến bắt buộc phải khởi tạo hóa đơn điện tử từ máy tính tiền kết nối dữ liệu với cơ quan Thuế. VOMA giúp bạn tự động hóa 100% quy trình này.',
    },
    {
      category: 'Tax',
      question: 'VOMA kết nối với Tổng cục Thuế như thế nào? Có an toàn pháp lý không?',
      answer: 'VOMA tích hợp sẵn với các nhà cung cấp giải pháp hóa đơn điện tử được cơ quan Thuế cấp phép (VNPT, Viettel, MInvoice, EasyInvoice, BKAV...). Dữ liệu hóa đơn XML được ký số và gửi trực tiếp tới cổng Tổng cục Thuế nhanh chóng và bảo mật.',
    },
    {
      category: 'Integration',
      question: 'Tôi có thể đồng bộ bao nhiêu gian hàng Shopee, TikTok Shop và Lazada cùng lúc?',
      answer: 'Không giới hạn! VOMA PIM & OMS hỗ trợ kết nối đa tài khoản, đa gian hàng trên Shopee, TikTok Shop, Lazada, Tiki, Facebook POS và Zalo OA trong một giao diện duy nhất.',
    },
    {
      category: 'WMS',
      question: 'Nếu kho hàng của tôi bị lệch tồn kho thực tế so với trên sàn thì xử lý thế nào?',
      answer: 'VOMA WMS cung cấp quy trình kiểm kê định kỳ qua ứng dụng quét mã vạch di động. Hệ thống tự động ghi nhận chênh lệch, tạo phiếu điều chỉnh kho và đồng bộ tồn kho khả dụng mới nhất lên tất cả các sàn e-commerce.',
    },
    {
      category: 'CRM',
      question: 'Tôi có được hỗ trợ thiết lập ban đầu và hướng dẫn khai thuế không?',
      answer: 'Có! Khi đăng ký VOMA, đội ngũ chuyên viên tư vấn thuế & kỹ thuật sẽ đồng hành 1-1 cài đặt hệ thống, kết nối sàn, cấp mẫu hóa đơn điện tử và hỗ trợ trong suốt quá trình vận hành.',
    },
  ];

  return (
    <section id="faq" className="py-20 md:py-28 bg-slate-950 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-medium mb-4">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span>Giải đáp thắc mắc thường gặp</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Hỏi đáp về <span className="text-gradient-emerald">thuế & quản trị đa kênh</span>
          </h2>
          <p className="mt-4 text-slate-300 text-base">
            Mọi thắc mắc của bạn về pháp lý thuế, tích hợp sàn và vận hành kho hàng đều được giải đáp rõ ràng.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-slate-100 text-sm sm:text-base hover:text-emerald-400 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 text-emerald-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-800 pt-4 bg-slate-950/60">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
