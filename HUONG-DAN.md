# Hướng Dẫn Sử Dụng Framework BA Documentation

Framework tạo tài liệu kỹ thuật (SRS, TDS, Thiết Kế CSDL, API Spec) với sơ đồ PlantUML. Output là HTML in ấn tối ưu cho giấy A4.

---

## Yêu Cầu Ban Đầu

- Docker (để chạy PlantUML generate sơ đồ)
- Git
- Trình soạn thảo (VS Code recommended)
- Trình duyệt web (để xem HTML, xuất PDF)

---

## Cài Đặt Lần Đầu

```bash
make pull          # Tải ảnh PlantUML Docker (cần 1 lần)
make help          # Kiểm tra tất cả lệnh khả dụng
```

---

## Cách Hoạt Động

Mô tả bạn muốn làm gì, hoặc chạy `/ba-guide`. Claude sẽ:

1. **Kiểm tra module đã có** — đọc `modules.yaml` để biết những gì đã tồn tại
2. **Hỏi về business** — bạn mô tả module hoặc thay đổi
3. **Hỏi về use case mới** — bạn mô tả yêu cầu và use case
4. **Phân tích ảnh hưởng** — Claude kiểm tra phụ thuộc và nơi bạn cần cập nhật

Sau đó Claude xử lý tất cả — cập nhật modules.yaml, tạo/sửa tài liệu, generate sơ đồ, và build.

---

## Quy Trình Làm Việc (Workflow)

```
1. Định Nghĩa Module (modules.yaml)
   ↓
2. Sơ Đồ Use Case (ai sử dụng hệ thống, làm gì)
   ↓
3. ERD (dữ liệu hệ thống lưu giữ)
   ↓
4. SRS (yêu cầu chính thức với ID)
   ↓
5. Sơ Đồ Sequence (các module giao tiếp như thế nào)
   ↓
6. TDS (thiết kế kỹ thuật)
   ↓
7. Thiết Kế CSDL (schema, index, migration)
   ↓
8. API Spec (endpoint, request/response)
```

---

## Cấu Trúc Thư Mục

```
modules.yaml                              # Định nghĩa module (sửa file này trước)
templates/                                # Mẫu tài liệu
templates/erd-<database>.puml            # ERD theo từng cơ sở dữ liệu
templates/style.css                       # Stylesheet chung

modules/<code>/
  diagrams/                              # Nguồn PlantUML
    erd/                                 # Sơ đồ Entity-Relationship
    sequence/                            # Sơ đồ Sequence
    usecase/                             # Sơ đồ Use Case
    activity/                            # Sơ đồ Activity
    class/                               # Sơ đồ Class
  images/                                # Sơ đồ đã generate (tự động)
  src/                                   # File HTML tùy chỉnh (nguồn chính)
    srs.html
    tds.html
    database-design.html
    api-technical-spec.html
  images/                                # Ảnh đã generate
modules/dist/                            # Output HTML (gitignored)
```

---

## Các Lệnh Xây Dựng

```bash
# Tổng hợp
make build-all     # Generate tất cả sơ đồ + build HTML
make open          # Build và mở trang chủ trong trình duyệt
make clean         # Xóa tất cả file đã generate
make watch         # Tự động rebuild khi file thay đổi

# Theo từng module
make generate MODULE=auth TYPE=erd
make generate-erd-all
make generate-all-modules

# Kiểm tra
make help          # Hiển thị tất cả lệnh
```

---

## Hệ Thống Module

Module được định nghĩa trong `modules.yaml`. Mỗi module có 4 tài liệu:

| Tài Liệu | Mô Tả | ID Yêu Cầu |
|----------|-------|------------|
| **SRS** | Phủ	chứng yêu cầu phần mềm | FR-xxx, NFR-xxx |
| **TDS** | Phủ	chứng thiết kế kỹ thuật | Truy ngước SRS |
| **Database Design** | Thiết kế cơ sở dữ liệu | Truy ngước SRS |
| **API Spec** | Phủ	chứng API | Truy ngước SRS |

### Module Hiện Có

| Mã | Tên | Cơ Sở Dữ Liệu | Phụ Thuộc |
|----|-----|---------------|-----------|
| AUTH | Xác Thực | auth_db | SMS, EMAIL, LOG |
| SMS | SMS Service | sms_db | AUTH |
| EMAIL | Email Notification | email_db | — |
| RECR | Tuyển Dụng | recr_db | AUTH, LOG |
| WALLET | Ví Điện Tử | wallet_db | AUTH, LOG |
| LOG | Logger | opensearch | AUTH |

---

## Quy Tắc Đặt Tên

### Bảng

Tất cả bảng phải theo format: `<tên_ngắn_của_project>_<tên_bảng>`

| Sai | Đúng (project = auth) |
|-----|----------------------|
| users | auth_users |
| sessions | auth_sessions |
| roles | auth_roles |

### ID Yêu Cầu

