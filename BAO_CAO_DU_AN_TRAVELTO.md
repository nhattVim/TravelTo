# BÁO CÁO DỰ ÁN HỆ THỐNG ĐẶT TOUR DU LỊCH TRAVELTO

## TÓM TẮT
Dự án **TravelTo** là một hệ thống ứng dụng web đặt tour du lịch trực tuyến hiện đại, được thiết kế nhằm đáp ứng nhu cầu ngày càng cao trong việc số hóa các dịch vụ du lịch tại Việt Nam. TravelTo cung cấp một nền tảng toàn diện, kết nối trực tiếp khách du lịch với các chuyến đi đa dạng trên khắp các tỉnh thành. Hệ thống bao gồm đầy đủ các tính năng từ việc tìm kiếm, xem chi tiết tour, đặt vé cho đến quản lý thanh toán, xem lịch sử chuyến đi và để lại đánh giá (review). 

Điểm nổi bật của TravelTo là việc xây dựng dựa trên kiến trúc Microservices đơn giản, phân tách rạch ròi giữa Front-end (Next.js 16) và Back-end (Spring Boot 4). Đặc biệt, hệ thống tích hợp trí tuệ nhân tạo (AI) qua SDK Google Generative AI (Gemini Flash 2.5) như một trợ lý ảo thông minh giúp tư vấn lịch trình một cách tự nhiên. Bên cạnh đó, hệ thống cung cấp một bảng điều khiển (Dashboard) dành cho Quản trị viên (Admin) với khả năng quản lý toàn diện các thực thể (người dùng, tour, đợt khởi hành, đơn đặt chỗ) cùng biểu đồ thống kê doanh thu trực quan. Mục tiêu của dự án không chỉ dừng lại ở việc hoàn thành một ứng dụng học thuật mà còn hướng tới trải nghiệm người dùng tối ưu, sẵn sàng cho việc triển khai thực tế.

---

## CHƯƠNG 1: GIỚI THIỆU TỔNG QUAN

### 1.1 Tổng quan về web
#### 1.1.1. Bối cảnh và nhu cầu thực tiễn
Trong kỷ nguyên công nghệ 4.0 và chuyển đổi số, ngành du lịch đang chứng kiến sự thay đổi mạnh mẽ về hành vi của người tiêu dùng. Thay vì phải đến trực tiếp các đại lý du lịch truyền thống để hỏi thông tin và mua tour, du khách ngày nay ưu tiên việc tự tìm kiếm, so sánh giá cả, đọc các bài đánh giá (review) và thực hiện thao tác đặt chỗ trực tuyến. 

Tại Việt Nam, với lợi thế bờ biển dài và hàng loạt danh lam thắng cảnh đa dạng, nhu cầu du lịch nội địa và quốc tế luôn ở mức cao. Tuy nhiên, nhiều du khách vẫn gặp khó khăn trong việc tổng hợp thông tin, lên lịch trình phù hợp và tìm kiếm nền tảng đặt tour đáng tin cậy. Nhận thấy những vướng mắc đó, hệ thống TravelTo được phát triển để cung cấp một giải pháp "All-in-one" (tất cả trong một), giúp người dùng dễ dàng khám phá, tương tác và thực hiện giao dịch an toàn chỉ với vài cú click chuột.

#### 1.1.2. Giới thiệu về dạng web TravelTo
TravelTo là dạng ứng dụng web thương mại điện tử (E-commerce Web Application) chuyên biệt trong lĩnh vực dịch vụ lữ hành (Online Travel Agency - OTA). Nền tảng được thiết kế với các nhóm chức năng chính như sau:
- **Khám phá và Tìm kiếm:** Cung cấp bộ lọc thông minh theo tỉnh thành, mức giá, danh mục, giúp người dùng dễ dàng tìm được tour ưng ý.
- **Tư vấn thông minh:** Tích hợp Chatbot AI tư vấn lịch trình, thời tiết và gợi ý điểm đến phù hợp với sở thích của từng cá nhân.
- **Giao dịch và Quản lý:** Xử lý quy trình đặt tour (Booking) linh hoạt cho nhiều đối tượng (người lớn, trẻ em, trẻ nhỏ), gửi Email xác nhận tự động, quản lý trạng thái thanh toán.
- **Tương tác cộng đồng:** Cho phép người dùng đánh giá và bình luận về tour, tạo thành một cộng đồng du lịch uy tín.

