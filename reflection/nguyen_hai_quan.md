# BẢN TỰ NGHIỆM CÁ NHÂN (REFLECTION)

* **Học viên:** Nguyễn Hải Quân
* **Vai trò trong nhóm:** Research & Chuẩn bị tài liệu/Dữ liệu học tập
* **Dự án:** Veuron - Hệ thống Học tập Chủ động qua Mindmap & Feynman Agent

---

## 1. Công việc đã thực hiện
* **Thiết kế Lộ trình học tập (Day 1 - Day 5):** Nghiên cứu và xây dựng chương trình giảng dạy 5 ngày thực chiến về Trí tuệ nhân tạo (AI) và Mô hình ngôn ngữ lớn (LLM):
  * **Day 1:** AI & LLM Foundation.
  * **Day 2:** Prompt Engineering.
  * **Day 3:** Agentic AI & ReAct.
  * **Day 4:** Spaced Recall & Evaluation.
  * **Day 5:** Custom Tools & RAG.
* **Chuẩn bị Dữ liệu Kiến thức (Data Pack):** Soạn thảo toàn bộ nội dung chi tiết bài giảng, tóm tắt bài học (summary), câu hỏi gợi ý (clues) và các từ khóa chủ chốt phục vụ cho việc xây dựng các nút (nodes) trên Mindmap.
* **Xây dựng kịch bản hội thoại Feynman:** Biên soạn hệ thống câu hỏi active recall đa cấp độ cho chatbot Minh, giúp mô phỏng chính xác các kịch bản đối thoại đào sâu kiến thức theo phương pháp Feynman thực tế.

## 2. Khó khăn gặp phải & Cách giải quyết
* **Chuyển tải tài liệu chữ dài thành dạng sơ đồ tư duy trực quan:** Một lượng lớn kiến thức dạng văn bản dễ làm sơ đồ tư duy bị quá tải chữ, gây rối mắt.
  * *Giải pháp:* Chia nhỏ kiến thức thành cấu trúc phân cấp nghiêm ngặt (Depth 0 - Core node, Depth 1 - Branch nodes). Sử dụng các câu tóm tắt (detail/clue) ngắn gọn, súc tích dưới 15 chữ cho mỗi node để giao diện mindmap luôn thoáng đãng và có độ tập trung cao.
* **Đồng bộ hóa dữ liệu bài giảng với thuật toán sắp xếp của hệ thống:**
  * *Giải pháp:* Phối hợp chặt chẽ với thành viên làm backend để định nghĩa chính xác cấu trúc file JSON của lộ trình bài học, hỗ trợ phân loại node lá (leaf) và node có thể mở rộng (expandable) một cách rõ ràng.

## 3. Bài học kinh nghiệm rút ra
* Nâng cao kỹ năng hệ thống hóa kiến thức phức tạp thành dạng sơ đồ trực quan và có tính tương tác cao.
* Hiểu sâu về cách vận hành của các mô hình AI trong việc phân tích và đánh giá ngữ cảnh văn bản của học sinh, từ đó biết cách thiết kế dữ liệu đầu vào (data packing) chuẩn xác hơn cho các sản phẩm EdTech AI.
