# BẢN TỰ NGHIỆM CÁ NHÂN (REFLECTION)

* **Học viên:** Đặng Đức Hoà
* **Vai trò trong nhóm:** Tester & Viết tài liệu (Documentation)
* **Dự án:** Veuron - Hệ thống Học tập Chủ động qua Mindmap & Feynman Agent

---

## 1. Công việc đã thực hiện
* **Lập kế hoạch & Thực hiện kiểm thử (QA/Testing):**
  * Xây dựng danh sách kịch bản kiểm thử (Test Cases) kiểm tra toàn bộ tính năng cốt lõi: kéo thả node, pan/zoom canvas, hoạt động của nút Fit View `[ ]`, phản hồi của công tắc active recall.
  * Kiểm thử chất lượng hội thoại của Feynman Agent: gửi các câu trả lời đúng, sai, lạc đề, hoặc cố tình tấn công prompt (prompt injection) để kiểm thử mức độ nhạy bén của Guardrails hệ thống.
* **Viết Tài liệu kỹ thuật:**
  * Soạn thảo đặc tả kỹ thuật dự án (`spec.md`) mô tả chi tiết kiến trúc sản phẩm, sơ đồ hoạt động của hệ thống và giải thuật Spaced Repetition.
  * Viết tài liệu hướng dẫn sử dụng sản phẩm và biên tập tài liệu nhóm trong file `README.md`.
* **Hỗ trợ thiết kế Slide trình thuyết trình:** Trình bày rõ nét các lát cắt tính năng (features slices) và kết quả thử nghiệm thực tế phục vụ cho CP6 Demo.

## 2. Khó khăn gặp phải & Cách giải quyết
* **Phát hiện lỗi hiển thị Mindmap trên các thiết bị màn hình nhỏ:** Khi co nhỏ trình duyệt, Mindmap bị lệch ra ngoài mép và chatbot Minh đè lên các node bên phải.
  * *Giải pháp:* Ghi nhận lỗi chi tiết, quay video minh chứng (screenshots) gửi cho thành viên làm Frontend để cập nhật CSS Responsive và bổ sung giải thuật tính toán padding offset thông minh (chừa 350px lề phải cho chatbot).
* **Đánh giá các kịch bản trả lời tự do của người dùng:** Dữ liệu nhập vào của học sinh vô cùng đa dạng, AI đánh giá đôi khi bị quá nghiêm khắc hoặc quá lỏng lẻo.
  * *Giải pháp:* Tiến hành chạy thử nhiều lượt (dry runs) với các câu trả lời mẫu khác nhau để tinh chỉnh prompt hệ thống của Feynman Agent ở backend, cân bằng thang điểm đánh giá đạt/không đạt.

## 3. Bài học kinh nghiệm rút ra
* Hiểu sâu sắc về quy trình kiểm thử một ứng dụng EdTech tích hợp Generative AI, đặc biệt là cách kiểm định chất lượng phản hồi phi cấu trúc của chatbot.
* Nâng cao kỹ năng viết tài liệu kỹ thuật chuẩn xác, rõ ràng, giúp đội phát triển dễ dàng hiểu được các lỗi nghiệp vụ và sửa chữa kịp thời.