### 1.2. Một số ứng dụng tương tự
Trên thị trường du lịch trực tuyến hiện nay, có rất nhiều ông lớn đã và đang thành công, có thể kể đến:
- **Traveloka:** Một trong những OTA lớn nhất Đông Nam Á, mạnh về mảng đặt vé máy bay và khách sạn, đồng thời mở rộng mạnh mẽ sang mảng trải nghiệm du lịch (Xperience).
- **Klook:** Ứng dụng chuyên về các hoạt động trải nghiệm, vé tham quan, tour trong ngày tại điểm đến, đặc biệt thu hút giới trẻ nhờ giao diện năng động.
- **Booking.com & Agoda:** Các nền tảng toàn cầu tập trung vào lưu trú, nhưng hiện nay cũng đang tích hợp thêm các dịch vụ đặt xe và tour du lịch địa phương.
- **IVIVU:** Nền tảng OTA nổi tiếng của Việt Nam, chuyên về các gói combo du lịch (khách sạn + vé máy bay) nghỉ dưỡng cao cấp.

*Điểm khác biệt của TravelTo:* Trong khi các nền tảng lớn thường quá ôm đồm nhiều dịch vụ (bay, khách sạn, thuê xe), TravelTo chọn ngách đi sâu vào trải nghiệm đặt tour trọn gói tại các tỉnh thành Việt Nam, kết hợp mạnh mẽ với Trợ lý ảo AI giúp trải nghiệm lên kế hoạch du lịch trở nên dễ dàng và mang tính cá nhân hóa cao.

---

## CHƯƠNG 2: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG

### 2.1. Yêu cầu người dùng
#### 2.1.1. Khảo sát các bên liên quan
Để xây dựng hệ thống đáp ứng đúng nhu cầu thực tế, nhóm đã tiến hành khảo sát các bên liên quan (Stakeholders) bao gồm:
- **Khách du lịch (Du khách):** Cần một giao diện trực quan, đẹp mắt, tốc độ tải trang nhanh. Thông tin tour phải rõ ràng, minh bạch về lịch trình, chính sách hoàn hủy. Đặc biệt cần sự hỗ trợ ngay lập tức khi có thắc mắc (thông qua Chatbot).
- **Quản lý (Admin):** Cần hệ thống CMS (Content Management System) mạnh mẽ, có khả năng quản lý số lượng lớn tour, đợt khởi hành, theo dõi doanh thu hàng ngày/tháng và quản lý danh sách khách hàng.
- **Nhân viên CSKH/Vận hành:** Cần hệ thống thông báo trạng thái đơn hàng thời gian thực, có khả năng can thiệp hủy hoặc xác nhận booking khi cần thiết.

#### 2.1.2. Xác định người dùng hệ thống
Hệ thống được thiết kế với 2 tác nhân (Actor) chính:
1. **Khách hàng (User):** Người sử dụng hệ thống để tìm kiếm thông tin, tương tác với AI, thực hiện hành vi đặt tour và thanh toán.
2. **Quản trị viên (Admin):** Người nắm toàn quyền quản trị, thêm/sửa/xóa dữ liệu hệ thống, xem báo cáo doanh thu và xử lý các vấn đề phát sinh.

#### 2.1.3. Mô tả yêu cầu người dùng
- **Đối với User:** 
  - Đăng ký và đăng nhập hệ thống an toàn (hỗ trợ cả tài khoản nội bộ và Google OAuth2).
  - Tìm kiếm và lọc tour theo từ khóa, địa điểm (tỉnh/thành), mức giá.
  - Xem thông tin chi tiết tour bao gồm hình ảnh, lộ trình (timeline), chính sách, đánh giá.
  - Thêm tour vào danh sách yêu thích (Wishlist).
  - Thực hiện đặt tour: Chọn ngày khởi hành, nhập số lượng khách (phân loại người lớn/trẻ em), điền thông tin liên hệ và ghi chú.
  - Nhận thông báo qua Email khi đặt tour thành công.
  - Xem lại lịch sử đặt chỗ (My Bookings) và trạng thái đơn hàng.
  - Trò chuyện với Chatbot AI để xin gợi ý du lịch.
