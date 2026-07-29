import React, { useState } from 'react';
import { 
  Layers, 
  ShoppingBag, 
  Boxes, 
  Receipt, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  BarChart3,
  Cpu,
  Activity,
  ShieldAlert,
  Smartphone
} from 'lucide-react';
import { ModuleDetail } from '../types';

interface ModulesMatrixProps {
  onOpenConsultation: () => void;
}

export const ModulesMatrix: React.FC<ModulesMatrixProps> = ({ onOpenConsultation }) => {
  const [activeTab, setActiveTab] = useState<string>('pim');

  const modules: ModuleDetail[] = [
    {
      id: 'pim',
      title: 'PIM - Quản lý sản phẩm tập trung',
      subtitle: 'Một nơi quản lý danh mục sản phẩm cho Shopee, TikTok Shop, Lazada, Website & POS',
      badge: 'Product Information Management',
      iconName: 'Layers',
      description: 'Không còn cảnh phải đăng từng sản phẩm thủ công lên nhiều sàn thương mại điện tử. VOMA PIM cho phép bạn tạo sản phẩm 1 lần, tự động chuẩn hóa thuộc tính từng sàn và đồng bộ hàng nghìn SKU chỉ với 1 thao tác.',
      color: 'from-blue-500 to-cyan-500',
      features: [
        'Đồng bộ hơn 10.000 SKU sang Shopee, TikTok, Lazada tức thì',
        'Quản lý biến thể màu sắc, kích thước, combo sản phẩm linh hoạt',
        'Tự động chuẩn hóa thuộc tính danh mục theo chuẩn từng sàn',
        'Điều chỉnh giá bán theo chiến dịch riêng cho từng kênh',
      ],
      metrics: [
        { label: 'Tiết kiệm thời gian đăng hàng', value: '95%' },
        { label: 'Tốc độ đồng bộ SKU', value: '< 1 giây' },
      ],
    },
    {
      id: 'oms',
      title: 'OMS - Xử lý đơn hàng tự động',
      subtitle: 'Tự động gom đơn đa kênh, điều hướng giao hàng & xử lý đổi trả',
      badge: 'Order Management System',
      iconName: 'ShoppingBag',
      description: 'Tổng hợp toàn bộ đơn hàng từ tất cả các gian hàng trực tuyến và cửa hàng vật lý về một giao diện tập trung. Tự động kiểm tra tồn kho WMS và gán đơn vị vận chuyển tối ưu chi phí.',
      color: 'from-amber-500 to-orange-500',
      features: [
        'Xử lý hàng ngàn đơn hàng cùng lúc không lo sót hay nhầm lẫn',
        'Tự động tách đơn hoặc gộp đơn theo vị trí kho gần khách nhất',
        'Đồng bộ trạng thái vận chuyển từ GHTK, GHN, Viettel Post, Shopee Xpress',
        'Quản lý hoàn hàng và hủy đơn tự động cộng trả kho WMS',
      ],
      metrics: [
        { label: 'Tỷ lệ sai sót đơn hàng', value: '0.01%' },
        { label: 'Tốc độ gom đơn', value: 'Tức thì' },
      ],
    },
    {
      id: 'wms',
      title: 'WMS - Quản lý kho hàng thông minh',
      subtitle: 'Kiểm soát tồn kho chính xác theo lô hạn dùng, vị trí kệ & quét mã vạch',
      badge: 'Warehouse Management System',
      iconName: 'Boxes',
      description: 'WMS chuyên sâu đáp ứng từ kho bán lẻ tới kho thương mại điện tử quy mô lớn. Ứng dụng quét mã vạch trên điện thoại giúp nhân viên nhặt hàng và đóng gói nhanh gấp 3 lần.',
      color: 'from-purple-500 to-indigo-500',
      features: [
        'Quản lý kho đa điểm, kho ký gửi và kho chi nhánh bán lẻ',
        'Quy trình nhặt hàng thông minh giảm quãng đường di chuyển',
        'Cảnh báo tồn kho tối thiểu & cảnh báo hạn sử dụng (FEFO/FIFO)',
        'Ứng dụng quét mã vạch trên thiết bị di động cho nhân viên kho',
      ],
      metrics: [
        { label: 'Chính xác tồn kho', value: '99.98%' },
        { label: 'Tăng tốc độ nhặt hàng', value: '300%' },
      ],
    },
    {
      id: 'tax',
      title: 'Hóa đơn điện tử & thuế tự động',
      subtitle: 'Kết nối trực tiếp cổng Tổng cục Thuế theo Thông tư 78 & Nghị định 123',
      badge: 'Automated Tax & E-Invoice Engine',
      iconName: 'Receipt',
      description: 'Giải pháp tự động phát hành hóa đơn điện tử máy tính tiền ngay khi đơn hàng hoàn tất. Tự động trích xuất bảng kê khai thuế GTGT, TNCN cho hộ kinh doanh & doanh nghiệp.',
      color: 'from-emerald-400 to-teal-500',
      features: [
        'Phát hành hóa đơn điện tử máy tính tiền có mã Cơ quan Thuế ngay tại POS và sàn TMĐT',
        'Tự động gửi file XML và mã tra cứu hóa đơn trực tiếp tới e-mail/Zalo của khách hàng',
        'Tự động lập tờ khai thuế GTGT & TNCN theo Thông tư 88 cho hộ kinh doanh',
        'Kết nối sẵn với VNPT, Viettel Invoice, MInvoice, EasyInvoice, BKAV',
      ],
      metrics: [
        { label: 'Tuân thủ quy định thuế', value: '100%' },
        { label: 'Rủi ro vi phạm thuế', value: '0%' },
      ],
    },
    {
      id: 'crm',
      title: 'CRM đa kênh & chăm sóc khách hàng Zalo OA',
      subtitle: 'Hợp nhất chân dung khách hàng, tích điểm & gửi tin nhắn tự động',
      badge: 'Customer Relationship Management',
      iconName: 'Users',
      description: 'Hợp nhất lịch sử mua sắm của khách hàng từ Shopee, TikTok Shop, Website đến cửa hàng vật lý. Tự động phân nhóm khách hàng và gửi thông điệp cá nhân hóa qua Zalo ZNS / SMS.',
      color: 'from-pink-500 to-rose-500',
      features: [
        'Quản lý 360° thông tin & lịch sử đơn hàng của từng khách hàng',
        'Phân nhóm khách hàng thông minh (Mới, Trung thành, Cần chăm sóc)',
        'Gửi tin nhắn Zalo ZNS tự động thông báo đơn hàng & mã giảm giá',
        'Hệ thống tích điểm thành viên liên kênh',
      ],
      metrics: [
        { label: 'Tăng tỷ lệ mua lại', value: '+35%' },
        { label: 'Chi phí chăm sóc', value: '-60%' },
      ],
    },
  ];

  const currentModule = modules.find((m) => m.id === activeTab) || modules[0];

  return (
    <section id="modules" className="py-20 md:py-28 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-medium mb-4">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>Hệ thống 5 trụ cột hợp nhất</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-100 tracking-tight">
            Hệ sinh thái <span className="text-gradient-emerald">quản trị VOMA</span>
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg">
            Không cần cài đặt nhiều phần mềm rời rạc. VOMA tích hợp trọn bộ PIM, OMS, WMS, hóa đơn điện tử và CRM trên một nền tảng duy nhất.
          </p>
        </div>

        {/* Tab Navigation Pill Buttons */}
        <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {modules.map((mod) => {
            const isActive = mod.id === activeTab;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveTab(mod.id)}
                className={`px-5 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all duration-300 flex items-center gap-2 border ${
                  isActive
                    ? 'bg-slate-900 border-emerald-500 text-emerald-400 shadow-md'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span>{mod.title.split(' - ')[0]}</span>
                {isActive && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
              </button>
            );
          })}
        </div>

        {/* Module Content Display Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Description & Features */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono font-medium">
                <span>{currentModule.badge}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-slate-100">
                {currentModule.title}
              </h3>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {currentModule.description}
              </p>

              {/* Feature Checklist */}
              <div className="space-y-3 pt-2">
                {currentModule.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-400 mt-0.5 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-slate-200 font-medium">{feat}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <button
                  onClick={onOpenConsultation}
                  className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <span>Tư vấn module {currentModule.title.split(' - ')[0]}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column: Visual Dashboard Mockup Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative">
                {/* Header of Mockup */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">VOMA System Monitor</div>
                      <div className="text-[10px] text-emerald-400 font-mono">Đồng bộ thời gian thực</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono bg-slate-900 px-2.5 py-1 rounded text-slate-400">
                    Trạng thái: Hoạt động
                  </span>
                </div>

                {/* Metrics Highlights Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {currentModule.metrics.map((met, idx) => (
                    <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-emerald-400 font-mono">{met.value}</div>
                      <div className="text-xs text-slate-400 mt-1">{met.label}</div>
                    </div>
                  ))}
                </div>

                {/* Interactive Simulated Code / Workflow Output */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-2">
                  <div className="text-slate-500">// Hệ thống tự động VOMA</div>
                  <div className="text-emerald-400">&gt; SKU_Sync: 10,240 SKU đã cập nhật</div>
                  <div className="text-slate-300">&gt; OMS_Order: Đơn hàng Shopee #SHP-98124 đã xử lý</div>
                  <div className="text-blue-400">&gt; WMS_Deduct: Kho #A-14 đã trừ tồn</div>
                  <div className="text-emerald-300">&gt; Tax_Invoice: Đã phát hành hóa đơn XML TCT</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
