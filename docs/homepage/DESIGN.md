# VOMA — Thiết kế trang chủ phục vụ marketing và bán hàng

Ngày khảo sát: 07/09/2026. Bản thiết kế đi kèm giao diện React trong `src/App.tsx`, CSS trong `src/index.css` và tư liệu sản phẩm trong `public/media/`.

## 1. Quyết định thiết kế

**Định vị: VOMA là nền tảng quản trị bán hàng đa kênh, giúp doanh nghiệp quản lý sản phẩm, đơn hàng, kho và hoá đơn trong cùng một không gian làm việc.**

**Thông điệp chính: “Nắm rõ từng đơn hàng. Chủ động cả vận hành.”**

Trang chủ phục vụ người mua phần mềm: chủ doanh nghiệp, quản lý vận hành, người phụ trách bán hàng, kho và kế toán. Mục tiêu chuyển đổi là khách đặt lịch demo theo bài toán của họ, sau đó nhận đề xuất và báo giá. Đây là trang marketing của một sản phẩm hoàn thiện theo xác nhận của chủ thương hiệu.

Các quyết định đã cập nhật theo yêu cầu:

- Bỏ toàn bộ mục lộ trình khỏi trang marketing.
- Không gắn nhãn “dữ liệu minh hoạ”, “dev”, “chưa triển khai” vào trang bán hàng; caption dùng “Giao diện sản phẩm VOMA”.
- Công ty mẹ chỉ đóng vai trò bảo chứng về đơn vị phát triển; không có CTA hợp tác đối tác hoặc hồ sơ năng lực.
- Không lấy số đơn, doanh thu hay số người mua trong tài khoản khảo sát làm số liệu thành tích kinh doanh của VOMA.
- Chọn trình diễn sản phẩm và lợi ích công việc làm bằng chứng thuyết phục.

## 2. Nghiên cứu sản phẩm và trang hiện tại

### Nguồn trực tiếp

Đã dùng `voma -e dev web`, đọc OpenAPI qua `voma paths`, gọi API và đăng nhập ứng dụng bằng tài khoản do người dùng cung cấp. Không lưu mật khẩu hoặc token vào mã nguồn, tài liệu hay tài sản công khai. Không sửa dữ liệu nghiệp vụ.

Phạm vi trực tiếp quan sát: gian hàng TopVN Sport Hà Nội, các màn đơn hàng, sản phẩm, kho vận và hoá đơn. Đã chụp bốn màn hình và quay một video tham quan khoảng 27 giây.

| Nghiệp vụ | Đã nhìn thấy trên giao diện                                                          | Giá trị nên nói với người mua                           |
| --------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------- |
| Đơn hàng  | Kênh bán, trạng thái, thanh toán, tiến độ kho; panel chi tiết có thông tin liên quan | Xem một đơn đủ ngữ cảnh để xử lý và trả lời khách       |
| Sản phẩm  | SKU, biến thể, thuộc tính, mức đầy đủ dữ liệu, giá và tồn                            | Tổ chức danh mục rõ ràng, nhận biết thông tin còn thiếu |
| Kho       | Nhiều kho, vị trí, thực có, đang giữ, phiếu nhập/xuất, giao dịch                     | Biết hàng và công việc đang nằm ở đâu                   |
| Hoá đơn   | Danh sách, dòng hàng, đơn liên quan, trạng thái gửi và phản hồi                      | Theo dõi hồ sơ cần xử lý và đối chiếu thuận tiện        |

API OMS `/dashboard/stats` với đúng seller Hà Nội trả 5.400 đơn và 1.265 khách hàng; màn kho hiển thị 3 kho, 93 vị trí. Đây là thông tin khảo sát nội bộ, không phải bằng chứng doanh số, khách hàng hay năng lực tải của nền tảng. Lượt API đầu dùng seller mặc định được loại khỏi căn cứ đối chiếu; sau đó đã chỉ rõ seller Hà Nội. Quan sát giao diện và dữ liệu dev không phải phép thử kết nối sàn hoặc phát hành hoá đơn production.

### Những điểm trang cũ làm giảm sức thuyết phục

