# BA Documentation Framework

Framework tạo tài liệu kỹ thuật (SRS, TDS, Thiết Kế CSDL, API Spec) với sơ đồ PlantUML. Output là HTML in ấn tối ưu cho giấy A4.

## Yêu Cầu Ban Đầu

- [Docker](https://docs.docker.com/get-docker/) (để chạy PlantUML generate sơ đồ)
- [GNU Make](https://www.gnu.org/software/make/) (macOS: `xcode-select --install`)

## Bắt Đầu Nhanh

```bash
# 1. Tải ảnh PlantUML Docker (cần 1 lần)
make pull

# 2. Xây dựng tất cả (sơ đồ + HTML)
make build-all

# 3. Chạy server và xem trong trình duyệt
make serve
```

Sau đó mở [http://localhost:8080](http://localhost:8080) — nhấn vào bất kỳ module nào để xem tài liệu (SRS, TDS, Thiết Kế CSDL, API Spec).

## Xem Tài Liệu

### `make serve` (khuyên dùng)

```bash
make serve
```

Lệnh này xây dựng lại tài liệu và chạy server cục bộ tại **http://localhost:8080**. Trang index liệt kê tất cả module — nhấn tên module để xem tài liệu, sau đó nhấn bất kỳ tài liệu nào để xem.

Để dừng server, nhấn `Ctrl+C`.

### `make open`

```bash
make open
```

Xây dựng tài liệu và mở `modules/index.html` trực tiếp trong trình duyệt mặc định. Xem nhanh — không cần server.

### Xuất PDF

1. Mở bất kỳ file HTML nào trong trình duyệt (qua `make serve` hoặc `make open`)
2. Nhấn `Cmd+P` (macOS) hoặc `Ctrl+P` (Windows/Linux)
3. Chọn "Save as PDF"
4. CSS được tối ưu in ấn cho giấy A4

## Đầu Ra

Mỗi module tạo ra 4 tài liệu:

| Tài Liệu | Nội Dung |
|----------|----------|
| `srs.html` | Yêu cầu chức năng, use case với sơ đồ activity/sequence, NFR, truy ngước |
| `tds.html` | Thiết kế kỹ thuật, kiến trúc, API endpoint, luồng tích hợp |
| `database-design.html` | ERD, schema bảng, index, script migration |
| `api-technical-spec.html` | API endpoint với ví dụ request/response, mã lỗi |

### Các Module

| Module | Mô Tả | Cơ Sở Dữ Liệu |
|--------|-------|---------------|
| AUTH | Tài khoản người dùng, đăng nhập, vai trò, phiên làm việc, xác minh | auth_db |
| SMS | Gửi SMS, nhật ký, kiểm toán | sms_db |
| EMAIL | Thông báo email, mẫu, lịch sử gửi | email_db |
| RECR | Quản lý tuyển dụng: tin tuyển dụng, ứng viên, phỏng vấn, offer | recr_db |
| WALLET | Ví điện tử: nạp tiền, rút tiền, chuyển khoản, thanh toán | wallet_db |
| LOG | Nhật ký ứng dụng, kiểm toán, theo dõi lỗi | OpenSearch |
| FILE | Quản lý tệp tin: tải lên/xuống, thư mục, quyền, lưu trữ S3 | file_db |

## Lệnh Xây Dựng

| Lệnh | Mô Tả |
|------|-------|
| `make help` | Hiển thị tất cả lệnh khả dụng |
| `make pull` | Tải ảnh PlantUML Docker (cần 1 lần) |
| `make build-all` | Generate tất cả sơ đồ + xây dựng HTML |
| `make build-docs` | Chỉ xây dựng HTML (bỏ qua generate sơ đồ) |
| `make open` | Xây dựng và mở `modules/index.html` trong trình duyệt |
| `make serve` | Chạy server cục bộ tại http://localhost:8080 |
| `make clean` | Xóa tất cả file đã generate |
| `make watch` | Tự động rebuild khi file thay đổi (cần `fswatch`) |

### Quy Trình Phát Triển

Sử dụng `make watch` cùng với `make serve` để chỉnh sửa trực tiếp:

```bash
# Terminal 1: chạy server tài liệu
make serve

# Terminal 2: theo dõi thay đổi và tự động rebuild
make watch
```

Chỉnh sửa bất kỳ file `.puml` hoặc `src/*.html` nào — thay đổi được rebuild tự động và hiển thị khi refresh.

### Theo Từng Module

```bash
make generate MODULE=auth TYPE=erd       # Module + loại sơ đồ đơn lẻ
make generate-erd-auth                    # Chỉ ERD của AUTH
make generate-erd-all                     # Tất cả ERD
make generate-all-modules                 # Tất cả module, tất cả loại
```

## Cấu Trúc Dự Án

```
ba/
├── Makefile                       # Lệnh xây dựng
├── scripts/
│   ├── generate.sh                # PlantUML -> PNG images
│   └── build-docs.sh              # Templates -> HTML docs
│
├── templates/                     # Mẫu nguồn
│   ├── style.css                  # CSS tối ưu in ấn
│   ├── srs.html                   # Mẫu SRS
│   ├── tds.html                   # Mẫu TDS
│   ├── database-design.html       # Mẫu thiết kế CSDL
│   ├── api-technical-spec.html    # Mẫu API spec
│   └── erd-*.puml                 # Mẫu ERD PlantUML
│
├── modules/                       # Output module
│   ├── index.html                 # Trang chủ (bắt đầu từ đây)
│   ├── auth/                      # Tài liệu + sơ đồ module AUTH
│   ├── sms/                       # Tài liệu + sơ đồ module SMS
│   ├── email/                     # Tài liệu + sơ đồ module EMAIL
│   ├── recr/                      # Tài liệu + sơ đồ module RECR
│   ├── wallet/                    # Tài liệu + sơ đồ module WALLET
│   ├── log/                       # Tài liệu + sơ đồ module LOG
│   ├── file/                      # Tài liệu + sơ đồ module FILE
│   └── style.css                  # Stylesheet chung
│
└── CLAUDE.md                      # Quy tắc framework
```

## Tùy Chỉnh Tài Liệu

Để ghi đè mẫu HTML của module, tạo file trong `modules/<code>/src/`:

```
modules/auth/src/srs.html          # Ghi đè templates/srs.html cho AUTH
modules/auth/src/tds.html          # Ghi đè templates/tds.html cho AUTH
```

Script xây dựng sẽ sử dụng file tùy chỉnh khi tồn tại, nếu không sẽ dùng mẫu mặc định.

## Các Loại Sơ Đồ

| Loại | Dùng Cho | Vị Trí File |
|------|----------|-------------|
| Use Case | Tương tác Actor-Hệ Thống | `diagrams/usecase/` |
| Activity | Luồng quy trình (không swimlane) | `diagrams/activity/` |
| Sequence | Tích hợp giữa các service | `diagrams/sequence/` |
| ERD | Mô hình dữ liệu (entity, relationship) | `diagrams/erd/` hoặc `templates/erd-*.puml` |
| Component | Các thành phần hệ thống | `diagrams/component/` |
| Architecture | C4 Level 1 context | `templates/architecture-system.puml` |

## Làm Việc Với Claude Code

Mô tả bạn muốn làm gì, hoặc chạy `/ba-guide`. Claude sẽ kiểm tra các module hiện có, hỏi bạn hai câu hỏi (business là gì, use case mới là gì), phân tích ảnh hưởng, và xử lý tất cả.

## Khắc Phục Sự Cố

**"docker: command not found"** — Cài đặt [Docker](https://docs.docker.com/get-docker/) và đảm bảo nó đang chạy.

**"make: command not found"** — Cài đặt Make: `xcode-select --install` (macOS) hoặc `sudo apt install make` (Linux).

**Sơ đồ không cập nhật** — Chạy `make clean` rồi `make build-all` để generate lại từ đầu.

**Lỗi build trên Linux** — Script xây dựng sử dụng `sed -i ''` của macOS. Trên Linux, chỉnh sửa `scripts/build-docs.sh` để sử dụng `sed -i` (không có tham số string rỗng).