| Tiền Tố | Loại | Ví Dụ |
|---------|------|-------|
| FR- | Yêu cầu chức năng | FR-001 |
| NFR- | Yêu cầu phi chức năng | NFR-001 |
| UC- | Use Case | UC-01 |
| DR- | Yêu cầu dữ liệu | DR-001 |
| IR- | Yêu cầu tích hợp | IR-001 |

### Mã Module

| Mã | Tên | Cơ Sở Dữ Liệu |
|----|-----|---------------|
| AUTH | Xác Thực | auth_db |
| SMS | SMS Service | sms_db |
| EMAIL | Email Notification | email_db |
| LOG | Logger | opensearch |

---

## Cấu Trúc Tài Liệu

### SRS (Phủ Chứng Yêu Cầu Phần Mềm)

Mỗi tài liệu SRS PHẢI có:

1. **Logo Header** — logo AgileTech + PVI
2. **Cover Page** — tên tài liệu, module, ngày, tác giả
3. **Table of Contents** — mục lục với link đến từng phần
4. **Phần 1: Giới Thiệu** — mục đích, phạm vi, phụ thuộc module, định nghĩa
5. **Phần 2: Tổng Quan Module** — mô tả module, sơ đồ Use Case
6. **Phần 3: Yêu Chức Năng** — bảng với ID FR-xxx, mô tả, mức ưu tiên
7. **Phần 4: Mô Hình Dữ Liệu** — tổng quan bảng
8. **Phần 5: API Specification** — tổng quan endpoint
9. **Phần 6: Tích Hợp** — giao tiếp giữa module
10. **Phần 7: Yêu Cầu Phi Chức Năng** — ID NFR-xxx
11. **Phần 8: Ma Trận Truy Ngước** — yêu cầu → thiết kế → hiện thực

### TDS (Phủ Chứng Thiết Kế Kỹ Thuật)

Mỗi tài liệu TDS PHẢI có:

1. **Logo Header + Cover Page + TOC**
2. **Phần 1: Giới Thiệu** — mục đích, tham chiếu SRS, yêu cầu được giải quyết
3. **Phần 2: Kiến Trúc** — tổng quan kiến trúc, quyết định thiết kế chính
4. **Phần 3: Thiết Kế Thành Phẩn** — class, interface, service
5. **Phần 4: Kiến Trúc Dữ Liệu** — model, schema, relationship
6. **Phần 5: Thiết Kế API** — endpoint, request/response
7. **Phần 6: Thiết Kế Bảo Mật** — authentication, authorization
8. **Phần 7: Tích Hợp** — sơ đồ Activity + Sequence
9. **Phần 8: Xử Lý Lỗi** — error handling strategy
10. **Phần 9: Tổng Hợp Truy Ngước** — yêu cầu → thiết kế

### Database Design

Mỗi tài liệu Database PHẢI có:

1. **Logo Header + Cover Page + TOC**
2. **Phần 1: Giới Thiệu** — mục đích, yêu cầu được giải quyết, sơ đồ ERD
3. **Phần 2: Thiết Kế Schema** — chỉ số strategy, bảng theo module
4. **Phần 3: Index** — index theo từng bảng
5. **Phần 4: Migration** — scripts di chuyển
6. **Phần 5: Từ Điển Dữ Liệu** — mô tả từng cột
7. **Phần 6: Sao Lưu & Phục Hồi** — backup strategy
8. **Phần 7: Tối Ưu Hóa** — performance tuning

### API Spec (Phủ Chứng API)

Mỗi tài liệu API PHẢI có:

1. **Logo Header + Cover Page + TOC**
2. **Phần 1: Giới Thiệu** — yêu cầu được giải quyết, nguyên tắc API, xác thực
3. **Phần 2: Định Dạng Response** — standard response format
4. **Phần 3: Mã Lỗi** — error codes
5. **Phần 4: Giới Hạn Lượt Truy Cập** — rate limiting
6. **Phần 5: Endpoints** — chi tiết từng endpoint với request/response
7. **Phần 6: Phân Trang** — pagination
8. **Phần 7: Webhook Events** — event between modules
9. **Phần 8: Changelog** — lịch sử thay đổi

---

## Sơ Đồ (Diagrams)

### Thứ Tự Hiển Thị Trong Tài Liệu

1. **Activity Diagram** (luồng quy trình) — dùng trước
2. **Sequence Diagram** (luồng tích hợp) — dùng sau

### Các Loại Sơ Đồ

| Loại | Dùng Cho |
|------|----------|
| Activity | Luồng quy trình (đơn giản, KHÔNG swimlane) |
| Sequence | Giao tiếp giữa các service |
| Use Case | Tương tác Actor-Hệ Thống |
| ERD | Mô hình dữ liệu (entity, relationship) |
| Class | Mô hình domain |
| Component | Các thành phần hệ thống |
| Deployment | Cơ sở hạ tầng |
| Architecture | C4 Level 1 |

### Quy Tắc Activity Diagram

- **KHÔNG swimlane** — tạo cột trùng lặp
- Sử dụng luồng tuần tự với hình thoi cho quyết định
- Giữ sơ đồ đơn giản và dễ đọc

