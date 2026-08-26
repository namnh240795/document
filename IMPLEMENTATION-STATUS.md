# Kiểm Tra Trạng Thái Hiện Thực

Đối chiếu các tính năng trong `modules.yaml` với codebase thực tế. Cập nhật lần cuối: 2026-08-21.

**Chú Thích:**
- ✅ Đã hiện thực đầy đủ và hoạt động
- ⚠️ Hiện thực một phần (stub/skeleton hoặc thiếu tích hợp)
- ❌ Chưa hiện thực

---

## Module AUTH (`apps/auth/`)

| # | Tính Năng Theo Tài Liệu | Trạng Thái | Backend | Frontend | Ghi Chú |
|---|------------------------|------------|---------|----------|--------|
| 1 | Đăng Ký Tài Khoản | ✅ | ✅ | ✅ | Email/password + mã xác minh |
| 2 | Đăng Nhập | ✅ | ✅ | ✅ | Email/password + Google OAuth |
| 3 | Xác Minh Số Điện Thoại | ⚠️ | ⚠️ | — | SMS service đã có, không có Twilio — chỉ Discord webhook |
| 4 | Xác Minh Email | ✅ | ✅ | ✅ | Mã xác minh qua email |
| 5 | Đặt Lại Mật Khẩu | ✅ | ✅ | ✅ | Đặt lại qua email bằng Better Auth (`request-password-reset` / `reset-password`), RabbitMQ + template `reset_password`, sessions bị thu hồi. Đặt lại OTP qua điện thoại (FR-006) chưa hiện thực |
| 6 | Quản Lý Tổ Chức | ✅ | ✅ | ✅ | Tạo, liệt kê, chuyển đổi, vai trò |
| 7 | Quản Lý Nhóm | ✅ | ✅ | ✅ | CRUD trong tổ chức |
| 8 | Mời Thành Viên | ✅ | ✅ | — | Mời với phân quyền vai trò |
| 9 | RBAC | ✅ | ✅ | ✅ | Quyền kiểu Casbin |
| 10 | Quản Lý Phiên | ✅ | ✅ | — | JWT + JWKS, cookies |
| 11 | Xác Thực Social (Google) | ✅ | ✅ | ✅ | OAuth callback, liên kết tài khoản |

---

## Module EMAIL (`apps/email/`)

| # | Tính Năng Theo Tài Liệu | Trạng Thái | Backend | Frontend | Ghi Chú |
|---|------------------------|------------|---------|----------|--------|
| 12 | Gửi Email (REST) | ✅ | ✅ | — | Endpoint bảo vệ bằng JWT |
| 13 | Gửi Email (RabbitMQ) | ✅ | ✅ | — | Async consumer trên queue `email.send` |
| 14 | Theo Dõi Email | ✅ | ✅ | — | Theo dõi trạng thái, nhật ký, thống kê |
| 15 | Mẫu Email | ✅ | ✅ | ✅ | CRUD trong admin panel |
| 16 | Discord Webhook | ✅ | ✅ | — | Thông báo email qua Discord |

---

## Module SMS (`apps/sms/`)

| # | Tính Năng Theo Tài Liệu | Trạng Thái | Backend | Frontend | Ghi Chú |
|---|------------------------|------------|---------|----------|--------|
| 17 | Gửi SMS (REST) | ✅ | ✅ | — | Endpoint bảo vệ bằng JWT |
| 18 | Theo Dõi SMS | ✅ | ✅ | — | Theo dõi trạng thái, nhật ký, thống kê |
| 19 | Mẫu SMS | ✅ | ✅ | ✅ | CRUD trong admin panel |
| 20 | Discord Webhook | ✅ | ✅ | — | Thông báo SMS qua Discord |
| 21 | Tích Hợp Twilio | ❌ | ❌ | — | Chỉ có Discord, không có nhà cung cấp SMS thật |

---

## Module LOG (`apps/log-service/`)

