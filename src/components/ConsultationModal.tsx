import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, CheckCircle2, ShieldCheck, Phone, User, Store, Send, Shield } from 'lucide-react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    businessType: 'Hộ kinh doanh',
    channels: 'Shopee & TikTok Shop',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#10B981', '#34D399', '#059669'],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-100 p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-bold text-slate-100">
              Đăng ký thành công!
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
              Cảm ơn <strong className="text-emerald-400">{formData.fullName}</strong>. Chuyên viên tư vấn thuế & CRM VOMA sẽ liên hệ qua SĐT <strong className="text-slate-100">{formData.phone}</strong> trong vòng 15 phút.
            </p>

            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-6 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-all"
            >
              Hoàn tất & quay lại trang chủ
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Shield className="w-4 h-4" />
              <span>Tư vấn thuế & CRM tự động miễn phí</span>
            </div>

            <h3 className="text-2xl font-bold text-slate-100">
              Nhận tư vấn & dùng thử VOMA 14 ngày
            </h3>

            <p className="text-xs text-slate-400 mt-1 mb-6">
              Đội ngũ chuyên gia pháp lý thuế VOMA sẽ hỗ trợ bạn chuẩn hóa hóa đơn máy tính tiền và đồng bộ đa kênh.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Họ và tên của bạn *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Nguyễn Văn An"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Số điện thoại Zalo *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="0912 345 678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Mô hình kinh doanh hiện tại
                </label>
                <select
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="Hộ kinh doanh">Hộ kinh doanh (HKD)</option>
                  <option value="Doanh nghiệp TNHH/CP">Doanh nghiệp (TNHH / Cổ phần)</option>
                  <option value="Chuỗi Showroom/Cửa hàng">Chuỗi cửa hàng / Showroom</option>
                  <option value="Cá nhân bán online">Cá nhân bán online chuẩn bị lên HKD</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Kênh bán hàng chính
                </label>
                <input
                  type="text"
                  placeholder="Shopee, TikTok Shop, Cửa hàng POS..."
                  value={formData.channels}
                  onChange={(e) => setFormData({ ...formData, channels: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <Send className="w-4 h-4 fill-slate-950" />
                  <span>Xác nhận đăng ký tư vấn</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cam kết bảo mật thông tin 100% theo quy định VOMA</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