- **Đối với Admin:**
  - Đăng nhập vào trang quản trị an toàn.
  - Bảng điều khiển (Dashboard) thống kê tổng số booking, tổng doanh thu, số lượng người dùng mới, biểu đồ doanh thu trực quan.
  - Quản lý Tour: Thêm mới, chỉnh sửa thông tin, tải lên hình ảnh, tạo các đợt khởi hành (Departure) với giá cả và số lượng chỗ ngồi cụ thể.
  - Quản lý Booking: Xem danh sách các đơn đặt chỗ, thay đổi trạng thái đơn (Từ Pending sang Confirmed hoặc Cancelled).
  - Quản lý Người dùng: Xem thông tin người dùng trong hệ thống.

#### 2.1.4. Biểu đồ ca sử dụng tổng quan
Hệ thống được thiết kế dựa trên các Use Case cốt lõi:
- **Use Case của User:** `Đăng nhập/Đăng ký`, `Tìm kiếm Tour`, `Xem Chi tiết Tour`, `Chat với AI`, `Quản lý Wishlist`, `Đặt Tour (Booking)`, `Xem Lịch sử Booking`, `Đánh giá Tour (Review)`.
- **Use Case của Admin:** `Đăng nhập`, `Xem Thống kê`, `Quản lý Tour`, `Quản lý Departure`, `Quản lý Booking`, `Quản lý User`, `Quản lý Phản hồi`.

### 2.2. Đặc tả yêu cầu hệ thống
#### 2.2.1. Yêu cầu chức năng
Hệ thống TravelTo đáp ứng các chức năng nghiệp vụ sau:
1. **Module Xác thực & Phân quyền (Auth & Security):**
   - Đăng nhập/Đăng ký tài khoản Local (Bcrypt mật khẩu).
   - Tích hợp Đăng nhập bằng Google (NextAuth & Spring Security OAuth2).
   - Xác thực và phân quyền bằng JWT (JSON Web Token), chia role `USER` và `ADMIN`.
2. **Module Quản lý Tour (Tour Management):**
   - Lưu trữ thông tin tour: Tiêu đề, mô tả, địa điểm xuất phát, địa điểm đến (tỉnh thành), chính sách.
   - Quản lý lịch trình: Cấu trúc lộ trình theo từng ngày (Day-by-day itinerary).
   - Đợt khởi hành (Tour Departure): Mỗi tour có nhiều đợt khởi hành, quản lý độc lập về số chỗ trống (slots) và giá vé.
3. **Module Đặt chỗ (Booking Engine):**
   - Kiểm tra tính hợp lệ của đơn: Kiểm tra số chỗ trống trước khi tạo booking.
   - Tính toán giá tiền tự động: Người lớn (100%), Trẻ em (75%), Trẻ nhỏ (50%), Em bé (miễn phí).
   - Cập nhật số chỗ: Trừ số lượng chỗ trống (slots) ngay khi tạo đơn thành công, và khôi phục (restore) lại chỗ nếu đơn bị hủy (Cancelled).
   - Lập lịch tự động (Cronjob): Tự động hủy các đơn đặt chỗ Pending quá 15 phút không thanh toán để giải phóng chỗ.
4. **Module Tương tác (Interaction):**
   - Gửi Email xác nhận tự động bằng HTML đẹp mắt thông qua JavaMailSender.
   - Hệ thống đánh giá (Reviews) đa cấp (cha-con), tính điểm trung bình số sao.
5. **Module Trí tuệ nhân tạo (AI Chat):**
   - Tích hợp Gemini API thông qua AI SDK, có khả năng gọi Tool Call để truy vấn thông tin tour thực tế từ Database nhằm trả lời khách hàng chính xác nhất.