| # | Tính Năng Theo Tài Liệu | Trạng Thái | Backend | Frontend | Ghi Chú |
|---|------------------------|------------|---------|----------|--------|
| 22 | Thu Thập Log (RabbitMQ) | ✅ | ✅ | — | Consumer trên queue `log.events` |
| 23 | Index OpenSearch | ✅ | ✅ | — | Có fallback trong bộ nhớ |
| 24 | API Truy Vấn Log | ✅ | ✅ | ✅ | Bộ lọc: level, source, action, userId, khoảng ngày |
| 25 | Phân Tích Log | ✅ | ✅ | — | Tổng hợp theo level, source, timeline |

---

## Module RECR (`apps/recruitment/`)

| # | Tính Năng Theo Tài Liệu | Trạng Thái | Backend | Frontend | Ghi Chú |
|---|------------------------|------------|---------|----------|--------|
| 26 | Đăng Tin Tuyển Dụng | ✅ | ✅ | ✅ | CRUD đầy đủ: tạo/sửa/xóa/gửi duyệt, tìm kiếm công khai với bộ lọc, danh sách việc làm của employer |
| 27 | Nộp Hồ Sơ | ⚠️ | ⚠️ | ✅ | Schema DB đã có, endpoint apply trả về stub |
| 28 | Lịch Phỏng Vấn | ✅ | ✅ | ✅ | Lịch, cập nhật, hủy — hoạt động đầy đủ |
| 29 | Quản Lý Offer | ⚠️ | ⚠️ | — | Bảng `recr_offers` đã có, không có endpoint tạo/cập nhật |
| 30 | Hồ Sơ Ứng Viên | ⚠️ | ⚠️ | ✅ | Endpoint đã có, trả về stub |
| 31 | Hồ Sơ Nhà Tuyển Dụng | ⚠️ | ⚠️ | ✅ | Endpoint đã có, trả về stub |
| 32 | Hồ Sơ HR | ⚠️ | ⚠️ | ✅ | Endpoint đã có, trả về stub |
| 33 | Đánh Giá | ✅ | ✅ | ✅ | Nộp, truy vấn, chống trùng lặp |
| 34 | Đánh Giá (Việc Làm) | ⚠️ | ⚠️ | ✅ | Schema DB đã có, endpoint trả về stub |
| 35 | Đánh Giá (Ứng Viên) | ⚠️ | ⚠️ | ✅ | Schema DB đã có, endpoint trả về stub |
| 36 | Quy Trình Tuyển Dụng | ⚠️ | ⚠️ | — | Endpoint đã có, trả về stub |
| 37 | Báo Cáo | ⚠️ | ⚠️ | — | Endpoint đã có, trả về stub |
| 38 | Gói Đăng Ký | ⚠️ | ⚠️ | — | Schema DB + endpoint đã có, tất cả trả về stub |
| 39 | Thống Kê Dashboard | ⚠️ | ⚠️ | ✅ | Endpoint đã có, trả về stub |
| 40 | Elasticsearch | ❌ | ❌ | — | Liệt kê trong tech stack, chưa kết nối |

---

## Module WALLET

| # | Tính Năng Theo Tài Liệu | Trạng Thái | Backend | Frontend | Ghi Chú |
|---|------------------------|------------|---------|----------|--------|
| 41 | Nạp Tiền Ví | ❌ | ❌ | ❌ | Không có wallet service |
| 42 | Rút Tiền Ví | ❌ | ❌ | ❌ | Không có wallet service |
| 43 | Chuyển Tiền Ví | ❌ | ❌ | ❌ | Không có wallet service |
| 44 | Thanh Toán Đăng Tin | ❌ | ❌ | ❌ | Không có wallet service |
| 45 | Thanh Toán Tin Nổi Bật | ❌ | ❌ | ❌ | Không có wallet service |
| 46 | Quản Lý Ví | ❌ | ❌ | ❌ | Không có wallet service |

---

## Module FILE (`apps/file/`)

