# Kế hoạch đo lường GA4 cho voma.vn

Tài liệu dành cho đội marketing. Nội dung mô tả đúng những gì đang chạy trong mã nguồn
(`src/analytics.ts`, `src/App.tsx`, `src/main.tsx` tại commit `3d69c6f`). Tài liệu này không mô tả
sự kiện nào chưa được cài đặt như thể đang chạy.

GA4 chỉ được nạp khi biến môi trường `VITE_GA_MEASUREMENT_ID` có giá trị lúc build. Không có ID thì
trang không gửi sự kiện nào; phần giữ UTM (mục 4) vẫn hoạt động.

## 1. Bảng sự kiện

Mọi sự kiện tùy chỉnh đều có tham số `label` cho biết khu vực trên trang. Riêng `generate_lead`
có thêm tham số `method`.

| Sự kiện | Khi nào kích hoạt | Tham số | Ví dụ label |
|---|---|---|---|
| `generate_lead` (method = `email`) | Người dùng bấm một liên kết `mailto:` (bấm chuột trái hoặc chuột giữa) | `method` = `email`, `label` = khu vực chứa liên kết | `Liên hệ` (nút email ở mục Liên hệ), `Footer` (email ở chân trang) |
| `generate_lead` (method = `phone`) | Người dùng bấm một liên kết `tel:` | `method` = `phone`, `label` = khu vực chứa liên kết | `Liên hệ` (số điện thoại ở mục Liên hệ) |
| `sign_up_click` | Người dùng bấm liên kết tới `app.voma.vn` | `label` | `Header` (nút đăng nhập trên thanh đầu trang) |
| `view_docs` | Người dùng bấm liên kết tới `docs.voma.vn` | `label` | `Hỏi đáp` (liên kết trong mục Hỏi đáp), `Footer` (Tài liệu sử dụng ở chân trang) |
| `view_video` | Video sản phẩm bắt đầu phát lần đầu; chỉ gửi **một lần mỗi lượt xem trang** (tua lại hay phát lại không gửi thêm) | `label` = `Video` (cố định) | `Video` |
| `section_view` | Một mục (`<section>` trong `<main>`) hiện ít nhất **20%** trên màn hình; mỗi mục chỉ gửi **một lần mỗi lượt xem trang** | `label` = tên mục | `Hero`, `Giải pháp`, `Sản phẩm`, `Video`, `Triển khai`, `Về VOMA`, `Hỏi đáp`, `Liên hệ` |
| `page_view` | Sự kiện **tự động** của GA4, gửi khi trang tải (không do mã của voma.vn tạo) | Tham số chuẩn của GA4 (page_location, page_title, ...) | — |

### Bảng giá trị `label`

Giá trị lấy từ `SECTION_LABEL` trong `src/analytics.ts`:

| Khu vực trên trang | `label` |
|---|---|
| Thanh đầu trang (`<header>`) | `Header` |
| Banner đầu trang (hero) | `Hero` |
| Mục `#giai-phap` | `Giải pháp` |
| Mục `#san-pham` | `Sản phẩm` |
| Mục `#demo` (video) | `Video` |
| Mục `#trien-khai` | `Triển khai` |
| Mục `#ve-voma` | `Về VOMA` |
| Mục `#hoi-dap` | `Hỏi đáp` |
| Mục `#lien-he` | `Liên hệ` |
| Chân trang (`<footer>`) | `Footer` |
| Liên kết không nằm trong khu vực nào ở trên | `Trang chủ` |

Lưu ý: `Header` và `Footer` chỉ xuất hiện ở sự kiện bấm liên kết. `section_view` chỉ theo dõi các
mục trong `<main>`, nên không có `section_view` với label `Header` hay `Footer`.

## 2. Chưa triển khai (không có dữ liệu)

Các mục sau **chưa chạy** trên voma.vn. Đừng tìm chúng trong báo cáo:

