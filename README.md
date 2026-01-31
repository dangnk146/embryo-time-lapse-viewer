# Embryo Time-lapse Viewer

Ứng dụng web chuyên dụng để xem và phân tích video/hình ảnh time-lapse của phôi (embryo). Cho phép người dùng tải lên chuỗi hình ảnh và dữ liệu hình thái học (morphokinetic data) để theo dõi các giai đoạn phát triển của phôi.

## 🚀 Tính năng chính

- **Phát chuỗi hình ảnh**: Xem chuỗi hình ảnh phôi với tốc độ tùy chỉnh (0.5x, 1x, 2x, 5x).
- **Phân đoạn giai đoạn (Morphokinetic Stages)**: Hiển thị các giai đoạn phát triển (như t2, t3, t4, tB, ...) trực tiếp trên timeline.
- **Tải dữ liệu tùy chỉnh**:
  - Hỗ trợ tải lên chuỗi hình ảnh từ máy tính.
  - Hỗ trợ tải lên file CSV chứa thông tin các giai đoạn phát triển.
- **Timeline tương tác**: Dễ dàng kéo thả hoặc nhấp để di chuyển đến khung hình (frame) mong muốn.
- **Giao diện hiện đại**: Tối ưu cho việc quan sát với chế độ tối (dark mode) và các chỉ báo màu sắc động.

## 🛠️ Công nghệ sử dụng

- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: Radix UI, Lucide React
- **Ngôn ngữ**: TypeScript

## 📂 Cấu trúc dự án

- `/app`: Chứa các route và layout chính của ứng dụng.
- `/components`: Các thành phần giao diện như `EmbryoViewer`, `TimelineBar`, `PlaybackControls`.
- `/lib`: Chứa các định nghĩa kiểu dữ liệu và logic xử lý dữ liệu.
- `/public`: Các tài nguyên tĩnh (icon, placeholder).

## 🏃 Hướng dẫn chạy dự án

### Yêu cầu hệ thống
- Node.js 18.x trở lên.
- Đã cài đặt `pnpm` (khuyên dùng) hoặc `npm`/`yarn`.

### Các bước thực hiện

1. **Cài đặt dependencies**:
   ```bash
   pnpm install
   # hoặc
   npm install
   ```

2. **Chạy ở chế độ phát triển (Development)**:
   ```bash
   pnpm dev
   # hoặc
   npm run dev
   ```
   Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt để xem kết quả.

3. **Xây dựng bản sản xuất (Production build)**:
   ```bash
   pnpm build
   pnpm start
   ```

## 📊 Định dạng file CSV

Để hiển thị các giai đoạn phát triển trên timeline, bạn cần tải lên file CSV với định dạng sau:

```csv
Stage Name, Start Frame, End Frame, Timestamp (optional)
```

**Ví dụ:**
```csv
t2, 10, 25, 26.5h
t3, 26, 40, 32.1h
t4, 41, 60, 38.4h
tB, 120, 180, 105.2h
```

- **Stage Name**: Tên giai đoạn (ví dụ: t2, tPN, Morula).
- **Start Frame**: Khung hình bắt đầu.
- **End Frame**: Khung hình kết thúc.
- **Timestamp**: (Tùy chọn) Thời gian thực tế diễn ra giai đoạn đó.

## 📝 Ghi chú
- Ứng dụng này xử lý hình ảnh trực tiếp trên trình duyệt, dữ liệu của bạn không được tải lên bất kỳ máy chủ nào, đảm bảo tính bảo mật và riêng tư.
- Đảm bảo các hình ảnh được tải lên có tên theo thứ tự để ứng dụng hiển thị đúng trình tự thời gian.