Khảo sát [trang hiện tại](https://www.voma.vn/) và mã nguồn ban đầu:

1. **Sai trọng tâm danh mục sản phẩm:** “CRM + thuế tự động” khiến người mua khó thấy giá trị điều hành đơn và kho, là những phần có giao diện cụ thể.
2. **Quá nhiều thuật ngữ ở màn đầu:** PIM, OMS, WMS, sandbox, XML và tên văn bản chiếm chỗ của câu trả lời “phần mềm giúp công việc gì”.
3. **Bằng chứng chưa nhất quán:** bộ đếm hoá đơn tự tăng bằng `Math.random()`, testimonial dùng ảnh stock, các con số 12.000+ khách, tốc độ và tỷ lệ hiệu quả chưa có căn cứ trong tài liệu khảo sát.
4. **Nhiều CTA cạnh tranh:** tư vấn, dùng thử, tính tiết kiệm thuế, chạy sandbox, thử xuất hoá đơn cùng xuất hiện.
5. **Mô phỏng chiếm vị trí sản phẩm thật:** sơ đồ luồng và terminal mô phỏng chưa giúp người mua đánh giá màn hình làm việc.
6. **Cảm giác quảng cáo quá mức:** nền tối toàn trang, glow và nhiều màu nhấn làm nội dung dài trở nên khó đọc.
7. **Form cũ tạo cảm giác thành công trước khi có gửi thực tế:** cần thay bằng đường liên hệ có tác dụng hoặc form có backend nhận lead.

Không đưa nhận định pháp lý về mức thuế hay văn bản vào trang mới. Việc bỏ khối tính thuế là quyết định tập trung chuyển đổi và nội dung sản phẩm, không phải kết luận về luật thuế.

## 3. Tham chiếu thị trường

Khảo sát nguồn chính thức; các nhận xét UX dưới đây là đánh giá thiết kế, không phải kết quả A/B test hoặc đánh giá chất lượng phần mềm đối thủ. Không suy ra tính năng VOMA từ tính năng đối thủ.

| Thương hiệu                                                | Cách trang bán hàng tổ chức thông tin                                                                      | Bài học áp dụng cho VOMA                                                                               |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [Sapo Omnichannel](https://www.sapo.vn/omnichannel.html)   | Chia bài toán theo mô hình bán hàng, nhấn quản lý tập trung, đồng bộ và quy trình; có CTA dùng thử         | Dẫn bằng tình huống người mua nhận ra. Tên phân hệ là lớp giải thích thứ hai                           |
| [Haravan Omnichannel](https://www.haravan.com/omnichannel) | Hero nền sáng, CTA lớn, điều hướng theo nhóm lợi ích; tiếp tục giải thích sản phẩm, đơn, tồn và dòng tiền  | Một CTA chủ đạo, nhóm nội dung dễ quét. VOMA dùng ảnh ứng dụng để khách đánh giá cụ thể                |
| [KiotViet](https://www.kiotviet.vn/)                       | Định vị ngành hàng rõ, trình bày tính dễ sử dụng và nhiều nhóm giải pháp                                   | Nói ngôn ngữ công việc. Chỉ chọn nhóm khách phù hợp, tránh mở rộng sang quá nhiều ngành                |
| [Cin7](https://www.cin7.com/)                              | Đặt inventory và kết nối vận hành làm trung tâm; có demo, use case và nội dung theo giai đoạn doanh nghiệp | Xây câu chuyện xuyên suốt đơn–kho–hoá đơn; dùng demo để hỗ trợ quyết định mua cần nhiều người tham gia |
| [Zoho Inventory](https://www.zoho.com/inventory/)          | Phân biệt rõ inventory, order management, fulfillment, tích hợp và tài nguyên                              | Cho người mua hai cách khám phá: theo lợi ích công việc hoặc theo phân hệ                              |

**Khoảng tập trung đề xuất:** làm rõ khả năng nhìn xuyên suốt một đơn hàng và phối hợp giữa bán hàng, kho, hoá đơn. Đây là lựa chọn thông điệp để VOMA dễ được hiểu, không phải tuyên bố tính năng độc quyền hoặc vượt đối thủ.

Ảnh tham chiếu đã lưu trong `assets/reference-parent.png`, `assets/reference-haravan.png`, `assets/reference-cin7.png`; ảnh này chỉ phục vụ nghiên cứu nội bộ, không được nhúng vào trang marketing.

### Vai trò công ty mẹ

[Nỏ Thần Agentic](https://www.nothanagentic.vn/vi) sử dụng giọng kỹ thuật, nội dung tích hợp phần cứng, nền tối và điểm nhấn cam. [Trang giới thiệu VOMA của công ty mẹ](https://www.nothanagentic.vn/vi/giai-phap/voma) xác định VOMA là sản phẩm quản trị bán hàng đa kênh do một đội kỹ thuật riêng phụ trách.

Giữ quan hệ thương hiệu bằng dòng “Được phát triển bởi Nỏ Thần Agentic”, một khối giới thiệu gọn và thông tin liên hệ xác minh trên trang mẹ. VOMA dùng phong cách sáng, xanh trầm và nội dung về công việc của người mua. Thông tin trạng thái phát triển trên website mẹ cần được đội thương hiệu cập nhật theo xác nhận mới của chủ sản phẩm; trang VOMA không đưa nội dung lộ trình đó vào thông điệp bán hàng.

## 4. Người mua và hành trình chuyển đổi

Đây là giả thuyết persona cho thiết kế, cần đối chiếu bằng các cuộc gọi bán hàng thực tế.

| Người xem        | Câu hỏi trong đầu                                 | Nội dung trả lời                                       | Bước tiếp theo                     |
| ---------------- | ------------------------------------------------- | ------------------------------------------------------ | ---------------------------------- |
| Chủ doanh nghiệp | Có quản lý được khi đơn và kho tăng không?        | Hero, lợi ích, quy trình triển khai, đơn vị phát triển | Đặt lịch demo                      |
| Quản lý vận hành | Có nhìn ra công việc đang tắc không?              | Ảnh đơn, trạng thái, panel kho và hoá đơn              | Xem video → demo theo quy trình    |
| Bán hàng         | Có tra cứu được thông tin để trả lời khách không? | Tab đơn hàng và chi tiết liên quan                     | Chia sẻ trang cho người quyết định |
| Kho / kế toán    | Màn hình có đủ dữ liệu để làm việc không?         | Tab nghiệp vụ, ảnh mở đầy đủ, tài liệu                 | Cùng tham gia demo                 |

Luồng chính: hiểu sản phẩm → nhận ra bài toán → thấy giao diện → biết cách triển khai → đặt lịch. Khách có nhu cầu sẵn có thể vào liên hệ từ header. Khách đang tìm hiểu xem ảnh/video không cần để lại thông tin trước.

Chưa chọn CTA “Dùng thử miễn phí 14 ngày” vì luồng tự đăng ký và chính sách dùng thử chưa được xác minh. “Đặt lịch demo” phù hợp cách bán cần khảo sát nghiệp vụ. Đây là quyết định UX, có thể đổi khi sales có quy trình self-service hoạt động.

## 5. Bố cục và nội dung cuối cùng

### 01 — Header

Logo VOMA, Sản phẩm, Giải pháp, Triển khai, Về VOMA. Bên phải: Đăng nhập và Đặt lịch demo. Một hàng, cao 84 px desktop / 72 px mobile, sticky. Không thêm thanh thông báo thuế hoặc huy hiệu đối tác.

### 02 — Hero

Eyebrow: **NỀN TẢNG QUẢN TRỊ BÁN HÀNG ĐA KÊNH**

H1: **Nắm rõ từng đơn hàng. / Chủ động cả vận hành.**

Mô tả: “Kết nối sản phẩm, đơn hàng, kho và hoá đơn trong một không gian làm việc. Để đội ngũ phối hợp rõ ràng, doanh nghiệp vững bước mở rộng.”

CTA chính: **Đặt lịch demo**. CTA phụ: **Xem sản phẩm**, đưa đến video và bắt đầu phát khi trình duyệt cho phép.

Ảnh chính: danh sách đơn hàng thật, nhìn thấy các cột kênh, thanh toán, trạng thái cùng panel chi tiết. Khung nền xanh nhạt, không phối cảnh nghiêng. Caption: **Giao diện sản phẩm VOMA**. Nút xem video đặt tại cạnh dưới ảnh, không che phần tiêu đề và dữ liệu quan trọng.

Dưới hero: “Được phát triển bởi Nỏ Thần Agentic” và bốn nghiệp vụ. Không đặt dải logo sàn dưới nhãn khách hàng hoặc đối tác.

### 03 — Lợi ích theo người sử dụng

H2: **Kinh doanh mở rộng. / Vận hành vẫn trong tầm tay.**

Ba khối cùng cấp:

- Người quản lý — **Nắm được việc cần ưu tiên.** Theo dõi các nhóm đơn và trạng thái xử lý để biết công việc đang nằm ở khâu nào.
- Đội bán hàng — **Tra cứu đơn nhanh, rõ ngữ cảnh.** Xem khách hàng, kênh bán, thanh toán và tiến độ kho khi cần trả lời về một đơn hàng.
- Đội kho & kế toán — **Phối hợp trên dữ liệu có liên kết.** Tra cứu phiếu kho, hoá đơn và giao dịch liên quan để đối chiếu công việc giữa các bộ phận.

### 04 — Khám phá sản phẩm

H2: **Chi tiết từng nghiệp vụ. / Liền mạch cả quy trình.**

Bốn nút chọn nội dung: Đơn hàng, Sản phẩm, Kho hàng, Hoá đơn. Mặc định Đơn hàng vì gần nhất với câu hứa của hero. Mỗi nội dung gồm một headline kết quả, một đoạn ngắn, ba điểm cụ thể và ảnh thật mở được bản đầy đủ.

| Phân hệ  | Headline                              | Ba điểm trình bày                                                                     |
| -------- | ------------------------------------- | ------------------------------------------------------------------------------------- |
| Đơn hàng | Mỗi đơn hàng, một bức tranh đầy đủ.   | Lọc theo kênh/trạng thái; thông tin đơn và tiến độ kho; khách hàng/giá trị/thanh toán |
| Sản phẩm | Danh mục rõ ràng. Sẵn sàng để bán.    | SKU/biến thể; mức đầy đủ dữ liệu; giá/tồn                                             |
| Kho      | Biết hàng ở đâu. Biết việc đang chờ.  | Nhiều kho/vị trí; phiếu nhập/xuất; biến động tồn                                      |
| Hoá đơn  | Theo dõi hoá đơn đến từng trạng thái. | Hoá đơn/đơn liên quan; gửi/phản hồi; dòng hàng/thanh toán                             |

Không tự chuyển tab. Nội dung do khách điều khiển. CTA tại panel: **Trao đổi về nghiệp vụ này**.

### 05 — Video sản phẩm

H2: **Nhìn cách VOMA làm việc.**

Copy: “Từ danh sách đơn đến sản phẩm, kho và hoá đơn. Một vòng tham quan ngắn qua giao diện thực tế.”

Video khoảng 27 giây, có controls, poster, phụ đề tiếng Việt, không nhạc và không tự chạy khi tải trang. Trình tự đơn → sản phẩm → kho → hoá đơn. Không mô phỏng thao tác ghi thành công. Bản hiện có là tour màn hình, không gọi là hướng dẫn một giao dịch từ đầu đến cuối.

### 06 — Triển khai và báo giá

H2: **Triển khai theo cách doanh nghiệp bạn vận hành.**

Ba bước: Trao đổi bài toán → Demo theo nghiệp vụ → Thống nhất triển khai. Nêu các yếu tố để báo giá: gian hàng, kho, khối lượng đơn, phân hệ, tích hợp. CTA **Trao đổi nhu cầu**.

Thay bảng giá hiện tại bằng liên hệ báo giá trong bản đề xuất. Khi chính sách giá chính thức được xác nhận, có thể thêm bảng đơn giản gồm phạm vi, giới hạn, phí thiết lập và tổng phí theo chu kỳ. Không tự đặt giá mới, giảm giá, thời hạn thử hoặc SLA.

### 07 — Bảo chứng đơn vị phát triển

H2: **Công nghệ vững vàng. / Đội ngũ hiểu sản phẩm.**

Mô tả VOMA được đội kỹ thuật riêng thuộc Nỏ Thần Agentic phát triển và duy trì. Một link tìm hiểu công ty. Không danh sách camera, năng lực AI, hồ sơ hợp tác hay lộ trình tính năng.

### 08 — Câu hỏi trước mua

Accordion: doanh nghiệp phù hợp; có xem trước sản phẩm không; kênh bán; chi phí/thời gian triển khai; nhiều kho. Nội dung trả lời trong mã nguồn là copy hoàn chỉnh. Link phụ đến tài liệu sử dụng.

### 09 — CTA cuối

H2: **Cùng gỡ điểm nghẽn vận hành của bạn.**

Mô tả: “Trao đổi với đội ngũ về quy trình hiện tại. Xem VOMA có thể hỗ trợ doanh nghiệp ở những khâu nào.”

CTA **Liên hệ đặt lịch demo**, điện thoại 0983 650 552. Hiện dùng email xác minh từ trang mẹ: contact@nothanagentic.vn. UI nói rõ link mở ứng dụng thư; không báo đã gửi khi chưa có yêu cầu thật.

### 10 — Footer

Logo, mô tả một câu, liên kết sản phẩm/video/tài liệu, đơn vị phát triển, email và địa điểm Hà Nội. Cần các trang điều khoản và chính sách riêng của VOMA khi phát hành bản marketing chính thức; không chèn link `#` giả làm tài liệu pháp lý.

## 6. Hệ thống thị giác và tương tác

| Thành phần  | Quy cách                                                                 |
| ----------- | ------------------------------------------------------------------------ |
| Nền         | Trắng ngà `#FCFDFB`; nhóm sản phẩm `#F1F4ED`                             |
| Chữ         | Xanh đen `#182B29`; phụ `#5D6C67`                                        |
| CTA         | Xanh `#116451`, chữ trắng; hover `#0C4A3C`                               |
| Nhấn        | Xanh non `#DCEDB5`; cam đất chỉ trong khối thương hiệu mẹ                |
| Font        | Be Vietnam Pro, fallback sans-serif; hỗ trợ đầy đủ tiếng Việt            |
| Cỡ chữ      | H1 khoảng 60/44/35 px; H2 43/30 px; body 12–14 px; line-height body 1.85 |
| Lưới        | Container tối đa 1248 px; biên 48 px desktop, 28 px tablet, 18 px mobile |
| Khoảng cách | Section 100/65/52 px theo viewport; card 24–35 px                        |
| Hình khối   | Radius 5–12 px, đường viền mảnh; bóng nhẹ dành cho màn hình sản phẩm     |
| Icon        | Lucide, một phong cách nét; icon đi kèm chữ                              |
| Chuyển động | Hover ngắn; không auto carousel, ticker hay counter                      |

Không dựng lại dashboard tưởng tượng. Ảnh được chụp trực tiếp từ ứng dụng. Logo dùng nguyên file SVG của trang đăng nhập VOMA, lấy từ `/data/projects/voma/voma-web/public/brand/logo-full.svg`, sao chép vào `public/brand/logo-full.svg`. Giữ nguyên hình, màu và tỉ lệ; không vẽ lại hoặc thay bằng chữ V.

Desktop: hero hai cột chữ, ảnh rộng phía dưới; benefits ba cột; panel sản phẩm khoảng 37/63. Mobile: stack nội dung, tab 2×2, ảnh hero crop vào vùng danh sách; ảnh đầy đủ vẫn truy cập qua phần sản phẩm. Không thu nhỏ bảng tính đến mức người xem phải cố đọc. Không có nút nổi che controls video.

Khả năng truy cập: skip link, một H1, tiêu đề phân cấp, focus rõ, điều khiển bằng bàn phím, `aria-pressed` cho nút đổi phân hệ, `aria-expanded` cho menu, accordion native, alt ảnh, captions video. Tôn trọng reduced motion. Chữ nhỏ chỉ dùng cho caption/metadata; nội dung mua hàng phải giữ đọc được trên điện thoại.

## 7. Tư liệu và quy trình dùng cho marketing

Tài sản công khai được dùng trong bản mẫu:

| Tệp                                     | Mục đích                        |
| --------------------------------------- | ------------------------------- |
| `public/media/orders.png`               | Hero, tab đơn, poster video     |
| `public/media/catalog.png`              | Tab sản phẩm                    |
| `public/media/workspaces-warehouse.png` | Tab kho                         |
| `public/media/invoices.png`             | Tab hoá đơn                     |
| `public/media/product-tour.webm`        | Tour khoảng 27 giây             |
| `public/media/product-tour.vi.vtt`      | Nội dung chú thích từng phân hệ |

Nguồn nội bộ: môi trường dev, gian hàng seed do chủ sản phẩm cho phép dùng. Ghi nguồn ở tài liệu bàn giao; không đưa nhãn môi trường vào copy bán hàng. Những số hiển thị bên trong giao diện chỉ là nội dung màn hình, không tách ra làm social proof.

Ảnh cũ trong `docs/homepage/assets/` là tư liệu khảo sát; bản media trong `public/media/` là bản được dùng trên trang. Bản tour hiện tại không có voice-over. Nếu làm video quảng cáo 60–90 giây, nên kể một đơn cụ thể, quay lọc đơn → mở thông tin hàng → xem phiếu kho → xem hoá đơn liên quan, chỉ quay các thao tác đã thực hiện được. Cần dùng cùng mã đơn xuyên suốt trước khi gọi đó là video quy trình end-to-end.

Storyboard video bán hàng mở rộng:

| Thời lượng | Cảnh                           | Thông điệp                                              |
| ---------- | ------------------------------ | ------------------------------------------------------- |
| 0–8s       | Danh sách đơn, chọn trạng thái | “Đơn hàng đến từ nhiều nơi. Bắt đầu xử lý tại một nơi.” |
| 8–25s      | Một đơn và các tab thông tin   | “Nắm được khách hàng, thanh toán và tiến độ xử lý.”     |
| 25–42s     | Phiếu kho liên quan            | “Đội kho biết việc cần làm, đội bán biết tiến độ.”      |
| 42–55s     | Hoá đơn của đơn đã chọn        | “Tra cứu hồ sơ và trạng thái để thuận tiện đối chiếu.”  |
| 55–65s     | Chốt logo và CTA               | “Đặt lịch demo VOMA theo quy trình doanh nghiệp bạn.”   |

## 8. Handoff cho marketing, sales và kỹ thuật

Bản React là bản mẫu tương tác review được, đã thay nội dung trang chủ trong workspace. Chưa deploy lên production. Các liên hệ hiện mở email hoặc điện thoại; chưa có backend thu lead mới.

Đề xuất khi nối form thật: họ tên, công ty, một kênh liên hệ bắt buộc; nhu cầu là trường tùy chọn. Nêu mục đích sử dụng thông tin và dẫn chính sách áp dụng. Không bắt điền doanh thu, mã số thuế hoặc toàn bộ quy mô trước khi khách được xem demo. Chỉ hiển thị thành công khi API xác nhận tiếp nhận; lỗi giữ dữ liệu đã nhập và cho thử lại. Sales nhận được vị trí CTA và phân hệ đang quan tâm, không chỉ tên/điện thoại.

Đo lường đề xuất, chưa gắn dịch vụ analytics:

- `demo_cta_click`: vị trí hero/header/panel/final và phân hệ đang chọn.
- `product_module_select`: phân hệ được xem.
- `product_video_start`, `product_video_complete`.
- `contact_email_click`, `contact_phone_click`; không tính email click là lead đã gửi.
- Khi có form: `lead_submit_success`; khi có CRM: demo được xác nhận, demo diễn ra, cơ hội đủ điều kiện và hợp đồng.

KPI chính là demo đủ điều kiện trên phiên truy cập phù hợp và tỷ lệ demo thành cơ hội bán hàng. Theo dõi click chỉ để chẩn đoán. Chưa đặt mục tiêu tăng chuyển đổi bằng phần trăm vì chưa có baseline.

Trước khi phát hành: xác nhận chính sách giá/dùng thử với sales; xác nhận hotline marketing chính thức (trang mẹ dùng 0983 650 552, app hiển thị một số hỗ trợ khác); hoàn thiện chính sách VOMA; kiểm tra link đăng nhập/tài liệu; logo chính thức đã lấy từ trang đăng nhập. Đây là các đầu việc phát hành cụ thể, không phải rào cản để review bản thiết kế hiện tại.

## 9. Tiêu chí nghiệm thu bản thiết kế

Người mới cần hiểu trong màn đầu: VOMA là gì, giúp phần việc nào, xem sản phẩm ở đâu và làm sao trao đổi để mua. Marketing có headline và cấu trúc nội dung thống nhất; sales có điểm đến demo theo nhu cầu; người sử dụng nghiệp vụ nhìn thấy giao diện cụ thể.

Kiểm tra kỹ thuật: TypeScript, production build, desktop 1440 px, mobile 390/375 px, menu, bốn phân hệ, FAQ, CTA video, tải ảnh/captions, không overflow ngang. Ghi kết quả thực tế tại `VALIDATION.md` sau kiểm tra.