- Sự kiện `view_pricing` — trang chưa có bảng giá.
- Sự kiện `use_calculator` — trang chưa có công cụ tính.
- `generate_lead` với method `zalo` — trang chưa có liên kết Zalo.
- `generate_lead` với method `form` — trang chưa có biểu mẫu liên hệ.

Hiện chỉ có hai giá trị `method`: `email` và `phone`.

## 3. Cài đặt một lần trong GA4

1. **Đánh dấu key event**: Admin > Events (hoặc Admin > Key events), bật "Mark as key event" cho
   `generate_lead`.
2. Làm tương tự cho `sign_up_click`.
3. **Tạo custom dimension cho `method`**: Admin > Custom definitions > Create custom dimension,
   Scope = Event, Event parameter = `method`, tên hiển thị "Lead method".
4. **Tạo custom dimension cho `label`**: tương tự, Scope = Event, Event parameter = `label`,
   tên hiển thị "Label".

Custom dimension chỉ có dữ liệu từ lúc tạo trở đi, không áp dụng ngược cho dữ liệu cũ.

## 4. Quy ước UTM

Dùng chữ thường, không dấu, nối bằng dấu gạch dưới hoặc gạch ngang.

| Tham số | Ý nghĩa | Ví dụ |
|---|---|---|
| `utm_source` | Nguồn gửi traffic | `facebook`, `google`, `zalo_oa`, `newsletter` |
| `utm_medium` | Loại kênh | `cpc`, `paid_social`, `social`, `email`, `referral` |
| `utm_campaign` | Tên chiến dịch | `ra_mat_2026_11`, `webinar_oms_t12` |

Ví dụ URL:

- `https://voma.vn/?utm_source=facebook&utm_medium=paid_social&utm_campaign=ra_mat_2026_11`
- `https://voma.vn/?utm_source=newsletter&utm_medium=email&utm_campaign=webinar_oms_t12`

### UTM được giữ lại và chuyển sang app.voma.vn

- Khi khách vào voma.vn với tham số `utm_*` trên URL, trang lưu toàn bộ `utm_*` vào
  `sessionStorage` với khóa `voma_utm_params`. Dữ liệu còn trong tab đó tới khi đóng tab.
- Nếu URL sau đó không có `utm_*`, trang dùng lại giá trị đã lưu. Nếu URL có `utm_*` mới, giá trị
  mới thay thế giá trị cũ.
- Các liên kết tới `app.voma.vn` được gắn thêm các `utm_*` này, kể cả lúc bấm, để app nhận được
  nguồn chiến dịch.

## 5. Xem báo cáo trong GA4

- **Tổng số sự kiện**: Reports > Engagement > Events. Bấm vào tên sự kiện (ví dụ `generate_lead`)
  để xem số lượng theo thời gian.
- **Hiệu quả theo kênh**: Reports > Acquisition > Traffic acquisition, xem cột **Key events**
  (chọn `generate_lead` hoặc `sign_up_click` trong menu của cột).
- **Phân tích theo method và label**: Explore > Free form. Thêm dimension "Event name",
  "Lead method" (`method`) và "Label" (`label`), metric "Event count". Lọc Event name =
  `generate_lead` để thấy lead email/phone ở từng khu vực.

### Lead theo chiến dịch

Lead theo chiến dịch = **Session campaign × `generate_lead`**:

- Reports > Acquisition > Traffic acquisition, đổi dimension chính sang **Session campaign**,
  cột Key events chọn `generate_lead`; hoặc
- Explore > Free form: hàng = Session campaign, metric = Event count, lọc Event name =
  `generate_lead`.

`Session campaign` lấy từ `utm_campaign` của lượt truy cập, nên đặt tên chiến dịch đúng quy ước
ở mục 4.

## 6. Quyền riêng tư

voma.vn **không gửi** địa chỉ email, số điện thoại hay nội dung biểu mẫu nào lên GA4. Khi khách bấm
liên kết email hoặc điện thoại, chỉ tên sự kiện, `method` (`email`/`phone`) và `label` (khu vực
trên trang) được gửi; địa chỉ email và số điện thoại trong liên kết không bao giờ được gửi đi.
