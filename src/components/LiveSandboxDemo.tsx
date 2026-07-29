import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Play, 
  CheckCircle2, 
  QrCode, 
  ShieldCheck, 
  RefreshCw, 
  Receipt, 
  Building, 
  ShoppingBag, 
  Layers, 
  Boxes,
  FileCode,
  Download,
  FileCheck2
} from 'lucide-react';
import { OrderSimulationItem } from '../types';

export const LiveSandboxDemo: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [currentOrder, setCurrentOrder] = useState<OrderSimulationItem>({
    id: 'VOMA-2026-98124',
    customerName: 'Nguyễn Văn An (Hà Nội)',
    channel: 'TikTok Shop',
    productName: 'Áo sơ mi nam Premium VOMA-X',
    sku: 'SKU-NAM-X01',
    amount: 350000,
    taxAmount: 5250, // 1.5% for HKD
    status: 'Received',
    timestamp: new Date().toLocaleTimeString('vi-VN'),
  });

  const channels: Array<OrderSimulationItem['channel']> = [
    'TikTok Shop',
    'Shopee',
    'Lazada',
    'POS Retail',
    'Zalo MiniApp',
  ];

  const triggerSimulation = () => {
    setIsRunning(true);
    setActiveStep(1);

    // Random new order data
    const randomChannel = channels[Math.floor(Math.random() * channels.length)];
    const randomId = `VOMA-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    setCurrentOrder((prev) => ({
      ...prev,
      id: randomId,
      channel: randomChannel,
      status: 'Received',
      invoiceCode: undefined,
      timestamp: new Date().toLocaleTimeString('vi-VN'),
    }));

    // Step 1 -> 2: PIM
    setTimeout(() => {
      setActiveStep(2);
      setCurrentOrder((prev) => ({ ...prev, status: 'PIM_Matched' }));
    }, 800);

    // Step 2 -> 3: OMS & WMS
    setTimeout(() => {
      setActiveStep(3);
      setCurrentOrder((prev) => ({ ...prev, status: 'WMS_Deducted' }));
    }, 1600);

    // Step 3 -> 4: Invoice TCT
    setTimeout(() => {
      setActiveStep(4);
      const invoiceHash = `TCT-HDDT-${Math.floor(10000000 + Math.random() * 90000000)}`;
      setCurrentOrder((prev) => ({
        ...prev,
        status: 'Invoice_Issued_TCT',
        invoiceCode: invoiceHash,
      }));
      setIsRunning(false);

      // Celebrate with subtle confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10B981', '#34D399', '#059669'],
      });
    }, 2400);
  };

  return (
    <section id="tax-engine" className="py-20 md:py-28 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-medium mb-4">
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
            <span>Mô phỏng quy trình tự động</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-100 tracking-tight">
            Thử nghiệm <span className="text-gradient-emerald">xuất hóa đơn tự động</span>
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg">
            Nhấn nút bên dưới để xem VOMA nhận đơn đa kênh, đồng bộ PIM, trừ tồn kho WMS và tự động tạo hóa đơn điện tử có mã của cơ quan Thuế.
          </p>
        </div>

        {/* Live Interactive Sandbox Workspace */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <h3 className="text-lg font-bold text-slate-100">Môi trường thử nghiệm VOMA Sandbox</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Kết nối giả lập API Tổng cục Thuế và sàn Shopee, TikTok Shop, Lazada
              </p>
            </div>

            <button
              onClick={triggerSimulation}
              disabled={isRunning}
              className={`px-6 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg ${
                isRunning
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang tự động xử lý...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Tạo đơn hàng & xuất hóa đơn</span>
                </>
              )}
            </button>
          </div>

          {/* Workflow Stepper Visualizer */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-8">
            <div
              className={`p-4 rounded-2xl border transition-all ${
                activeStep >= 1
                  ? 'bg-slate-950 border-emerald-500 text-emerald-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500'
              }`}
            >
              <div className="text-[10px] font-mono font-bold uppercase mb-1">Bước 1</div>
              <div className="flex items-center gap-2 font-bold text-sm text-slate-100">
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                <span>Nhận đơn {currentOrder.channel}</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">Mã đơn: {currentOrder.id}</div>
            </div>

            <div
              className={`p-4 rounded-2xl border transition-all ${
                activeStep >= 2
                  ? 'bg-slate-950 border-emerald-500 text-emerald-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500'
              }`}
            >
              <div className="text-[10px] font-mono font-bold uppercase mb-1">Bước 2</div>
              <div className="flex items-center gap-2 font-bold text-sm text-slate-100">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Đồng bộ PIM</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">SKU: {currentOrder.sku}</div>
            </div>

            <div
              className={`p-4 rounded-2xl border transition-all ${
                activeStep >= 3
                  ? 'bg-slate-950 border-emerald-500 text-emerald-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500'
              }`}
            >
              <div className="text-[10px] font-mono font-bold uppercase mb-1">Bước 3</div>
              <div className="flex items-center gap-2 font-bold text-sm text-slate-100">
                <Boxes className="w-4 h-4 text-emerald-400" />
                <span>Trừ tồn kho WMS</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">Kho: Hà Nội Branch</div>
            </div>

            <div
              className={`p-4 rounded-2xl border transition-all ${
                activeStep >= 4
                  ? 'bg-slate-950 border-emerald-400 text-emerald-300 shadow-lg'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500'
              }`}
            >
              <div className="text-[10px] font-mono font-bold uppercase mb-1">Bước 4</div>
              <div className="flex items-center gap-2 font-bold text-sm text-slate-100">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Xuất hóa đơn TCT</span>
              </div>
              <div className="text-xs text-emerald-400 font-mono mt-1">
                {currentOrder.invoiceCode ? 'Đã xác thực XML' : 'Đang chờ...'}
              </div>
            </div>
          </div>

          {/* Generated E-Invoice Preview Modal Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Receipt className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-100">
                    Hóa đơn điện tử máy tính tiền
                  </h4>
                  <div className="text-xs text-slate-400 font-mono">
                    Mẫu số: 1/001 | Ký hiệu: C26TVM | Chuẩn Thông tư 78/2021/TT-BTC
                  </div>
                </div>
              </div>

              {currentOrder.invoiceCode && (
                <div className="flex items-center gap-2 bg-slate-900 text-emerald-400 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-bold font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Đã cấp mã Cơ quan Thuế</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
              <div className="space-y-2">
                <div><span className="text-slate-500">Đơn vị bán hàng:</span> <strong className="text-slate-200">HỘ KINH DOANH VOMA STORE</strong></div>
                <div><span className="text-slate-500">Mã số thuế (MST):</span> <strong className="font-mono text-slate-200">0109888999-001</strong></div>
                <div><span className="text-slate-500">Khách mua hàng:</span> <strong className="text-slate-200">{currentOrder.customerName}</strong></div>
                <div><span className="text-slate-500">Kênh bán:</span> <strong className="text-emerald-400">{currentOrder.channel}</strong></div>
              </div>

              <div className="space-y-2">
                <div><span className="text-slate-500">Mã đơn hàng:</span> <strong className="font-mono text-slate-200">{currentOrder.id}</strong></div>
                <div><span className="text-slate-500">Sản phẩm:</span> <strong className="text-slate-200">{currentOrder.productName}</strong></div>
                <div><span className="text-slate-500">Tổng tiền:</span> <strong className="text-emerald-400 font-bold font-mono text-sm">{currentOrder.amount.toLocaleString('vi-VN')} VNĐ</strong></div>
                <div><span className="text-slate-500">Mã CQT cấp:</span> <strong className="text-emerald-400 font-mono">{currentOrder.invoiceCode || 'Đang tạo mã XML...'}</strong></div>
              </div>
            </div>

            {/* Bottom XML Signature Bar */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <span>Chữ ký số XML: SHA-256 Validated | Tổng cục Thuế Protocol v2.1</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Quét mã QR tra cứu:</span>
                <div className="p-1.5 bg-slate-100 rounded-lg text-slate-950">
                  <QrCode className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
