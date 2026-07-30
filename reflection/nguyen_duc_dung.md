# BẢN TỰ NGHIỆM CÁ NHÂN (REFLECTION)

* **Học viên:** Nguyễn Đức Dũng
* **Vai trò trong nhóm:** Code Backend & Thiết kế API
* **Dự án:** Veuron - Hệ thống Học tập Chủ động qua Mindmap & Feynman Agent

---

## 1. Công việc đã thực hiện
* **Thiết kế & Xây dựng RESTful API:** Phát triển hệ thống API bằng FastAPI (Python) cung cấp các endpoint chính:
  * Lấy cấu trúc Mindmap theo từng ngày học (`/api/graphs/{day_id}`).
  * Đánh giá câu trả lời active recall và mở rộng nhánh con (`/api/graphs/{day_id}/expand`).
* **Thuật toán sắp xếp sơ đồ (Graph Layout Algorithm):** Thiết kế thuật toán sắp xếp sơ đồ ngang tự động dạng cây phân cấp (Hierarchical Tree Layout) tính toán toạ độ `(x, y)` động của từng node dựa vào chiều cao của các cây con (subtree heights bottom-up) và khoảng cách giãn lề ngang/dọc, tránh việc các box đè lên nhau.
* **Tích hợp Feynman Evaluation Engine:** Thiết kế logic kiểm duyệt và chấm điểm câu trả lời của người dùng thông qua mô hình AI, quyết định xem người học đã thực sự hiểu bài hay cần gợi ý giải thích thêm để mở khóa bài học mới.

## 2. Khó khăn gặp phải & Cách giải quyết
* **Vấn đề lệch toạ độ và chồng lấn box:** Chiều cao của các card chứa nhiều chữ thay đổi động dẫn đến việc các box dễ đè lên nhau.
  * *Giải pháp:* Tăng chiều cao danh nghĩa mặc định của node trong thuật toán layout từ `88px` lên `150px` (box nhánh) và `180px` (box gốc), đồng bộ hoá chính xác trị số này giữa frontend và backend giúp thuật toán sắp xếp tính toán toạ độ trục dọc `y` giãn cách vô cùng cân đối.
* **Đồng bộ hóa dữ liệu real-time:** Mở rộng các node động khi người học trả lời đúng câu hỏi Feynman.
  * *Giải pháp:* Thiết kế cấu trúc graph phẳng (flattened graph) trả về danh sách các node và edges bổ sung, giúp frontend dễ dàng cập nhật nối tiếp vào state hiện tại mà không phải tải lại toàn bộ sơ đồ.

## 3. Bài học kinh nghiệm rút ra
* Hiểu sâu hơn về thiết kế cấu trúc dữ liệu Graph trong các bài toán thực tế, đặc biệt là cách tính toán toạ độ cây trực quan hóa.
* Cải thiện kỹ năng thiết kế API tối giản nhưng linh hoạt, xử lý được các logic bất đồng bộ và đồng bộ hóa chặt chẽ số liệu cấu hình với đội phát triển giao diện (Frontend).
