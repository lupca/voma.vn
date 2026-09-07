import { useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Layers3,
  Menu,
  Package,
  Play,
  ShoppingBag,
  Warehouse,
  ReceiptText,
  X,
  MoveUpRight,
  Phone,
  Mail,
} from "lucide-react";

const modules = [
  {
    name: "Đơn hàng",
    icon: ShoppingBag,
    title: "Mỗi đơn hàng, một bức tranh đầy đủ.",
    description:
      "Theo dõi kênh bán, thanh toán và tiến độ kho ngay trong danh sách đơn. Mở chi tiết để biết bước tiếp theo cần làm.",
    points: [
      "Lọc theo kênh và trạng thái xử lý",
      "Xem thông tin đơn và tiến độ kho",
      "Tra cứu khách hàng, giá trị và thanh toán",
    ],
    image: "orders.png",
    label: "Danh sách đơn hàng và bảng chi tiết",
  },
  {
    name: "Sản phẩm",
    icon: Package,
    title: "Danh mục rõ ràng. Sẵn sàng để bán.",
    description:
      "Quản lý sản phẩm, phân loại và thuộc tính tại một nơi. Nhận biết dữ liệu còn thiếu trước khi đưa sản phẩm lên kênh bán.",
    points: [
      "Quản lý SKU và các biến thể",
      "Theo dõi mức độ đầy đủ của dữ liệu",
      "Tra cứu giá bán và tồn kho sản phẩm",
    ],
    image: "catalog.png",
    label: "Danh mục sản phẩm và thuộc tính",
  },
  {
    name: "Kho hàng",
    icon: Warehouse,
    title: "Biết hàng ở đâu. Biết việc đang chờ.",
    description:
      "Theo dõi hàng thực có, hàng đang giữ và giao dịch kho. Đội vận hành có điểm bắt đầu rõ ràng cho từng ca làm việc.",
    points: [
      "Tổng quan nhiều kho và vị trí lưu trữ",
      "Theo dõi phiếu nhập và phiếu xuất",
      "Tra cứu biến động tồn kho",
    ],
    image: "workspaces-warehouse.png",
    label: "Bảng điều khiển kho vận",
  },
  {
    name: "Hoá đơn",
    icon: ReceiptText,
    title: "Theo dõi hoá đơn đến từng trạng thái.",
    description:
      "Tra cứu hoá đơn theo đơn hàng, theo dõi phản hồi và nhận biết hồ sơ cần xử lý để thuận tiện đối soát.",
    points: [
      "Danh sách hoá đơn và đơn hàng liên quan",
      "Theo dõi trạng thái gửi và phản hồi",
      "Xem dòng hàng và thông tin thanh toán",
    ],
    image: "invoices.png",
    label: "Danh sách và chi tiết hoá đơn",
  },
];
const faqs = [
  [
    "VOMA phù hợp với doanh nghiệp nào?",
    "VOMA tập trung vào doanh nghiệp bán hàng cần quản lý sản phẩm, đơn hàng, nhiều kho và hoá đơn trong cùng một không gian làm việc. Buổi demo giúp đối chiếu các nghiệp vụ này với cách doanh nghiệp của bạn đang vận hành.",
  ],
  [
    "Tôi có thể xem sản phẩm trước khi trao đổi không?",
    "Có. Bạn có thể xem ảnh giao diện, chuyển giữa bốn phân hệ và xem video ngay trên trang này. Ảnh và video giới thiệu trực tiếp các màn hình làm việc của VOMA.",
  ],
  [
    "VOMA kết nối được những kênh bán nào?",
    "VOMA hỗ trợ quản lý đơn hàng từ Shopee, TikTok Shop, Lazada và website bán hàng. Đội ngũ sẽ tư vấn cấu hình kết nối phù hợp với các gian hàng bạn đang vận hành.",
  ],
  [
    "Chi phí và thời gian triển khai được tính thế nào?",
    "Phạm vi triển khai được xác định theo số gian hàng, số kho, khối lượng đơn, phân hệ và nhu cầu tích hợp. Hãy trao đổi để nhận đề xuất phạm vi, chi phí và tiến độ phù hợp.",
  ],
  [
    "Doanh nghiệp có nhiều kho sử dụng VOMA thế nào?",
    "VOMA có không gian quản lý nhiều kho, vị trí lưu trữ, phiếu nhập, phiếu xuất và giao dịch kho. Bạn có thể xem tổng quan và tra cứu dữ liệu chi tiết theo nhu cầu công việc.",
  ],
];

function Logo() {
  return (
    <img
      className="brand-logo"
      src="/brand/logo-full.svg"
      width="416"
      height="306"
      alt="VOMA"
    />
  );
}
function CTA({
  children = "Đặt lịch demo",
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <a className={`button primary ${className}`} href="#lien-he">
      {children}
      <ArrowUpRight size={17} />
    </a>
  );
}

