# Bản phát hành trang chủ VOMA — 07/09/2026

## Typography

Giữ Be Vietnam Pro; giảm tải Google Fonts còn 400/500/600/700, bỏ font Plus Jakarta Sans không dùng. Nội dung chính 16 px, giới thiệu desktop 18 px, CTA 15 px, chữ phụ 13–14 px. Một số nhãn ngắn trang trí trên mobile 11–12 px; không áp dụng cho nội dung bán hàng.

Đã đo computed CSS từ trang chính thức của đối thủ trên desktop:

| Trang                                                      | Font                                 | Nội dung quan sát                              |
| ---------------------------------------------------------- | ------------------------------------ | ---------------------------------------------- |
| [Haravan Omnichannel](https://www.haravan.com/omnichannel) | Inter; Inter-SemiBold cho heading    | Paragraph tính năng 18 px, FAQ 16 px; H1 56 px |
| [Sapo Omnichannel](https://www.sapo.vn/omnichannel.html)   | Roboto                               | Paragraph tính năng 14 px; H1 40 px            |
| [Cin7](https://www.cin7.com/)                              | Inter cho nội dung; Lora cho heading | Paragraph 16 px; H1 54 px                      |

Đây là các mẫu đo ở những vị trí cụ thể, không khẳng định mọi chữ trên website đối thủ có cùng cỡ.

## SEO và build

- Dựng HTML tại thời điểm build bằng React server rendering; hydrate khi tải JavaScript.
- Cả bốn phân hệ nằm trong HTML, tab chỉ điều khiển phần hiển thị.
- Title, description tiếng Việt, canonical `https://www.voma.vn/`.
- Open Graph / Twitter metadata, ảnh 1200×630 tại `/media/og-voma.png`.
- Structured data Organization, WebSite và SoftwareApplication; không tạo đánh giá, giá hay số khách hàng giả.
- `robots.txt` và `sitemap.xml` cho URL canonical.
- Giữ ảnh lazy bên dưới hero, video chỉ tải khi cần, font dùng display=swap.
- Vercel cấu hình static output, không rewrite URL lạ về homepage; tránh soft 404.
- Build tự kiểm tra nội dung HTML, metadata, JSON-LD và tài sản SEO bằng `scripts/check-seo.mjs`.

Cách dựng HTML dựa trên [hướng dẫn JavaScript SEO của Google](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics). Điều này giúp crawler đọc nội dung mà không phải chờ JavaScript; không bảo đảm thứ hạng hoặc thời gian lập chỉ mục.

## Kiểm tra trước đăng

TypeScript và production build đạt. Bản production local hydrate không lỗi console; tab hoá đơn, menu mobile, FAQ và phát video đã kiểm tra. Không tràn ngang ở 320, 375, 390, 768, 1024 và 1440 px. Video 26,88 giây với phụ đề tiếng Việt.

## Triển khai

Repository `lupca/voma.vn`, nhánh `main`, tích hợp GitHub → Vercel đã tồn tại. Build mới dùng `npm ci` và `npm run build`, output `dist`. Bản cũ trước thay đổi: `e9684dd5b8ece11b458131e5dd3f6c91ae65bcd7`.

Liên hệ giữ email/điện thoại hiện có. Không thêm cơ chế tự gửi email hay biểu mẫu báo thành công giả. Chưa kết nối Search Console hoặc analytics vì chưa có thông tin tài khoản/property cho website.