| # | Tính Năng Theo Tài Liệu | Trạng Thái | Backend | Frontend | Ghi Chú |
|---|------------------------|------------|---------|----------|--------|
| 47 | Tải Lên Tệp Tin (Presigned URL) | ❌ | ❌ | ❌ | Không có file service |
| 48 | Tải Xuống Tệp Tin | ❌ | ❌ | ❌ | Không có file service |
| 49 | Liệt Kê Tệp Tin | ❌ | ❌ | ❌ | Không có file service |
| 50 | Xóa Tệp Tin (Soft Delete) | ❌ | ❌ | ❌ | Không có file service |
| 51 | Kiểm Soát Truy Cập (RBAC) | ❌ | ❌ | ❌ | Không có file service |
| 52 | Dọn Dẹp Tệp TẠM (Cron) | ❌ | ❌ | ❌ | Không có file service |
| 53 | Tải Lên CV/Hồ Sơ | ❌ | ❌ | ❌ | Không có file service |
| 54 | Tạo Thư Mục | ❌ | ❌ | ❌ | Không có file service |
| 55 | Tìm Kiếm Tệp Tin/Thư Mục | ❌ | ❌ | ❌ | Không có file service |
| 56 | Đổi Tên Tệp Tin/Thư Mục | ❌ | ❌ | ❌ | Không có file service |
| 57 | Tải Lên Nhiều Tệp Tin | ❌ | ❌ | ❌ | Không có file service |
| 58 | Sao Chép Tệp Tin | ❌ | ❌ | ❌ | Không có file service |
| 59 | Di Chuyển Tệp Tin | ❌ | ❌ | ❌ | Không có file service |
| 60 | Quản Lý Quyền Tệp Tin | ❌ | ❌ | ❌ | Không có file service |
| 61 | Ghi Nhật Ký Lịch Sử Truy Cập | ❌ | ❌ | ❌ | Không có file service |
| 62 | Theo Dõi Sử Dụng Lưu Trữ | ❌ | ❌ | ❌ | Không có file service |
| 63 | Quản Lý Hạn Ngạch Lưu Trữ | ❌ | ❌ | ❌ | Không có file service |
| 64 | Cấu Hình Chính Sách Lưu Trữ | ❌ | ❌ | ❌ | Không có file service |

---

## Frontend (`global-talent-acquisition/`)

| # | Tính Năng | Trạng Thái | Ghi Chú |
|---|----------|------------|--------|
| 65 | Danh Sách Việc Làm (Công Khai) | ✅ | Tìm kiếm hero, bộ lọc, sắp xếp, tabs |
| 66 | Trang Đăng Nhập | ✅ | Email, Google OAuth, chọn vai trò, modal quên mật khẩu |
| 67 | Trang Đăng Ký | ✅ | Tên, email, mật khẩu, vai trò |
| 68 | Dashboard Ứng Viên | ✅ | Thống kê, hoạt động gần đây |
| 69 | Việc Đã Nộp | ✅ | UI sẵn sàng, phụ thuộc backend |
| 70 | Việc Yêu Thích | ✅ | UI sẵn sàng |
| 71 | Hồ Sơ / CV | ✅ | UI sẵn sàng |
| 72 | Lịch Phỏng Vấn | ✅ | UI sẵn sàng |
| 73 | Dashboard Tổ Chức | ✅ | Thống kê, tổng quan |
| 74 | Quản Lý Việc Làm (Tổ Chức) | ✅ | UI tạo, liệt kê, chỉnh sửa |
| 75 | Quản Lý Ứng Viên (Tổ Chức) | ✅ | UI tìm kiếm, bộ lọc |
| 76 | Tạo Tổ Chức | ✅ | Form đa trường với xác thực |
| 77 | Máy Tính Lương | ✅ | Gross/net + bảo hiểm thất nghiệp |
| 78 | Ví Giới Thiệu | ✅ | UI theo dõi giới thiệu |

---

## Admin Panel (`onprem-admin/`)

| # | Tính Năng | Trạng Thái | Ghi Chú |
|---|----------|------------|--------|
| 79 | Đăng Nhập Admin | ✅ | |
| 80 | Thống Kê Dashboard | ✅ | |
| 81 | Quản Lý Người Dùng | ✅ | CRUD, chặn/bỏ chặn, phiên |
| 82 | Quản Lý Tổ Chức | ✅ | Liệt kê, tạo |
| 83 | Quản Lý Nhóm | ✅ | Liệt kê, tạo |
| 84 | Mẫu Email | ✅ | CRUD |
| 85 | Mẫu SMS | ✅ | CRUD |
| 86 | Thiết Lập | ✅ | API URLs, chế độ bảo trì |