#### 2.2.2. Yêu cầu phi chức năng
1. **Hiệu năng & Trải nghiệm (Performance & UX):**
   - Sử dụng Next.js App Router (React Server Components) giúp tăng tốc độ tải trang (SSR), tối ưu SEO.
   - UI mượt mà nhờ Tailwind CSS và Framer Motion.
2. **Tính mở rộng (Scalability):**
   - Kiến trúc Back-end và Front-end tách biệt hoàn toàn, giao tiếp qua RESTful API. Dễ dàng triển khai (deploy) độc lập.
3. **Tính bảo mật (Security):**
   - Mã hóa mật khẩu, không lưu bản rõ trong cơ sở dữ liệu.
   - Bảo vệ API Endpoint, chỉ có Admin mới được phép thao tác các API POST/PUT/DELETE liên quan đến dữ liệu hệ thống.
4. **Bảo trì và Xử lý lỗi (Maintainability):**
   - Xử lý Global Exception Handler ở Back-end, trả về mã lỗi (HTTP Status Code) và thông báo lỗi rõ ràng.
   - Sử dụng TypeScript ở Front-end để giảm thiểu lỗi runtime.

### 2.3. Kiến trúc hệ thống
Hệ thống TravelTo tuân theo kiến trúc **Client-Server** hiện đại:
- **Tầng Client (Front-end):**
  - Khung ứng dụng: Next.js 16 (phiên bản mới nhất với App Router).
  - Thư viện UI: React 19, Tailwind CSS v4, Lucide React (icon), Recharts (biểu đồ thống kê).
  - Quản lý trạng thái & Fetch Data: Server Actions, NextAuth cho session.
  - Tích hợp AI: thư viện `ai` và `@ai-sdk/google` để stream phản hồi từ LLM.
- **Tầng Server (Back-end):**
  - Ngôn ngữ: Java 21.
  - Khung ứng dụng: Spring Boot 4.x.
  - Tầng Persistence: Spring Data JPA (Hibernate).
  - Bảo mật: Spring Security, JJWT.
- **Tầng Dữ liệu (Database):**
  - Môi trường phát triển & kiểm thử: Sử dụng H2 Database (In-memory) hoặc MySQL.
  - Môi trường thực tế: MySQL 8.0.

### 2.4. Thiết kế cơ sở dữ liệu
Cơ sở dữ liệu được chuẩn hóa với các thực thể (Entity) chính:
- `users`: Lưu thông tin tài khoản (id, email, password, role, provider).
- `tours`: Lưu thông tin chung của tour (id, title, description, province_name, image_url, status).
- `tour_departures`: Lưu chi tiết các đợt mở bán của tour (id, tour_id, departure_date, price, slots_available).
- `bookings`: Lưu thông tin đơn đặt chỗ (id, user_id, tour_id, departure_id, travel_date, guests, adult_guests, child_guests, total_price, status, contact_name).
- `reviews`: Lưu đánh giá của người dùng về tour (id, user_id, tour_id, rating, content, parent_id).
- `wishlists`: Lưu các tour yêu thích của người dùng (id, user_id, tour_id).

---

## CHƯƠNG 3: XÂY DỰNG HỆ THỐNG

### 3.1. Môi trường phát triển
#### 3.1.1. Công cụ và Môi trường phát triển
- **Môi trường lập trình:**
  - Node.js (v20+) và PNPM cho Front-end.
  - Java Development Kit (JDK 21) và Maven cho Back-end.
- **IDE và Editor:**
  - Visual Studio Code với các extension hỗ trợ (ESLint, Prettier, Tailwind).
  - IntelliJ IDEA / Eclipse cho lập trình Java Spring Boot.
- **Công cụ kiểm thử API:** Postman.
- **Hệ quản trị CSDL:** MySQL Workbench, DBeaver.