---

## Truy Ngước (Traceability)

Tất cả tài liệu kỹ thuật PHẢI truy ngước lại SRS. Đây là quy tắc bắt buộc.

Mỗi yêu cầu trong SRS có ID (FR-xxx, NFR-xxx). Mỗi tài liệu kỹ thuật (TDS, Database Design, API Spec) PHẢI chỉ rõ yêu cầu nào nó giải quyết.

Ví dụ:
```
TDS Phần 3.2 → Giải quyết FR-001 (Đăng Ký Tài Khoản)
Database Design Bảng auth_users → Phục vụ FR-001
API POST /auth/register → Thuộc FR-001
```

---

## Tích Hợp Giữa Module

Các module giao tiếp nhau qua webhook event. Định nghĩa trong `modules.yaml` phần `webhooks`.

Ví dụ:
```
AUTH → SMS: verification.requested (gửi OTP)
AUTH → EMAIL: verification.email.requested (gửi email OTP)
RECR → EMAIL: application.submitted (gửi email xác nhận)
WALLET → RECR: wallet.payment.completed (xác nhận thanh toán)
```

Mỗi event gồm:
- `from`: Module gửi
- `to`: Module nhận
- `event`: Tên sự kiện
- `protocol`: RabbitMQ / Webhook
- `queue`: Tên queue
- `payload`: Cấu trúc dữ liệu

---

## Xuất PDF

Mở bất kỳ file HTML nào trong trình duyệt > Cmd+P > Save as PDF

---

## Chỉ Dẫn Commit

```bash
git add modules/<code>/
git commit -m "docs(<code>): cập nhật <nội dung thay đổi>"
```

Format commit message:
- `feat(module): thêm feature mới`
- `fix(module): sửa bug`
- `docs(module): cập nhật tài liệu`
- `refactor(module): tinh chỉnh lại`

---

## Sai Lầm Phổ Biến

1. **Thiếu ID yêu cầu** — Mỗi yêu cầu PHẢI có FR-xxx hoặc NFR-xxx
2. **Sai tên bảng** — Luôn sử dụng format `<project>_<table>`
3. **Foreign key truy ngang cơ sở dữ liệu** — KHÔNG được tham chiếu bảng ở cơ sở dữ liệu khác
4. **Thiếu truy ngước** — Mỗi tài liệu kỹ thuật PHẢI truy ngước lại SRS
5. **Không có TOC hoặc logo header** — Mỗi trang HTML cần cả hai
6. **Activity diagram có swimlane** — Không được dùng swimlane

---

## Cấu Hình Module Mới

Để thêm module mới vào hệ thống:

1. Thêm module vào `modules.yaml` với code, tên, cơ sở dữ liệu, bảng, phụ thuộc
2. Tạo `modules/<code>/diagrams/` với file PlantUML
3. Tạo `modules/<code>/src/` với file HTML tùy chỉnh (srs.html, tds.html, database-design.html, api-technical-spec.html)
4. Thêm ERD module vào `templates/erd-<database>.puml`
5. Chạy `make generate MODULE=<code>` rồi `make build-docs`

---

## Định Nghĩa File Quan Trọng

| File | Mục Đích |
|------|----------|
| `modules.yaml` | Định nghĩa module — nguồn chính thông tin |
| `templates/style.css` | Stylesheet chung cho tất cả HTML |
| `templates/module-srs.html` | Mẫu SRS |
| `templates/module-tds.html` | Mẫu TDS |
| `templates/module-database-design.html` | Mẫu Database Design |
| `templates/module-api-spec.html` | Mẫu API Spec |
| `scripts/generate.sh` | Script generate sơ đồ PlantUML → PNG |
| `scripts/build-docs.sh` | Script build HTML từ mẫu |

---

## Ví Dụ Workflow Đầy Đủ

**Tình huống**: Thêm tính năng "Quên Mật Khẩu" vào module AUTH.

```
1. Sửa modules.yaml → thêm feature "Password Reset" với modules [AUTH, EMAIL, LOG]
2. Tạo sơ đồ Use Case → UC-03: User Resets Password
3. Tạo sơ đồ Activity → luồng quên mật khẩu
4. Tạo sơ đồ Sequence → AUTH → EMAIL → LOG
5. Cập nhật SRS thêm FR-010: Password Reset
6. Cập nhật TDS thêm thiết kế password reset
7. Cập nhật Database Design thêm bảng password_reset_tokens
8. Cập nhật API Spec thêm endpoint POST /auth/password-reset
9. Tạo sơ đồ ERD thêm bảng password_reset_tokens
10. Chạy make build-all để generate lại
```

---

## Lệnh Claude

| Lệnh | Mục Đích |
|------|----------|
| `/ba-structure` | Xem cấu trúc thư mục và workflow |
| `/ba-setup` | Hướng dẫn cài đặt từng bước |
| `/ba-guide` | Hướng dẫn interactive |
| `/ba-trace` | Kiểm tra truy ngước và mapping module |
