# Validation feedback log — FeynMind

> **Trạng thái:** Bản nháp mô phỏng phỏng vấn user để chuẩn bị vòng validation. Đây là feedback dạng hỏi thăm sau khi user trải nghiệm task, **không phải rating in-app và chưa được tính là khảo sát thật**. Trước khi nộp chính thức, cần thay các mã U01–U05 bằng người dùng thật và ghi nguyên văn câu trả lời thực tế.

## Cách thực hiện

- Task giao cho mỗi user: “Chọn DAY 2 hoặc DAY 3, đọc câu hỏi đầu tiên của Minh, trả lời bằng 2–4 câu có một ví dụ, sau đó thử một câu trả lời quá ngắn hoặc hỏi ngoài phạm vi.”
- Không yêu cầu chấm điểm sao.
- Sau khi user làm xong, người phỏng vấn hỏi cùng 3 câu:
  1. “Bạn thấy Mindmap bên trái có giúp bạn nhớ keyword hoặc nối ý khi trả lời không?”
  2. “Minh có chỉ đúng chỗ bạn đang thiếu hoặc hiểu mơ hồ không? Bạn dựa vào đâu để tin hoặc không tin nhận xét đó?”
  3. “Có lúc nào bạn không biết phải làm gì tiếp theo không? Bạn muốn giao diện nói hoặc làm gì khác?”

## Feedback interview draft

### U01 — Học viên AI Thực Chiến — DAY 2

- **Quan sát khi làm task:** User chọn nhánh Problem Statement, đọc câu hỏi rồi viết một ví dụ về yêu cầu chatbot bị đặt sai. User mở Mindmap trước khi gửi câu trả lời lần hai.
- **Q1 / câu trả lời:** “Có, keyword Problem Statement với User và Boundary giúp mình nhớ cần nói về vấn đề trước, không nhảy luôn sang giải pháp. Nhưng phần chữ trong node hơi nhỏ, mình phải nhìn lại hai lần.”
- **Q2 / câu trả lời:** “Mình tin hơn khi Minh hỏi tiếp đúng vào phần mình chưa nói, thay vì khen chung chung. Mình vẫn muốn thấy đoạn bài giảng hoặc nguồn ngay cạnh nhận xét để tự kiểm tra.”
- **Q3 / câu trả lời:** “Lúc câu trả lời ngắn, mình chưa biết nên viết thêm cơ chế hay ví dụ. Nếu có một dòng gợi ý ‘hãy nói nguyên nhân và một tình huống’ thì dễ làm hơn.”
- **Vấn đề ghi nhận:** Node nhỏ; low-confidence feedback chưa chỉ rõ cấu trúc cần bổ sung.
- **Thay đổi đề xuất:** Hiển thị hint “bản chất + cơ chế + ví dụ” dưới ô trả lời; giữ link/đoạn nguồn trong final evaluation.

### U02 — Học viên AI Thực Chiến — DAY 3

- **Quan sát khi làm task:** User giải thích Reactive Agent bằng ví dụ trợ lý đặt lịch, sau đó sửa lại câu trả lời khi Minh hỏi sâu hơn.
- **Q1 / câu trả lời:** “Mindmap giúp mình phân biệt LLM Chatbot, Reactive Agent và Autonomous Agent nhanh hơn đọc slide. Mình thích việc click node để mở nhánh, vì nhìn được quan hệ chứ không chỉ thấy danh sách thuật ngữ.”
- **Q2 / câu trả lời:** “Nhận xét khá hợp với câu mình viết: mình có nói Agent dùng tool nhưng quên nói quan sát kết quả. Minh hỏi đúng chỗ đó nên mình thấy có ích.”
- **Q3 / câu trả lời:** “Mình hơi không chắc phiên có bao nhiêu lượt và lúc nào kết thúc. Thanh lượt 3/3 có rồi nhưng nên báo trước là cuối phiên sẽ có tổng hợp.”
- **Vấn đề ghi nhận:** Cần báo rõ điểm dừng và mục tiêu của từng lượt.
- **Thay đổi đề xuất:** Giữ nhãn `lượt hiện tại / tổng lượt`, thêm câu mô tả “sau lượt cuối Minh sẽ tổng hợp điểm mạnh và lỗ hổng”.

### U03 — Người học mới về AI — DAY 1

