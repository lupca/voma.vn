# Kiểm tra bản mẫu VOMA

Ngày: 07/09/2026. Bản mẫu chạy tại http://localhost:3000 bằng `npm run dev`.

- `npm run lint`: đạt (TypeScript).
- `npm run build`: đạt (Vite production build).
- Desktop 1440 px: không tràn ngang; ảnh hero tải được.
- Mobile 390 px và 375 px: không tràn ngang; nội dung chuyển sang một cột.
- Bốn nút phân hệ: cập nhật đúng ảnh và trạng thái `aria-pressed`.
- Menu mobile: mở được, đóng sau khi chọn liên kết.
- FAQ: mở/đóng bằng phần tử `details`.
- CTA xem sản phẩm: cuộn tới video và phát được.
- Video sau cắt phần chờ đầu: 26,88 giây, `readyState=4`, phụ đề tiếng Việt bật.
- Ảnh bốn phân hệ: tải và giải mã thành công.
- Trang marketing không còn cụm “dữ liệu minh hoạ”, “chưa triển khai” hoặc “lộ trình”.
- Không có lỗi console sau tải lại; favicon đã được thêm.
- Logo SVG sao chép nguyên từ voma-web; SHA-256 trùng file phục vụ tại app.dev.voma.vn/brand/logo-full.svg:
  `2b63ef955f5364c42b57061697c893d332eb77ec3bc7e80dc87059894c19255c`.

Ảnh review:

- [Desktop toàn trang](assets/proposal-desktop.png)
- [Hero desktop](assets/proposal-hero.png)
- [Mobile toàn trang](assets/proposal-mobile.png)

Giới hạn: đã kiểm tra trên Chromium desktop và viewport mobile, chưa thử trên thiết bị iOS/Safari thật. Các CTA liên hệ dùng email/điện thoại; không có backend thu lead mới, không tự gửi thông tin. Chưa deploy production. Không chạy phép thử giao dịch thật trên sàn hoặc cơ quan thuế.