### 3.2. Cấu trúc dự án
Dự án được tổ chức theo mô hình Monorepo chứa 2 thư mục chính `be/` và `fe/`:
- **Thư mục `be/` (Back-end):**
  Được tổ chức theo kiến trúc Package-by-Feature (nhóm theo tính năng) để dễ quản lý:
  - `auth`: Chứa các controller, service liên quan đến đăng nhập, JWT, xác thực.
  - `user`: Quản lý thông tin tài khoản, profile.
  - `tour`: Các lớp xử lý logic liên quan đến Tour, TourDeparture, Review.
  - `booking`: Chứa `BookingService.java`, xử lý logic đặt vé phức tạp, tính tiền, trừ/cộng dồn chỗ trống, gửi mail xác nhận, và scheduler hủy vé tự động.
  - `payment`: Chứa logic tích hợp cổng thanh toán trực tuyến (VNPay/Momo - cấu trúc sẵn cho việc mở rộng).
  - `common`: Các lớp cấu hình chung, Global Exception, Email Service.
- **Thư mục `fe/` (Front-end):**
  Sử dụng App Router của Next.js với tổ chức:
  - `src/app/(public)`: Các trang người dùng không cần đăng nhập (Trang chủ, Danh sách Tour, Chi tiết Tour).
  - `src/app/(user)`: Các trang yêu cầu quyền User (Dashboard cá nhân, Lịch sử đặt tour, Wishlist).
  - `src/app/(admin)`: Các trang yêu cầu quyền Admin (Quản lý thống kê, Quản lý Tour, Booking).
  - `src/components`: Chứa các component tái sử dụng (Chatbot UI, TourCard, Header, Footer, Recharts Wrapper).

### 3.3. Triển khai hệ thống thử nghiệm
Hệ thống được thiết lập chạy thử nghiệm (Local Development) nhanh chóng:
- **Khởi chạy Back-end:** Sử dụng lệnh `./mvnw spring-boot:run` tại thư mục `be/`, ứng dụng khởi chạy tại cổng `8080`. Cơ sở dữ liệu H2 được sử dụng mặc định để dễ dàng test.
- **Khởi chạy Front-end:** Sử dụng lệnh `pnpm run dev` tại thư mục `fe/`, ứng dụng khởi chạy tại cổng `3000`. Cấu hình `.env` cho Next.js để kết nối API tới `http://localhost:8080`.

### 3.4. Một số giao diện tiêu biểu
1. **Trang chủ (Home Page):** Gây ấn tượng mạnh với Hero Banner lớn, thanh tìm kiếm nổi bật và danh sách các "Điểm đến phổ biến" (Popular Destinations), "Tour nổi bật" (Featured Tours).
2. **Trang chi tiết Tour (Tour Detail):** Giao diện chia bố cục 2 cột. Cột trái hiển thị hình ảnh, mô tả, lộ trình (timeline), và đánh giá. Cột phải là thanh (sidebar) hiển thị lịch chọn ngày khởi hành (chỉ các ngày có sẵn), chọn số lượng khách và nút "Đặt ngay".
3. **Trang Quản trị (Admin Dashboard):** Tích hợp biểu đồ thống kê doanh thu theo tháng cực kỳ trực quan (sử dụng Recharts). Danh sách đơn đặt chỗ được quản lý dạng bảng (table), cho phép Admin thay đổi trạng thái (Pending -> Confirmed).
4. **Trợ lý Ảo (AI Chat Widget):** Một nút chat luôn nổi ở góc phải màn hình. Khi mở lên, người dùng có thể trò chuyện tự nhiên với Gemini AI, nhận về các gợi ý lịch trình hoặc hỏi chi tiết về các tour đang có trên hệ thống.

---

## CHƯƠNG 4: KẾT QUẢ THỰC NGHIỆM VÀ ĐÁNH GIÁ

### 4.1. Đánh giá tính năng
Hệ thống đã đáp ứng tốt các luồng nghiệp vụ cốt lõi:
- **Luồng Booking:** Xử lý chính xác logic tính giá phức tạp. Đặc biệt, luồng kiểm tra số chỗ trống (slots_available) được xử lý đồng bộ tốt thông qua Transaction, ngăn ngừa tình trạng Overbooking (đặt lố chỗ). Cơ chế tự động hủy Booking pending sau 15 phút bằng Spring `@Scheduled` hoạt động ổn định.
- **Luồng Email:** Tích hợp thành công việc gửi Email HTML chuyên nghiệp, chứa đầy đủ thông tin mã đơn hàng, hành khách, giá tiền tới người dùng ngay khi Admin hoặc hệ thống xác nhận thanh toán.
- **AI Integration:** LLM hiểu đúng ngữ cảnh và có thể truy xuất dữ liệu tour thời gian thực.