export default function App() {
  const [active, setActive] = useState(0);
  const [menu, setMenu] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playTour = () => {
    videoRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "center",
    });
    videoRef.current?.play().catch(() => {});
  };
  return (
    <>
      <a className="skip-link" href="#main">
        Đến nội dung chính
      </a>
      <header className="header">
        <div className="container nav">
          <a href="#" aria-label="VOMA — Trang chủ">
            <Logo />
          </a>
          <nav
            className={menu ? "nav-links open" : "nav-links"}
            aria-label="Điều hướng chính"
          >
            <a href="#san-pham" onClick={() => setMenu(false)}>
              Sản phẩm
            </a>
            <a href="#giai-phap" onClick={() => setMenu(false)}>
              Giải pháp
            </a>
            <a href="#trien-khai" onClick={() => setMenu(false)}>
              Triển khai
            </a>
            <a href="#ve-voma" onClick={() => setMenu(false)}>
              Về VOMA
            </a>
          </nav>
          <div className="nav-actions">
            <a className="login" href="https://app.voma.vn">
              Đăng nhập
              <ArrowUpRight size={14} />
            </a>
            <CTA />
            <button
              className="menu-toggle"
              aria-label={menu ? "Đóng menu" : "Mở menu"}
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      <main id="main">
        <section className="hero container">
          <div className="eyebrow">
            <span /> NỀN TẢNG QUẢN TRỊ BÁN HÀNG ĐA KÊNH
          </div>
          <div className="hero-heading">
            <h1>
              Nắm rõ từng đơn hàng.
              <br />
              <span>Chủ động cả vận hành.</span>
            </h1>
            <div className="hero-aside">
              <p>
                Kết nối sản phẩm, đơn hàng, kho và hoá đơn trong một không gian
                làm việc. Để đội ngũ phối hợp rõ ràng, doanh nghiệp vững bước mở
                rộng.
              </p>
              <div className="button-row">
                <CTA />
                <button className="text-button" onClick={playTour}>
                  <Play size={16} /> Xem sản phẩm
                </button>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="visual-top">
              <span>
                <span className="live-dot" /> KHÔNG GIAN VẬN HÀNH VOMA
              </span>
              <span>Giao diện sản phẩm VOMA</span>
            </div>
            <div className="hero-screen">
              <img
                src="/media/orders.png"
                width="1440"
                height="1000"
                alt="Giao diện VOMA: danh sách đơn đa kênh và chi tiết thanh toán, giao hàng của một đơn hàng"
                fetchPriority="high"
              />
              <button onClick={playTour} className="play-pill">
                <span>
                  <Play size={18} fill="currentColor" />
                </span>{" "}
                Khám phá VOMA
                <ArrowUpRight size={16} />
              </button>
            </div>
            <div className="visual-bottom">
              <span>
                <Layers3 size={16} /> Một nơi làm việc. Bốn nghiệp vụ kết nối.
              </span>
              <span>01 — 04</span>
            </div>
          </div>
          <div className="brand-strip">
            <p>
              Được phát triển bởi{" "}
              <a href="https://www.nothanagentic.vn/vi">
                Nỏ Thần Agentic <ArrowUpRight size={13} />
              </a>
            </p>
            <div>
              <span>Sản phẩm</span>
              <i />
              <span>Đơn hàng</span>
              <i />
              <span>Kho hàng</span>
              <i />
              <span>Hoá đơn</span>
            </div>
          </div>
        </section>
        <section className="section container" id="giai-phap">
          <div className="section-heading">
            <div>
              <div className="eyebrow">TỪ RỜI RẠC ĐẾN RÕ RÀNG</div>
              <h2>
                Kinh doanh mở rộng.
                <br />
                Vận hành vẫn trong tầm tay.
              </h2>
            </div>
            <p>
              Một đơn hàng đi qua nhiều bộ phận.
              <br />
              Mỗi người cần thấy đúng thông tin để làm tốt phần việc của mình.
            </p>
          </div>
          <div className="benefits">
            {[
              [
                "01",
                "Người quản lý",
                "Nắm được việc cần ưu tiên.",
                "Theo dõi các nhóm đơn và trạng thái xử lý để biết công việc đang nằm ở khâu nào.",
              ],
              [
                "02",
                "Đội bán hàng",
                "Tra cứu đơn nhanh, rõ ngữ cảnh.",
                "Xem khách hàng, kênh bán, thanh toán và tiến độ kho khi cần trả lời về một đơn hàng.",
              ],
              [
                "03",
                "Đội kho & kế toán",
                "Phối hợp trên dữ liệu có liên kết.",
                "Tra cứu phiếu kho, hoá đơn và giao dịch liên quan để đối chiếu công việc giữa các bộ phận.",
              ],
            ].map(([n, role, title, text]) => (
              <article key={n}>
                <div className="benefit-meta">
                  <span>{n}</span>
                  <span>{role}</span>
                  <MoveUpRight size={18} />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="product-section" id="san-pham">
          <div className="container section">
            <div className="section-heading">
              <div>
                <div className="eyebrow">KHÁM PHÁ SẢN PHẨM</div>
                <h2>
                  Chi tiết từng nghiệp vụ.
                  <br />
                  Liền mạch cả quy trình.
                </h2>
              </div>
              <p>
                Xem trực tiếp những màn hình đội ngũ của bạn sẽ sử dụng mỗi
                ngày.
              </p>
            </div>
            <div className="module-tabs" aria-label="Chọn phân hệ">
              {modules.map((item, i) => (
                <button
                  key={item.name}
                  aria-pressed={active === i}
                  aria-controls={`module-panel-${i}`}
                  onClick={() => setActive(i)}
                >
                  <item.icon size={19} />
                  {item.name}
                  <span>0{i + 1}</span>
                </button>
              ))}
            </div>
            {modules.map((m, i) => (
              <div
                key={m.name}
                className="module-panel"
                id={`module-panel-${i}`}
                hidden={active !== i}
              >
                <div className="module-copy">
                  <span className="small-label">
                    VOMA / {m.name.toLocaleUpperCase("vi")}
                  </span>
                  <h3>{m.title}</h3>
                  <p>{m.description}</p>
                  <ul>
                    {m.points.map((p) => (
                      <li key={p}>
                        <Check size={16} />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <a href="#lien-he" className="inline-link">
                    Trao đổi về nghiệp vụ này <ArrowRight size={17} />
                  </a>
                </div>
                <figure>
                  <a
                    href={`/media/${m.image}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Mở ảnh đầy đủ: ${m.label}`}
                  >
                    <img
                      key={m.image}
                      src={`/media/${m.image}`}
                      width="1440"
                      height="1000"
                      alt={`${m.label} — giao diện sản phẩm VOMA`}
                      loading="lazy"
                    />
                  </a>
                  <figcaption>
                    {m.label} · VOMA <ArrowUpRight size={14} />
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </section>
        <section className="section container tour-section" id="demo">
          <div className="tour-copy">
            <div className="eyebrow">MỘT VÒNG KHÁM PHÁ VOMA</div>
            <h2>
              Nhìn cách VOMA
              <br />
              làm việc.
            </h2>
            <p>
              Từ danh sách đơn đến sản phẩm, kho và hoá đơn. Một vòng tham quan
              ngắn qua giao diện thực tế.
            </p>
            <p className="small-print">
              Xem giao diện sản phẩm. Trao đổi trực tiếp để được demo theo quy
              trình của doanh nghiệp bạn.
            </p>
            <a className="inline-link" href="#lien-he">
              Muốn xem theo bài toán của bạn? <ArrowRight size={17} />
            </a>
          </div>
          <figure className="video-frame">
            <video
              ref={videoRef}
              controls
              playsInline
              preload="none"
              poster="/media/orders.png"
              aria-label="Video tham quan bốn phân hệ VOMA"
            >
              <source src="/media/product-tour.webm" type="video/webm" />
              <track
                kind="captions"
                src="/media/product-tour.vi.vtt"
                srcLang="vi"
                label="Tiếng Việt"
                default
              />
            </video>
            <figcaption>
              VOMA PRODUCT TOUR <span>Giao diện sản phẩm VOMA</span>
            </figcaption>
          </figure>
        </section>
        <section className="deployment" id="trien-khai">
          <div className="container section">
            <div className="section-heading">
              <div>
                <div className="eyebrow">BẮT ĐẦU CÓ ĐỊNH HƯỚNG</div>
                <h2>
                  Triển khai theo cách
                  <br />
                  doanh nghiệp bạn vận hành.
                </h2>
              </div>
              <p>
                Phạm vi, chi phí và tiến độ cần xuất phát từ quy trình bạn đang
                vận hành.
              </p>
            </div>
            <div className="steps">
              {[
                [
                  "01",
                  "Trao đổi bài toán",
                  "Cùng làm rõ kênh bán, số kho, khối lượng đơn và điểm nghẽn hiện tại.",
                ],
                [
                  "02",
                  "Demo theo nghiệp vụ",
                  "Đối chiếu tính năng, dữ liệu cần chuyển và các kết nối doanh nghiệp cần.",
                ],
                [
                  "03",
                  "Thống nhất triển khai",
                  "Xác định phân hệ, trách nhiệm, chi phí và mốc nghiệm thu trước khi bắt đầu.",
                ],
              ].map(([n, t, d]) => (
                <article key={n}>
                  <span>{n}</span>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </article>
              ))}
            </div>
            <div className="deployment-bottom">
              <p>Trao đổi để nhận đề xuất phạm vi và báo giá.</p>
              <CTA>Trao đổi nhu cầu</CTA>
            </div>
          </div>
        </section>
        <section className="section container about" id="ve-voma">
          <div>
            <div className="eyebrow">ĐỘI NGŨ ĐẰNG SAU SẢN PHẨM</div>
            <h2>
              Công nghệ vững vàng.
              <br />
              Đội ngũ hiểu sản phẩm.
            </h2>
            <p>
              VOMA được phát triển và duy trì bởi đội kỹ thuật riêng thuộc Nỏ
              Thần Agentic — công ty xây dựng giải pháp phần cứng và phần mềm
              cho doanh nghiệp Việt Nam.
            </p>
            <a
              href="https://www.nothanagentic.vn/vi/giai-phap/voma"
              className="inline-link"
            >
              Tìm hiểu về Nỏ Thần Agentic <ArrowUpRight size={17} />
            </a>
          </div>
          <div className="parent-card">
            <span className="small-label">THUỘC HỆ SINH THÁI</span>
            <div className="parent-name">
              NỎ THẦN
              <br />
              <span>AGENTIC</span>
              <ArrowUpRight size={35} />
            </div>
            <div className="parent-rule" />
            <h3>
              Được phát triển và duy trì
              <br />
              bởi đội kỹ thuật riêng.
            </h3>
            <p>
              VOMA là nền tảng quản trị bán hàng đa kênh trong hệ sinh thái Nỏ
              Thần Agentic.
            </p>
          </div>
        </section>
        <section className="section container faq-section" id="hoi-dap">
          <div>
            <div className="eyebrow">TRƯỚC KHI BẮT ĐẦU</div>
            <h2>
              Bạn có thể
              <br />
              đang muốn biết.
            </h2>
            <a className="inline-link" href="https://docs.voma.vn">
              Đọc tài liệu VOMA <ArrowUpRight size={17} />
            </a>
          </div>
          <div className="faqs">
            {faqs.map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <ChevronDown size={18} />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="contact container" id="lien-he">
          <div className="contact-inner">
            <div className="eyebrow">BƯỚC TIẾP THEO</div>
            <h2>
              Cùng gỡ điểm nghẽn
              <br />
              vận hành của bạn.
            </h2>
            <p>
              Trao đổi với đội ngũ về quy trình hiện tại.
              <br />
              Xem VOMA có thể hỗ trợ doanh nghiệp ở những khâu nào.
            </p>
            <div className="button-row">
              <a
                className="button primary"
                href="mailto:contact@nothanagentic.vn?subject=Đăng%20ký%20demo%20VOMA"
              >
                <Mail size={18} /> Liên hệ đặt lịch demo
                <ArrowUpRight size={17} />
              </a>
              <a className="contact-phone" href="tel:0983650552">
                <Phone size={17} />
                0983 650 552
              </a>
            </div>
            <p className="small-print">
              Email mở trong ứng dụng thư của bạn · 9:00–17:00, thứ Hai–thứ Sáu
            </p>
          </div>
          <div className="contact-art" aria-hidden="true">
            <img src="/brand/logo-full.svg" alt="" width="416" height="306" />
          </div>
        </section>
      </main>
      <footer className="container footer">
        <div className="footer-top">
          <div>
            <a href="#" aria-label="VOMA — về đầu trang">
              <Logo />
            </a>
            <p>
              Nền tảng quản trị bán hàng đa kênh.
              <br />
              Được phát triển bởi Nỏ Thần Agentic.
            </p>
          </div>
          <div>
            <span>SẢN PHẨM</span>
            <a href="#san-pham">Khám phá VOMA</a>
            <a href="#demo">Video sản phẩm</a>
            <a href="https://docs.voma.vn">Tài liệu sử dụng</a>
          </div>
          <div>
            <span>DOANH NGHIỆP</span>
            <a href="https://www.nothanagentic.vn/vi">Nỏ Thần Agentic</a>
            <a href="#trien-khai">Tư vấn triển khai</a>
            <a href="mailto:contact@nothanagentic.vn">
              contact@nothanagentic.vn
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 VOMA · Nỏ Thần Agentic</span>
          <span>Hà Nội, Việt Nam</span>
          <a href="#">Về đầu trang ↑</a>
        </div>
      </footer>
    </>
  );
}
