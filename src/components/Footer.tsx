import React from 'react';
import { VomaLogo } from './VomaLogo';
import { ShieldCheck, Phone, Mail, MapPin, ArrowUp, ExternalLink, LogIn } from 'lucide-react';

interface FooterProps {
  onOpenConsultation: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenConsultation }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-16 pb-12 text-slate-400 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <VomaLogo size="lg" />
            <p className="text-slate-400 leading-relaxed max-w-sm">
              <strong className="text-slate-200">voma.vn</strong> - Giải pháp CRM đa kênh hợp nhất PIM, OMS, WMS và hóa đơn điện tử máy tính tiền tự động kết nối trực tiếp cổng Tổng cục Thuế dành cho Nhà bán & Doanh nghiệp Việt Nam.
            </p>

            <div className="flex items-center gap-2 text-emerald-400 font-medium text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Chuẩn Thông tư 78/2021/TT-BTC & Nghị định 123/2020/NĐ-CP</span>
            </div>
          </div>

          {/* Links Col 1 */}
          <div className="space-y-3">
            <h4 className="text-slate-100 font-bold text-sm uppercase tracking-wider">Sản phẩm VOMA</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#modules" className="hover:text-emerald-400 transition-colors">PIM quản lý danh mục</a></li>
              <li><a href="#modules" className="hover:text-emerald-400 transition-colors">OMS xử lý đơn đa kênh</a></li>
              <li><a href="#modules" className="hover:text-emerald-400 transition-colors">WMS kho hàng mã vạch</a></li>
              <li><a href="#tax-engine" className="hover:text-emerald-400 transition-colors">Hóa đơn máy tính tiền</a></li>
              <li><a href="#modules" className="hover:text-emerald-400 transition-colors">CRM & Zalo ZNS chăm sóc</a></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div className="space-y-3">
            <h4 className="text-slate-100 font-bold text-sm uppercase tracking-wider">Hệ thống & Hỗ trợ</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a 
                  href="https://identity.voma.vn" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors inline-flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Đăng nhập hệ thống</span>
                  <ExternalLink className="w-3 h-3 text-emerald-500" />
                </a>
              </li>
              <li><a href="#calculator" className="hover:text-emerald-400 transition-colors">Tính tiết kiệm thuế</a></li>
              <li><a href="#pricing" className="hover:text-emerald-400 transition-colors">Bảng giá dịch vụ</a></li>
              <li><a href="#faq" className="hover:text-emerald-400 transition-colors">Hỏi đáp pháp lý thuế</a></li>
              <li><button onClick={onOpenConsultation} className="hover:text-emerald-400 transition-colors text-left">Đăng ký tư vấn 1-1</button></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="space-y-3">
            <h4 className="text-slate-100 font-bold text-sm uppercase tracking-wider">Liên hệ voma.vn</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Số 1, ngõ 141/3, phố Lê Văn Hiến, Phường Đông Ngạc, Thành phố Hà Nội, Việt Nam.</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a 
                  href="https://zalo.me/0983650552" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-200 hover:text-emerald-400 font-bold transition-colors"
                >
                  0983 650 552 (Zalo)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="mailto:hotro-nova@nothanagentic.vn" className="hover:text-emerald-400 transition-colors">
                  hotro-nova@nothanagentic.vn
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 <strong className="text-slate-300">voma.vn</strong> - VOMA là thương hiệu thuộc <strong className="text-slate-300">CÔNG TY TNHH NỔ THẦN AGENTIC</strong>. Tất cả quyền được bảo lưu.
          </div>

          <button
            onClick={scrollToTop}
            className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:border-emerald-500/50 hover:text-emerald-400 transition-colors flex items-center gap-1.5"
          >
            <span>Về đầu trang</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};