### 4.2. Đánh giá hiệu năng và bảo mật
- Front-end có tốc độ render rất nhanh do Next.js xử lý SSR và tận dụng Tailwind CSS gọn nhẹ.
- Back-end chịu tải tốt, cấu trúc database được lập chỉ mục (index) đúng cách, giảm thiểu thời gian truy vấn.
- Về bảo mật: Hệ thống quản lý Token JWT an toàn, bảo vệ triệt để các Endpoint nhạy cảm khỏi các request trái phép.

---

## CHƯƠNG 5: QUẢN LÝ MÃ NGUỒN VÀ QUẢN LÝ DỰ ÁN

### 5.1. Quản lý mã nguồn
#### 5.1.1. Công cụ và Tổ chức Mã nguồn
- **Công cụ:** Toàn bộ mã nguồn dự án được quản lý phiên bản bằng **Git** và lưu trữ trên nền tảng GitHub.
- **Tổ chức Repository:** Dự án áp dụng mô hình **Monorepo**, lưu trữ cả phần Back-end (`be/`) và Front-end (`fe/`) trong cùng một kho chứa. Điều này giúp dễ dàng đồng bộ cấu trúc, chia sẻ tài liệu và thuận tiện cho việc thiết lập CI/CD sau này.
- **Chiến lược phân nhánh (Branching Strategy):** Tuân thủ Git Flow cơ bản. Nhánh `main` chứa mã nguồn ổn định nhất để triển khai (production). Các tính năng mới được phát triển trên các nhánh riêng biệt như `feature/auth`, `feature/booking`, `feature/admin-dashboard`.

#### 5.1.2. Cách xử lý và phòng tránh xung đột mã nguồn (conflict)
Xung đột mã nguồn là điều không thể tránh khỏi khi làm việc nhóm. Dự án áp dụng các nguyên tắc:
- Chia nhỏ các tính năng (Task) cho từng thành viên, đảm bảo ít có sự trùng lặp khi sửa cùng một file cốt lõi.
- Trước khi code tính năng mới, luôn `git pull origin main` để cập nhật code mới nhất.
- Yêu cầu tạo Pull Request (PR) thay vì push trực tiếp lên nhánh `main`. Nhờ đó, các thành viên khác có thể Review Code và xử lý Conflict trực tiếp trên giao diện GitHub trước khi Merge.

### 5.2. Quản lý dự án
#### 5.2.1. Vai trò của các thành viên
Trong dự án này, mô hình phát triển Agile được áp dụng, các vai trò được phân định rõ ràng (có thể một người kiêm nhiệm nếu team nhỏ):
- **Project Manager / Scrum Master:** Quản lý tiến độ, đốc thúc các thành viên, xử lý các trở ngại.
- **Back-end Developer:** Đảm nhận việc thiết kế CSDL, viết API, xử lý logic nghiệp vụ, bảo mật hệ thống.
- **Front-end Developer:** Thiết kế UI/UX, tích hợp API, xử lý hiệu ứng giao diện và tối ưu hóa SEO.
- **Tester / QA:** Kiểm thử các luồng nghiệp vụ (đặc biệt là luồng đặt vé và tính tiền), đảm bảo hệ thống không có bug nghiêm trọng trước khi báo cáo.

