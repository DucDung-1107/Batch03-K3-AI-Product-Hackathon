# BẢN TỰ NGHIỆM CÁ NHÂN (REFLECTION)

* **Học viên:** Lăng Thị Phương Huế
* **Vai trò trong nhóm:** Code Frontend & UX/UI Developer
* **Dự án:** Veuron - Hệ thống Học tập Chủ động qua Mindmap & Feynman Agent

---

## 1. Công việc đã thực hiện
* **Phát triển giao diện React:** Xây dựng ứng dụng đơn trang (SPA) bằng React + Vite, tối ưu hóa giao diện Mindmap trực quan, vẽ các đường kết nối Bezier mượt mà nối các node bài học.
* **Tương tác Canvas linh hoạt:**
  * Lập trình tính năng kéo thả di chuyển vị trí node tùy biến.
  * Tích hợp tính năng Zoom/Pan bằng chuột và cử chỉ trackpad.
  * Thiết kế nút Fit View `[ ]` để tự động căn chỉnh sơ đồ vừa khít màn hình.
* **Thiết kế UI/UX & Tương tác Mascot:**
  * Thiết kế thanh Dashboard điều khiển góc nhìn và công tắc bật/tắt chế độ Active Recall (Switch trượt iOS).
  * Xây dựng Panel chatbot Feynman Agent (Minh) có khả năng co giãn kích thước động, tích hợp Mascot chú robot học sinh hoạt họa SVG.
  * Tinh chỉnh Typography và phân cấp thị giác (Drop Shadow, viền trái pastel phân biệt nhánh bài học).

## 2. Khó khăn gặp phải & Cách giải quyết
* **Mindmap bị trôi và hiển thị sai lệch khi mới load trang (Initial Render):** viewport đo đạc kích thước canvas lúc DOM chưa sẵn sàng, dẫn đến bị sai tâm.
  * *Giải pháp:* Sử dụng `ResizeObserver` kết hợp với `requestAnimationFrame` để lấy kích thước khung canvas chuẩn xác sau khi render, từ đó tính toán chính xác toạ độ lề trái `paddingLeft = 60px` và lề phải `paddingRight = panelWidth + 50px` để tránh bị Panel AI che khuất, đồng thời nâng Mindmap lên `70px` để các node dưới cùng hiển thị trọn vẹn.
* **Lỗi cuộn trang ở tab Lịch ôn và Thư viện:** Do cấu trúc CSS ẩn phần tràn (`overflow: hidden`) để phục vụ Mindmap, khiến các trang khác bị khóa cứng cuộn chuột.
  * *Giải pháp:* Thiết lập thuộc tính `overflow-y: auto` và `height: 100%` riêng cho container `.page-main` của các tab này, đảm bảo phân tách hoàn toàn phạm vi hoạt động của thanh cuộn với canvas.

## 3. Bài học kinh nghiệm rút ra
* Nắm vững kỹ thuật lập trình tương tác đồ họa (Canvas/SVG) trong React, cách quản lý và tối ưu hóa hiệu năng render hàng trăm phần tử cùng lúc.
* Học được cách xử lý các vấn đề giao diện phức tạp liên quan đến tính toán kích thước động, đồng bộ hóa toạ độ giữa CSS transform và thuật toán định vị học máy của hệ thống.