- **Quan sát khi làm task:** User trả lời câu hỏi bằng một câu ngắn, sau đó hỏi ngược “AI trả lời luôn được không?”.
- **Q1 / câu trả lời:** “Mindmap có ích nhưng mình chưa quen các từ như token, context và tool. Mình cần phần giải thích ngắn hơn khi click node, không cần hiện quá nhiều chữ cùng lúc.”
- **Q2 / câu trả lời:** “Mình chưa tin ngay khi Minh nói cần giải thích thêm. Mình muốn biết câu trả lời đang thiếu ví dụ hay thiếu cơ chế, vì hai việc đó khác nhau.”
- **Q3 / câu trả lời:** “Khi mình hỏi ngược, Minh nói quay lại câu hỏi hiện tại là đúng, nhưng câu chữ hơi giống cảnh báo. Nên nói nhẹ hơn để mình biết phải sửa câu trả lời chứ không phải bị chặn.”
- **Vấn đề ghi nhận:** Người mới cần phân loại lý do thiếu câu trả lời; guardrail nên thân thiện.
- **Thay đổi đề xuất:** Đổi thông báo thành “Bạn đang đi đúng hướng; hãy trả lời câu hỏi hiện tại trước, rồi Minh sẽ hỏi tiếp”, kèm lý do thiếu `ví dụ/cơ chế`.

### U04 — Học viên đã học DAY 4 — DAY 4

- **Quan sát khi làm task:** User trả lời đúng Few-shot, nhưng thử yêu cầu jailbreak sau đó để xem agent phản ứng.
- **Q1 / câu trả lời:** “Mindmap giúp mình nhớ các thành phần Task, Context và Format. Mình muốn có nút reset vị trí graph vì kéo nhiều node xong hơi khó quay lại bố cục ban đầu.”
- **Q2 / câu trả lời:** “Khi mình nói sai về tool calling, nhận xét cần trỏ ra application mới là bên thực thi function. Nếu chỉ nói ‘chưa chính xác’ thì mình không biết sai ở bước nào.”
- **Q3 / câu trả lời:** “Với câu jailbreak, mình thấy bot không nên giải thích dài. Chỉ cần nói ngoài phạm vi và đưa lại câu hỏi học tập hiện tại là đủ.”
- **Vấn đề ghi nhận:** Cần giữ trace/giải thích cụ thể cho lỗi domain; out-of-scope response nên ngắn.
- **Thay đổi đề xuất:** Chuẩn hóa guardrail ngoài phạm vi thành một template ngắn; trong đánh giá domain error, luôn nêu `ý sai → ý đúng → nguồn`.

### U05 — Học viên thường quên lịch ôn — DAY 5

- **Quan sát khi làm task:** User hoàn thành một phiên 3 lượt rồi xem phần status/nhắc ôn, hỏi lại về thời điểm cần quay lại.
- **Q1 / câu trả lời:** “Mindmap giúp mình thấy các ý liên quan đến quality bar và fallback. Mình muốn phần nhắc ôn gắn thẳng với node hoặc bài cần xem lại, không chỉ báo chung là nên ôn.”
- **Q2 / câu trả lời:** “Mình tin nhận xét hơn nếu có câu trả lời của mình được nhắc lại cùng với lý do đánh giá. Nếu chỉ có kết luận Tạm hiểu thì hơi khó biết phải sửa gì.”
- **Q3 / câu trả lời:** “Mình không muốn bị gửi thông báo liên tục. Một lời nhắc sau 3 ngày kèm đúng 2–3 câu hỏi cũ là hợp lý hơn việc mở lại toàn bộ slide.”
- **Vấn đề ghi nhận:** Reminder cần gắn với nội dung yếu và giữ ngữ cảnh câu hỏi cũ.
- **Thay đổi đề xuất:** Lưu checkpoint/topic yếu vào review note; khi mở lại, hiển thị lại câu hỏi Feynman tương ứng thay vì chỉ mở bài học.

## Tổng hợp thay đổi sau feedback draft

| Phát hiện | Số mẩu nhắc đến | Thay đổi đưa vào backlog |
|---|---:|---|
| Cần gợi ý rõ câu trả lời thiếu gì | 2/5 | Hint “bản chất + cơ chế + ví dụ” và phân loại low-confidence |
| Cần nguồn/đoạn bài để kiểm chứng nhận xét | 3/5 | Hiển thị source evidence trong final evaluation |
| Cần guardrail ngoài phạm vi ngắn và thân thiện | 2/5 | Chuẩn hóa template redirect |
| Cần báo rõ điểm dừng phiên | 1/5 | Hiển thị `lượt hiện tại / tổng lượt` và thông báo final summary |
| Cần reminder gắn với checkpoint yếu | 1/5 | Lưu topic yếu và mở lại câu hỏi cũ |

## Changelog validation

- 2026-07-30: Tạo bộ draft interview gồm 5 mẩu, dùng câu hỏi mở sau task; chưa xem là bằng chứng user thật.
- Việc còn thiếu: chạy lại đúng task với ít nhất 5 user thật, ghi âm hoặc chép nguyên văn câu trả lời được phép sử dụng, cập nhật mã user và đối chiếu xem các phát hiện có lặp lại không.
