# Hướng dẫn quản trị GA4 cho chủ sở hữu voma.vn

Tài liệu này dành cho người quản trị Google Analytics 4 (GA4) của website voma.vn. Mục tiêu: bật đo lường trên production, đánh dấu hai sự kiện quan trọng là key event, tạo custom dimension, và kiểm tra dữ liệu đã về đúng.

> **Lưu ý về tên menu:** Tên menu và đường dẫn trong tài liệu này đúng tại thời điểm viết (2026-11-02). Google và Vercel có thể đổi giao diện. Nếu không tìm thấy mục nào, hãy tìm theo từ khóa trong ô tìm kiếm của trang quản trị.

Tham chiếu chính thức của Google: [Key events trong GA4](https://support.google.com/analytics/answer/13128484) và [Dimensions và metrics](https://support.google.com/analytics/answer/14240153).

---

## 1. Website gửi gì lên GA4

Mã đo lường nằm trong `src/analytics.ts`. Khi có `VITE_GA_MEASUREMENT_ID`, website tải gtag.js và gửi các sự kiện sau. Không có sự kiện nào khác do mã này tạo ra.

| Sự kiện | Khi nào được gửi | Tham số | Giá trị của `label` |
|---|---|---|---|
| `generate_lead` | Người dùng bấm link `mailto:` hoặc `tel:` | `method`: `email` (mailto) hoặc `phone` (tel); `label`: tên khu vực trên trang | xem bảng bên dưới |
| `sign_up_click` | Người dùng bấm link tới `app.voma.vn` | `label` | xem bảng bên dưới |
| `view_docs` | Người dùng bấm link tới `docs.voma.vn` | `label` | xem bảng bên dưới |
| `view_video` | Video đầu tiên trên trang bắt đầu phát | `label`, luôn là `Video` | `Video` |
| `section_view` | Một khu vực (section) của trang hiển thị ít nhất 20% trên màn hình, mỗi khu vực chỉ gửi một lần mỗi lần tải trang | `label` | xem bảng bên dưới |

Các giá trị `label` có thể gặp: `Header`, `Hero`, `Giải pháp`, `Sản phẩm`, `Video`, `Triển khai`, `Về VOMA`, `Hỏi đáp`, `Liên hệ`, `Footer`, và `Trang chủ` (khi link nằm ngoài các khu vực trên).

Hai sự kiện quan trọng cần đánh dấu là **`generate_lead`** và **`sign_up_click`**.

---

## 2. Bước 0: Đặt biến môi trường trên Vercel (Production) và redeploy

Biến cần đặt (copy nguyên dòng này):

```
VITE_GA_MEASUREMENT_ID=G-5YGBCGBLVG
```

Vite nhúng giá trị `VITE_GA_MEASUREMENT_ID` vào file JavaScript **tại thời điểm build**. Vì vậy:

- Đặt biến xong **chưa đủ**. Bản đang chạy vẫn là bản build cũ, không có ID.
- Bạn phải **redeploy** để build lại.
- Bản Preview không có biến này sẽ không đo lường gì. Đây là hành vi đúng, vì tài liệu này chỉ đặt cho Production.

**Các bước:**

1. Mở Vercel, chọn project voma.vn.
2. Vào **Settings > Environment Variables**.
3. Thêm biến:
   - **Key:** `VITE_GA_MEASUREMENT_ID`
   - **Value:** `G-5YGBCGBLVG`
   - **Environments:** chỉ tick **Production**. Bỏ tick Preview và Development.
4. Bấm **Save**.
5. Redeploy:
   - Vào **Deployments**.
   - Mở deployment Production mới nhất.
   - Bấm menu **⋯ > Redeploy**, rồi xác nhận.
6. Đợi deployment chuyển sang trạng thái Ready.

`G-5YGBCGBLVG` là mã đo lường công khai, không phải bí mật. Không cần giữ kín nhưng không dán vào chỗ không liên quan.

---

## 3. Đánh dấu key event: `generate_lead` và `sign_up_click`

Đường dẫn: **Admin (biểu tượng bánh răng) > Data display > Events**.

### 3.1. Trường hợp sự kiện đã xuất hiện

1. Mở tab **Recent events** (hoặc dùng ô tìm kiếm để tìm sự kiện).
2. Tìm `generate_lead`, rồi bấm biểu tượng **ngôi sao** bên cạnh sự kiện để đánh dấu key event.
3. Lặp lại bước 2 với `sign_up_click`.

### 3.2. Sự kiện chỉ hiện trong Events sau khi bắn lần đầu

Sự kiện chỉ xuất hiện trong danh sách Events **sau khi nó đã được gửi ít nhất một lần** lên property. Nếu chưa có ai bấm link đó trên production, bạn có hai cách:

**Cách A: Đợi.** Tự bấm một link `mailto:` (ví dụ nút liên hệ) và một link `app.voma.vn` trên trang production. Sau đó đợi tới khoảng một ngày để báo cáo chuẩn cập nhật. Quay lại Events và đánh dấu key event như mục 3.1. Realtime hiện sự kiện sớm hơn (xem mục 5).

**Cách B: Tạo trước.** Dùng khi muốn đánh dấu ngay mà không chờ.

1. Vào **Admin > Data display > Events**, bấm **+ Create event**.
2. Trong hộp thoại Create event, bật công tắc **Mark as key event** trước khi bấm **Create**.
3. Điền tên và điều kiện của sự kiện theo hướng dẫn trong hộp thoại. **Không đặt tên trùng với tên sự kiện nguồn** (`generate_lead`, `sign_up_click`): Google chưa xác nhận cách làm này an toàn. Nếu chưa xác minh được, hãy dùng Cách A và đợi sự kiện xuất hiện.
4. Bấm **Create**.

Tên sự kiện không được chứa ký tự đặc biệt.

Dữ liệu key event trên báo cáo chuẩn có thể mất tới 24 giờ mới hiện đầy đủ.

---

## 4. Custom dimension theo sự kiện: `method` và `label`

Mục đích: đưa tham số `method` và `label` của sự kiện thành chiều dữ liệu để lọc báo cáo.

Đường dẫn: **Admin > Data display > Custom definitions**.

### 4.1. Tạo dimension `method`

1. Bấm **Create custom dimension**.
2. Điền:
   - **Dimension name:** `Method`
   - **Description:** (tùy ý) `Cách liên hệ trong generate_lead: email hoặc phone`
   - **Scope:** **Event**
   - **Event parameter:** `method`
3. Lưu.

### 4.2. Tạo dimension `label`

1. Bấm **Create custom dimension** lần nữa.
2. Điền:
   - **Dimension name:** `Label`
   - **Description:** (tùy ý) `Khu vực trên trang nơi sự kiện xảy ra`
   - **Scope:** **Event**
   - **Event parameter:** `label`
3. Lưu.

Tên tham số phải viết đúng như trong code (`method`, `label`, chữ thường). Sai tên thì dimension sẽ hiện `(not set)`. Sau khi lưu, không sửa được scope hoặc tên tham số, phải tạo dimension mới.

**Dữ liệu chỉ có sau 24-48 giờ.** Custom dimension chỉ áp dụng cho dữ liệu gửi sau khi đã tạo. Dữ liệu cũ không tự hiện. Sau 24-48 giờ mới xem được `Method` và `Label` trong báo cáo.

---

## 5. Kiểm tra bằng Realtime

Dùng để xác nhận website đang gửi sự kiện.

1. Vào **Reports > Realtime**.
2. Mở `https://voma.vn` trong một cửa sổ ẩn danh (để không bị chặn bởi trình chặn quảng cáo của bạn).
3. Bấm link `mailto:` hoặc `tel:` (ví dụ nút liên hệ). Quay lại Realtime.
4. Tìm sự kiện **`generate_lead`** trong danh sách sự kiện. Mở sự kiện đó để xem tham số `method`. Giá trị đúng là `email` hoặc `phone`.
5. Bấm link `app.voma.vn`. Tìm **`sign_up_click`**.
6. Bấm link `docs.voma.vn` để kiểm tra `view_docs`.

Realtime không cần chờ 24-48 giờ, nhưng báo cáo Realtime không hiện custom dimension đã đăng ký. Muốn kiểm tra tham số đã được gửi đúng hay chưa, dùng DebugView (mục 6).

---

## 6. Kiểm tra bằng DebugView

DebugView cho thấy từng sự kiện kèm tham số, gần như ngay lập tức.

### 6.1. Bật debug mode

Mã trong `src/analytics.ts` **không tự bật debug mode**. Không có tham số URL nào như `?debug_mode=1` bật được DebugView cho website này. Cách làm:

**Cách khuyên dùng: tiện ích Google Analytics Debugger** (Chrome).

1. Cài tiện ích **Google Analytics Debugger** từ Chrome Web Store.
2. Bật tiện ích (biểu tượng trên thanh công cụ, chuyển sang trạng thái ON).
3. Mở lại `https://voma.vn`.

**Cách thay thế: Tag Assistant.** Mở Tag Assistant (tagassistant.google.com), nhập `https://voma.vn`, rồi bấm **Continue**. Cách này bật debug mode cho phiên đó.

### 6.2. Xem sự kiện trong DebugView

1. Vào **Admin > Data display > DebugView**.
2. Chọn thiết bị của bạn trong danh sách nếu có nhiều thiết bị.
3. Trên trang voma.vn, bấm link `mailto:` hoặc `tel:`.
4. Trong DebugView, tìm **`generate_lead`**. Mở sự kiện và kiểm tra:
   - `method` = `email` (mailto) hoặc `phone` (tel).
   - `label` = tên khu vực (ví dụ `Hero` hoặc `Liên hệ`).
5. Bấm link `app.voma.vn`. Kiểm tra `sign_up_click` có `label`.
6. Cuộn tới các khu vực khác. Mỗi khu vực hiện `section_view` một lần với `label` tương ứng.

Nếu tham số không có mặt trong DebugView, dimension trong báo cáo chuẩn cũng sẽ không có. Nếu tham số có mặt trong DebugView nhưng báo cáo chuẩn chưa thấy, đó thường là độ trễ 24-48 giờ (mục 4).

---

## 7. Xử lý sự cố

- **Không thấy sự kiện nào trong Realtime:** kiểm tra Vercel đã redeploy Production sau khi đặt biến (mục 2). Mở DevTools, tab Network, tìm request tới `googletagmanager.com/gtag/js?id=G-5YGBCGBLVG`. Không có request thì bản đang chạy chưa có ID.
- **Preview không đo lường:** đúng như thiết kế, vì biến chỉ đặt cho Production.
- **Chặn bởi trình chặn quảng cáo:** thử cửa sổ ẩn danh không có tiện ích, hoặc tắt tiện ích chặn.
- **Dimension hiện `(not set)`:** kiểm tra tên tham số (`method`, `label`) và scope **Event**. Nếu đã đúng, chờ 24-48 giờ.
- **Key event không bật được:** kiểm tra quyền của tài khoản trong property. Cần quyền chỉnh sửa (Editor trở lên).
- **Sau khi đổi biến, không thấy thay đổi:** phải redeploy. Vite chỉ lấy biến khi build.