---

## Sự Kiện Webhook (từ `modules.yaml`)

| # | Từ → Đến | Sự Kiện | Trạng Thái | Ghi Chú |
|---|-----------|---------|------------|--------|
| 87 | AUTH → SMS | `verification.requested` | ❌ | Không có tích hợp Twilio |
| 88 | AUTH → SMS | `verification.resent` | ❌ | Không có tích hợp Twilio |
| 89 | SMS → AUTH | `verification.delivered` | ❌ | Không có webhook callback |
| 90 | AUTH → LOG | `auth.event.logged` | ⚠️ | Logger đã có, chưa kết nối với sự kiện auth |
| 91 | SMS → LOG | `sms.event.logged` | ⚠️ | Log service đã có, chưa kết nối |
| 92 | AUTH → EMAIL | `verification.email.requested` | ⚠️ | Email service đã có, không có RabbitMQ publish từ auth |
| 93 | AUTH → EMAIL | `verification.email.resent` | ⚠️ | Tương tự trên |
| 94 | EMAIL → AUTH | `verification.email.delivered` | ❌ | Không có webhook callback |
| 95 | EMAIL → LOG | `email.event.logged` | ⚠️ | Log service đã có, chưa kết nối |
| 96 | RECR → EMAIL | `application.submitted` | ❌ | Không có phát sự kiện |
| 97 | RECR → EMAIL | `interview.scheduled` | ❌ | Không có phát sự kiện |
| 98 | RECR → EMAIL | `offer.sent` | ❌ | Không có phát sự kiện |
| 99 | RECR → LOG | `recruitment.event.logged` | ❌ | Không có phát sự kiện |
| 100 | WALLET → RECR | `wallet.payment.completed` | ❌ | Không có wallet service |
| 101 | WALLET → LOG | `wallet.event.logged` | ❌ | Không có wallet service |
| 102 | AUTH → WALLET | `user.registered` | ❌ | Không có wallet service |
| 103 | FILE → LOG | `file.event.logged` | ❌ | Không có file service |
| 104 | FILE → FILE | `file.deleted` | ❌ | Không có file service |
| 105 | FILE → FILE | `file.temp_cleanup` | ❌ | Không có file service |

---

## Tổng Hợp

| Hạng Mục | ✅ Đã Hiện Thực | ⚠️ Một Phần | ❌ Chưa Hiện Thực |
|----------|----------------|------------|-----------------|
| **Tính Năng Theo Tài Liệu** | 4 | 5 | **24** (WALLET 6 + FILE 18) |
| **Backend Services** | 5 (auth, email, sms, log, recr-jobs) | 1 (recr — các stub khác) | **2** (wallet, file) |
| **Frontend/UI** | 14 | — | — |
| **Admin Panel** | 8 | — | — |
| **Sự Kiện Webhook** | 0 | 3 | **16** |

### Khoảng Trống Ưu Tiên

1. **Module WALLET** — 6 tính năng hoàn toàn thiếu, cần NestJS service mới + schema DB + frontend
2. **Module FILE** — 18 tính năng hoàn toàn thiếu, cần NestJS service mới + schema DB + S3 integration + frontend
3. **Backend tuyển dụng** — nộp hồ sơ, hồ sơ ứng viên/nhà tuyển dụng, quy trình, báo cáo, gói đăng ký vẫn trả về stub
4. **Sự kiện Webhook** — 16/19 sự kiện chưa kết nối, services đã có nhưng không publish/subscribe
5. **Tích hợp Twilio** — SMS service chỉ gửi qua Discord
6. **Elasticsearch** — liệt kê trong tech stack cho tìm kiếm tuyển dụng, chưa kết nối
7. **Đặt lại mật khẩu (điện thoại)** — đặt lại qua email đã hoạt động; FR-006 OTP qua SMS chưa hiện thực