#### 5.2.2. Kế hoạch dự án
Dự án được chia thành các Giai đoạn (Sprint) cụ thể trong vòng 8 tuần:
- **Tuần 1 - Tuần 2:** Khởi động dự án, phân tích yêu cầu, thiết kế UML, thiết kế ERD (Cơ sở dữ liệu) và setup môi trường cơ bản cho BE/FE.
- **Tuần 3 - Tuần 4:** Phát triển module Xác thực (Auth), Quản lý người dùng và Quản lý dữ liệu Tour (CRUD Tour, Departure).
- **Tuần 5 - Tuần 6:** Hoàn thiện luồng Booking Engine cốt lõi (tính giá, trừ chỗ trống), gửi Email tự động và tích hợp AI Chatbot.
- **Tuần 7:** Xây dựng các tính năng của Admin Dashboard (biểu đồ thống kê, quản lý đơn hàng).
- **Tuần 8:** Tích hợp tổng thể, kiểm thử (Testing), sửa lỗi (Fix Bug) và hoàn thiện tài liệu Báo cáo dự án.

#### 5.2.3. Công cụ quản lý dự án (Jira)
Dự án sử dụng Jira (hoặc Trello) để theo dõi tiến độ:
- Xây dựng Backlog chứa tất cả các User Story.
- Các task được đưa lên bảng Kanban với các trạng thái: `To Do` (Cần làm), `In Progress` (Đang làm), `Testing` (Đang kiểm thử) và `Done` (Hoàn thành).
- Sử dụng Jira giúp nhóm dễ dàng nhận biết ai đang làm gì, task nào đang bị nghẽn để kịp thời hỗ trợ.

---

## CHƯƠNG 6: KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

### 6.1. Kết quả đạt được
Qua thời gian nỗ lực nghiên cứu và phát triển, hệ thống **TravelTo** đã hoàn thành mục tiêu đề ra ban đầu:
- **Về mặt kỹ thuật:** Xây dựng thành công một ứng dụng Full-stack hoàn chỉnh, áp dụng các công nghệ hiện đại nhất (Next.js 16, Spring Boot 4.x). Hệ thống hoạt động mượt mà, phân tách Front-end/Back-end rõ ràng, bảo mật an toàn.
- **Về mặt tính năng:** Đáp ứng đầy đủ quy trình vòng đời của một dịch vụ lữ hành, từ tìm kiếm tour, tương tác AI, đặt vé, trừ chỗ tự động, gửi email cho đến quản lý doanh thu cho Admin.

### 6.2. Hạn chế còn tồn tại
Mặc dù đã hoàn thiện các tính năng cốt lõi, dự án vẫn còn một số điểm cần cải thiện:
- Cổng thanh toán (Payment Gateway): Dù đã thiết kế cấu trúc module `payment`, nhưng hiện tại quy trình thanh toán vẫn dừng ở mức tạo đơn và chờ xác nhận thủ công, chưa tích hợp kết nối VNPay hay Momo thực tế.
- Khả năng đa ngôn ngữ (i18n): Hệ thống hiện tại chỉ hỗ trợ tiếng Việt, chưa đáp ứng nhu cầu cho khách du lịch quốc tế.
- Khối lượng dữ liệu: Dữ liệu hiện tại chủ yếu là dữ liệu mẫu (mock data), cần cào thêm dữ liệu thực tế từ các nguồn OTA lớn.

### 6.3. Hướng phát triển tương lai
Để phát triển TravelTo thành một sản phẩm có thể thương mại hóa (SaaS), các định hướng tiếp theo bao gồm:
1. **Hoàn thiện Cổng thanh toán trực tuyến:** Tích hợp VNPay, Momo, ZaloPay, Stripe để tự động hóa hoàn toàn quy trình chốt đơn.
2. **Mô hình Multi-Tenant (Vendor):** Cho phép các đại lý du lịch thứ ba tự động đăng ký tài khoản Vendor, tự đăng tải và quản lý tour của mình trên nền tảng (giống mô hình Klook).
3. **Nâng cấp AI cá nhân hóa:** Phân tích dữ liệu lịch sử đặt tour và wishlist của người dùng để đưa ra gợi ý hoàn toàn tự động ngay trên trang chủ.
4. **Phát triển ứng dụng Mobile:** Sử dụng React Native hoặc Flutter gọi đến cùng một tập API Spring Boot, giúp tiếp cận tập khách hàng sử dụng điện thoại thông minh tốt hơn.
