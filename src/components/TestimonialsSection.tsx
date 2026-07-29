import React from 'react';
import { Star, Quote, Building2, TrendingUp, ShieldCheck } from 'lucide-react';
import { Testimonial } from '../types';

export const TestimonialsSection: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Anh Trần Hoàng Nam',
      role: 'Chủ thương hiệu Thời Trang Nam-X',
      company: 'Hộ kinh doanh Nam-X (Hà Nội)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      content: 'Trước đây khi có đợt kiểm tra thuế, hộ kinh doanh của tôi rất hoang mang vì bán trên Shopee và TikTok Shop dòng tiền vào ra lộn xộn. Từ ngày chuyển sang VOMA, toàn bộ đơn hàng được tự động xuất hóa đơn điện tử máy tính tiền. Rất an tâm và tiết kiệm được 1 kế toán!',
      channel: 'Shopee & TikTok Shop',
      revenueGain: '+45% doanh thu',
      taxTimeSaved: 'Tiết kiệm 40h/tháng',
    },
    {
      id: '2',
      name: 'Chị Lê Thị Mai',
      role: 'Giám đốc vận hành chuỗi Mỹ Phẩm Organic',
      company: 'Công ty TNHH Mai Organic (TP.HCM)',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      content: 'VOMA PIM và WMS thực sự là cứu tinh cho chuỗi 3 cửa hàng và 4 gian hàng thương mại điện tử của bên mình. Tồn kho chuẩn 99.9%, nhặt hàng không bao giờ bị nhầm mẫu. Đặc biệt là tính năng kết nối trực tiếp cổng Tổng cục Thuế cực kỳ mượt!',
      channel: '3 cửa hàng & đa sàn',
      revenueGain: 'Giao đơn nhanh gấp 3',
      taxTimeSaved: '100% đúng hóa đơn',
    },
    {
      id: '3',
      name: 'Anh Nguyễn Quốc Bảo',
      role: 'Chủ hộ kinh doanh Bảo Gia Dụng',
      company: 'Hộ kinh doanh Bảo Gia Dụng (Đà Nẵng)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      content: 'Lúc đầu tôi sợ phần mềm thuế phức tạp khó dùng. Nhưng VOMA thiết kế cực kỳ trực quan, đúng gu người Việt. Chỉ cần bấm nút gom đơn là hệ thống tự lo phần còn lại. Rất xứng đáng đầu tư!',
      channel: 'Lazada & Shopee Mall',
      revenueGain: '+30% lợi nhuận',
      taxTimeSaved: 'Giảm 90% thao tác',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-slate-950 relative border-t border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-medium mb-4">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Đã được 12.000+ Nhà bán Việt Nam tin dùng</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-100 tracking-tight">
            Khách hàng nói gì về <span className="text-gradient-emerald">voma.vn</span>
          </h2>
          <p className="mt-4 text-slate-300 text-base">
            Những câu chuyện thành công thực tế từ các nhà bán hàng đa kênh & hộ kinh doanh trên toàn quốc.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-emerald-500/40 transition-all duration-300"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 italic">
                  "{item.content}"
                </p>
              </div>

              <div>
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{item.name}</h4>
                    <p className="text-xs text-slate-400">{item.company}</p>
                  </div>
                  <span className="text-[10px] bg-slate-950 text-emerald-400 px-2 py-1 rounded border border-slate-800 font-medium font-mono">
                    {item.taxTimeSaved}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
