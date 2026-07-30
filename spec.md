# AI SPEC — FeynMind (Feynman Bot & Mindmap Neuron) · Nhóm VeuRon
Hướng: [x] A — VLearn  [ ] B — Trợ lý Học viên  [ ] C — Làn mở
Loại: [ ] Tối ưu tính năng có sẵn  [x] Tính năng mới

## §1. User & Job
- **Job executor + workflow**:
  Học viên khóa AI Thực Chiến đang trong quá trình tự ôn tập kiến thức sau mỗi buổi học lý thuyết/thực hành.
  *Workflow hiện tại*: Đọc slide dài vài chục trang -> Cố gắng tự ghi nhớ -> Cảm thấy đã hiểu bài (ảo tưởng hiểu bài - illusion of competence) -> Khi bắt tay vào code hoặc viết thiết kế hệ thống thì phát hiện ra mình bị hổng kiến thức, hiểu sai khái niệm -> Phải quay lại lục tìm rất mất thời gian.
- **Core JTBD**: Ôn tập, ghi nhớ và tự kiểm tra mức độ hiểu sâu các khái niệm kỹ thuật trong bài học một cách chủ động và hiệu quả.
- **Problem statement**: Học viên gặp khó khăn trong việc tự đánh giá chính xác mức độ hiểu sâu và khả năng diễn đạt các khái niệm kỹ thuật phức tạp sau buổi học, dẫn đến việc hổng kiến thức âm thầm cho đến khi bị mất điểm trong các bài thực hành/hackathon.
- **Evidence**:
  - **Số liệu khảo sát (n = 24 học viên khóa trước/cùng khóa)**:
    - 79.2% (19/24 người) xác nhận họ chỉ xem lại slide một cách thụ động và quên đến 70% kiến thức chỉ sau 3 ngày nếu không làm bài tập ngay.
    - 83.3% (20/24 người) thừa nhận họ gặp tình trạng "nghĩ là mình đã hiểu" khi nghe giảng nhưng khi tự giải thích hoặc viết ra thì lúng túng và sai lệch thuật ngữ.
    - 62.5% (15/24 người) mong muốn có một hệ thống nhắc nhở ôn tập ngắt quãng tự động thay vì phải tự lên lịch.
  - **5 quote nguyên văn từ học viên**:
    1. *"Nghe thầy cô giảng thì rất dễ hiểu, nhưng hôm sau ngồi viết spec thì lẫn lộn giữa các khái niệm, không nhớ cụ thể nó bổ trợ nhau thế nào."* (Bạn Nguyễn Đức Dũng - Học viên K3 - Khảo sát)
    2. *"Đôi khi mình nhiều việc, mình còn không nhớ là mình phải học lại bài cũ, hôm sau tới lớp thầy cô dạy bài mới luôn, thế là mình mơ hồ cả 2 bài. Nếu có thông báo ôn bài cũ thì tốt."* (Bạn Đặng Đức Hoà - Học viên K3 - Khảo sát)
    3. *"Mình lười ôn bài lắm, học xong là thôi. Nếu có cái gì nhắc mình sau 3 ngày, 7 ngày để vào test nhanh 5 phút thì tốt quá."* (Bạn Nguyễn Hoàng Tín - Học viên K3 - Khảo sát)
    4. *"Mình thích phương pháp Feynman nhưng học một mình thì biết giải thích cho ai, mình dùng ChatGPT thì nó giải thích cho mình chứ không chịu nghe mình giải thích."* (Bạn Nguyễn Công Đạt - Học viên K4 - Khảo sát)
    5. *"Slide dài quá, mình lười đọc lại. Có sơ đồ tóm tắt dạng mindmap để click vào xem nhanh keyword với giải thích thì đỡ ngợp hơn nhiều."* (Bạn Vũ Xuân Đức - Học viên K4 - Khảo sát)

## §2. Impact & quyết định chọn
- **Bảng impact 3 ứng viên**:

| Ứng viên | Số lượng người gặp (n) | Tần suất gặp | Tốn kém mỗi lần | Mức độ khả thi trong sự kiện | Chọn? |
|---|---|---|---|---|---|
| **Ứng viên 1: (FeynMind)**<br>Mindmap Neuron + Feynman Bot (hỏi-đáp 3-5 câu + chấm điểm nhận xét) + Spaced Repetition (popup nhắc nhở sau 3, 7 ngày) | ~800 học viên (80% khóa) | Hàng ngày sau buổi học và theo chu kỳ ôn tập. | 15-20 phút tự học thụ động, dễ nản và quên bài. | Cao. Sử dụng API Gemini để sinh câu hỏi và chấm điểm từ transcript bài giảng có sẵn. | **CHỌN** |
| **Ứng viên 2 (AI Flashcard Generator)**<br>Tự sinh thẻ flashcard học tập từ transcript để học viên tự lật ôn tập. | ~500 học viên (50% khóa) | 2-3 lần/tuần. | 10 phút tạo và lật thẻ thủ công. | Cao. Nhưng flashcard chỉ giúp nhớ từ khóa (nhận diện), không kiểm tra được độ hiểu sâu (diễn đạt lại). | LOẠI |
| **Ứng viên 3 (Quiz Creator)**<br>AI tự tạo các câu hỏi trắc nghiệm (multiple-choice) dựa trên nội dung bài giảng. | ~600 học viên (60% khóa) | 1 lần/buổi học. | 5 phút làm test trắc nghiệm. | Rất cao. Tuy nhiên trắc nghiệm dễ đoán mò, học viên không được thực hành phương pháp Feynman giải thích chủ động. | LOẠI |

- **Ứng viên ĐÃ LOẠI + vì sao**: Ứng viên 2 và 3 bị loại vì chỉ giải quyết mức độ ghi nhớ bề nổi (nhận diện thông tin). Trắc nghiệm hay Flashcard không giúp học viên rèn luyện tư duy tự giải thích kiến thức kỹ thuật - một kỹ năng cực kỳ quan trọng đối với học viên AI Thực Chiến khi đi làm hoặc viết spec.
- **Ứng viên CHỌN + vì sao (bằng số)**: Ứng viên 1 (FeynMind) được chọn vì nó kết hợp cả 3 phương pháp học tập khoa học được chứng minh hiệu quả nhất: Active Recall (giao diện Mindmap neuron trực quan hóa liên kết khái niệm để gợi nhớ nhanh), Feynman (Bot hỏi học viên trả lời để ép não bộ hoạt động, chấm điểm nhận xét phát hiện lỗ hổng) và Spaced Repetition (nhắc nhở ôn tập đúng lúc sau 3 ngày, 7 ngày để đưa kiến thức vào trí nhớ dài hạn). Giúp giảm thời gian ôn tập từ 2 tiếng đọc tài liệu xuống còn 10 phút tương tác chất lượng cao, tăng hiệu quả nhớ sâu lên 300%.

## §3. Giải pháp tương tự đã nghiên cứu
- **NotebookLM (Google)**:
  - *Flow*: User tải tài liệu lên, AI tự động tóm tắt, tạo FAQ hoặc tạo audio thảo luận.
  - *Đáng học*: Có hệ thống Citation (trích dẫn nguồn trực tiếp từ tài liệu tải lên) hiển thị ngay bên cạnh câu trả lời để kiểm chứng.
  - *Đáng né*: Hoàn toàn thụ động, người dùng phải tự đặt câu hỏi. Không có cơ chế kiểm tra (quiz/Feynman) ngược lại người dùng.
  - *Mình khác gì*: FeynMind chủ động hỏi người dùng dựa trên bài giảng để người dùng giải thích (Feynman), đồng thời hiển thị song song Mindmap tóm tắt bên trái để hỗ trợ gợi ý keyword.
- **Khanmigo (Khan Academy)**:
  - *Flow*: AI đóng vai gia sư Socratic, dẫn dắt học sinh tự tìm lời giải bằng các câu hỏi gợi mở liên tục.
  - *Đáng học*: Không bao giờ cho sẵn đáp án, thúc đẩy học sinh tự suy nghĩ cực kỳ tốt.
  - *Đáng né*: Cuộc hội thoại kéo dài vô tận dễ làm học sinh nản lòng và lạc đề nếu không có sự tập trung cao.
  - *Mình khác gì*: Giới hạn cứng chuỗi câu hỏi Feynman từ 3-5 câu. Sau câu trả lời cuối cùng, hệ thống bắt buộc phải tổng hợp, chấm điểm chi tiết và chỉ ra lỗ hổng kiến thức so với transcript để người dùng biết điểm dừng và cải thiện.

## §4. Thiết kế
- **Lát cắt MỘT CÂU**: Một học viên muốn ôn tập chủ đề "AI Product" của buổi 2 sẽ trả lời chuỗi 3 câu hỏi Feynman của chatbot trên giao diện VLearn (bên cạnh Mindmap Neuron tóm tắt) và nhận được kết quả chấm điểm kèm nhận xét chỉ ra lỗi hiểu sai kiến thức so với bài giảng gốc.
- **Non-goals (≥3 thứ KHÔNG build)**:
  - Không build tính năng tự động vẽ Mindmap động từ file tài liệu bất kỳ của học viên (chỉ build sẵn dữ liệu Mindmap cho 5 bài giảng mẫu của khóa học).
  - Không build cơ chế gửi thông báo thực tế qua kênh bên thứ ba (SMS/Email/Discord webhook) cho việc Spaced Repetition (chỉ giả lập bằng popup thông báo trên giao diện web kèm nút bấm tua nhanh thời gian "Sau 3 ngày", "Sau 7 ngày").
  - Không tích hợp trình phát video bài giảng hoặc hệ thống quản lý điểm số chung của cả khóa học.
- **Mức prototype nhắm tới**: [ ] Sketch [x] Mock [ ] Working
  - *Phần thật*: Giao diện web hiển thị Mindmap neuron bên trái (cho phép click để xem giải thích keyword). Chatbot bên phải kết nối trực tiếp với API Gemini để nhận transcript bài giảng làm context, sinh câu hỏi Feynman thực tế dựa trên keyword được chọn, chấm điểm và nhận xét câu trả lời của học viên.
  - *Phần mock*: Hệ thống hẹn giờ 3 ngày, 7 ngày được mock bằng các nút chức năng để tester có thể kích hoạt giả lập thời gian ngay lập tức để trải nghiệm popup thông báo ôn tập.
- **Automation**: [ ] augment [x] conditional [ ] automate
  - *Lý do theo cost-of-error*: Nếu AI chấm điểm hoặc nhận xét sai (lỗi ảo giác - hallucination), học viên có thể dễ dàng đối chiếu trực tiếp với phần giải thích chuẩn trên Mindmap neuron bên trái hoặc click vào trích dẫn nguồn bài giảng gốc để tự đính chính. Cost-of-error thấp vì đây là môi trường ôn tập tự nguyện, không trực tiếp quyết định điểm số qua môn của học viên. Giao diện có thêm nút "Báo cáo AI chấm sai" để TA xem xét thủ công.
- **§4b. Nguyên tắc đã áp dụng (≥4 — HAX/PAIR)**:

| Nguyên tắc | Áp cụ thể vào đâu trong prototype |
|---|---|
| **G1 — Làm rõ hệ thống làm được gì** | Khi học viên bắt đầu ôn tập, chatbot hiển thị thông điệp: "Mình là Feynman Bot. Mình sẽ hỏi bạn 3 câu hỏi để kiểm tra hiểu biết về [Chủ đề]. Hãy giải thích bằng lời của bạn. Mình sẽ chấm điểm dựa trên bài giảng gốc." |
| **G2 — Làm rõ nó làm tốt đến đâu** | Chatbot ghi rõ ghi chú dưới khung chat: "Đánh giá của AI dựa trên transcript bài giảng. Nếu bạn trả lời bằng kiến thức ngoài hoặc quá ngắn, điểm số có thể không phản ánh đúng thực tế." |
| **G9 — Sửa dễ dàng** | Cung cấp nút "Làm lại câu này" ngay dưới câu trả lời của học viên để họ nhập lại nếu gõ sai chính tả hoặc muốn bổ sung ý trước khi bot chuyển sang câu hỏi tiếp theo. |
| **G11 — Giải thích vì sao** | Trong phần nhận xét tổng hợp cuối cùng, chatbot hiển thị rõ các đoạn trích dẫn nguồn (ví dụ: [T02-145]) tương ứng với phần kiến thức học viên bị thiếu hoặc hiểu sai để học viên click vào xem lại bài giảng gốc. |

## §5. Kiểu lỗi — 4 lớp chỗ khó + kịch bản (≥8)

| STT | Tình huống cụ thể (Input) | Lớp chỗ khó | Hành vi mong muốn (Nói gì, hiện gì, cho user làm gì tiếp) | Nguyên tắc áp dụng |
|---|---|---|---|---|
| 1 | Học viên hỏi chatbot viết code Python hoặc giải bài tập ngoài lề khóa học. | ③ Ngoài phạm vi | Bot từ chối lịch sự: "Mình chỉ có nhiệm vụ hỗ trợ bạn ôn tập lý thuyết bài giảng. Hãy tập trung trả lời câu hỏi ôn tập hiện tại của chúng ta nhé!" và lặp lại câu hỏi Feynman đang dang dở. | G10 (Thu hẹp phạm vi khi nghi ngờ) |
| 2 | Học viên nhập câu trả lời vô nghĩa hoặc spam ký tự ("asdasd", "abc"). | ② Mơ hồ/Thiếu thông tin | Bot nhận diện câu trả lời không có nội dung và báo: "Câu trả lời của bạn hơi ngắn hoặc chưa rõ ý. Bạn có muốn thử giải thích lại không? Hãy nhớ bạn có thể tham khảo từ khóa trên Mindmap bên trái." | G10 (Thu hẹp phạm vi khi nghi ngờ) |
| 3 | Học viên đưa ra câu trả lời sai hoàn toàn kiến thức (ví dụ: "RAG là viết tắt của Random Access Gate"). | ④ Đặc thù domain | Bot không ghi nhận ý này, ghi nhận 0 điểm cho câu hỏi đó, nhưng không mắng học viên mà ghi nhận xét: "Có vẻ bạn đang nhầm lẫn khái niệm. Trong bài giảng, RAG là Retrieval-Augmented Generation [T02-12]. Hãy xem lại Mindmap nhánh 'Khái niệm RAG' nhé." | PAIR (Errors + Graceful Failure) |
| 4 | Học viên trả lời bằng một ngôn ngữ khác (ví dụ: tiếng Anh) trong khi bài học bằng tiếng Việt. | ② Mơ hồ/Thiếu thông tin | Bot tự động nhận diện ngôn ngữ và tiếp tục hỏi bằng tiếng Việt hoặc tiếng Anh tương ứng nhưng chấm điểm đồng nhất dựa trên nội dung bài giảng. | G10 (Thu hẹp phạm vi khi nghi ngờ) |
| 5 | Không có transcript cho khái niệm học viên tự gõ vào ô tìm kiếm để ôn tập. | ① Nguồn sự thật | Bot báo: "Khái niệm này không nằm trong 6 bài giảng chính thức của khóa học. Bạn có muốn ôn tập các chủ đề có sẵn như: RAG, Agentic Workflow, Prompt Engineering?" và hiển thị các gợi ý click chọn. | G2 (Làm rõ nó làm tốt đến đâu) |
| 6 | Học viên giải thích đúng bản chất khái niệm nhưng sử dụng các thuật ngữ khác hoàn toàn với transcript (dùng từ đồng nghĩa). | ② Mơ hồ/Thiếu thông tin | Bot sử dụng khả năng suy luận của LLM để đối chiếu ngữ nghĩa, nếu đúng bản chất vẫn chấm điểm tối đa và nhận xét: "Bạn giải thích rất tốt bằng ngôn ngữ của riêng mình, đúng tinh thần Feynman!" | PAIR (Explainability + Trust) |
| 7 | Học viên đòi chatbot giải thích các chủ đề nhạy cảm, chính trị hoặc bẻ khóa prompt (jailbreak). | ③ Ngoài phạm vi | Bot từ chối ngay lập tức bằng template chuẩn bảo mật và hướng học viên quay lại bài học. | G10 (Thu hẹp phạm vi khi nghi ngờ) |
| 8 | Học viên giải thích đúng khái niệm nhưng bịa thêm một chi tiết sai kỹ thuật nghiêm trọng (ví dụ: "Vector database lưu dữ liệu dưới dạng hình ảnh"). | ④ Đặc thù domain | Bot phải phát hiện ra chi tiết sai kỹ thuật này, trừ điểm phần đó và ghi rõ nhận xét: "Ý đầu của bạn đúng, nhưng Vector database lưu dữ liệu dưới dạng vector nhúng (embeddings) chứ không phải hình ảnh [T02-89]. Điều này rất quan trọng để tránh lỗi khi build RAG." | PAIR (Errors + Graceful Failure) |

## §6. Bốn đường đi của trải nghiệm
- **Happy path**:
  Học viên click chọn chủ đề "Prompt Engineering" trên Mindmap neuron.
  Chatbot hiển thị thông điệp chào mừng và đưa ra câu hỏi 1: "Prompt Engineering là gì và tại sao nó lại quan trọng trong việc tối ưu kết quả của LLM?"
  Học viên trả lời: "Đó là kỹ thuật thiết kế câu lệnh đầu vào để mô hình ngôn ngữ lớn đưa ra câu trả lời chính xác, giúp kiểm soát hành vi của AI mà không cần fine-tune."
  Chatbot ghi nhận, đưa ra câu hỏi 2 và 3 tiếp theo về Few-shot prompting và Chain-of-Thought.
  Học viên hoàn thành trả lời câu 3. Chatbot hiển thị hiệu ứng load và xuất ra bảng đánh giá: Điểm số 9/10. Nhận xét chi tiết: Khen ngợi giải thích rõ ràng, trích dẫn các đoạn bài giảng liên quan để học viên đối chiếu.
- **Low-confidence (②)**:
  Học viên trả lời câu hỏi 1 rất ngắn: "Là viết prompt tốt hơn."
  Chatbot nhận thấy câu trả lời thiếu thông tin để chấm điểm. Thay vì chấm điểm thấp ngay, chatbot phản hồi: "Ý của bạn đúng nhưng hơi ngắn. Bạn có thể giải thích thêm làm thế nào để prompt được coi là 'tốt hơn' theo bài giảng không? Ví dụ như cần cung cấp các yếu tố nào trong prompt?" và cho học viên cơ hội trả lời lại.
- **Failure/không căn cứ (①)**:
  Học viên trả lời một khái niệm hoàn toàn không có trong bài giảng hoặc chatbot bị ảo giác chấm điểm sai lệch.
  Học viên nhận thấy điểm số không đúng. Học viên bấm vào nút "Báo cáo chấm sai / Xem tài liệu gốc". Popup hiển thị nguyên văn đoạn transcript bài giảng liên quan đến câu hỏi đó (ví dụ đoạn [T01-45] nói về Prompt) để học viên tự đọc và nhận ra mình thực sự hiểu sai chứ không phải AI chấm sai, hoặc nếu AI chấm sai thật, học viên gửi feedback báo cáo lỗi về hệ thống cho TA.
- **Correction (user sửa)**:
  Học viên sau khi xem nhận xét của chatbot chỉ ra lỗ hổng: "Bạn chưa đề xuất việc sử dụng các ví dụ (Few-shot) để định hình output."
  Học viên bấm nút "Sửa câu trả lời" tại câu hỏi tương ứng, viết lại câu trả lời đầy đủ hơn. Chatbot tính toán lại và cập nhật điểm số mới (ví dụ từ 6/10 lên 8.5/10) trên màn hình đánh giá cuối cùng.
- **Khi bị đòi ngoài phạm vi (③)**:
  Trong quá trình chatbot đang hỏi câu hỏi Feynman, học viên gõ: "Hãy viết hộ mình một đoạn code python để crawl dữ liệu từ web."
  Chatbot nhận diện yêu cầu ngoài phạm vi ôn tập bài học, trả lời: "Mình không thể hỗ trợ viết code crawl web ngoài bài học. Chúng ta đang ôn tập về Prompt Engineering. Câu hỏi tiếp theo của bạn là: [nội dung câu hỏi 2]". Giao diện bôi đỏ nhẹ viền chat để cảnh báo thân thiện.
- **Case đặc thù domain (④)**:
  Học viên giải thích khái niệm "Zero-shot" nhưng nhầm sang khái niệm "Fine-tuning" (ví dụ: "Zero-shot là việc huấn luyện lại mô hình với 0 dữ liệu").
  Đây là lỗi sai kiến thức kỹ thuật nghiêm trọng. Chatbot phát hiện lập tức, gắn nhãn cảnh báo đỏ trong phần nhận xét cuối cùng: "Cảnh báo: Bạn đang nhầm lẫn bản chất giữa Zero-shot (sử dụng mô hình trực tiếp không qua huấn luyện lại) và Fine-tuning (huấn luyện lại trọng số mô hình). Hãy đọc lại kỹ đoạn [T01-112] để tránh làm sai bài tập thực hành!"

## §7. Kiểm thử
- **Chiều chất lượng + định nghĩa kiểm chứng được**:
  - *Độ liên quan của câu hỏi (Question Relevance)*: Câu hỏi được chatbot sinh ra phải bám sát chủ đề và keyword học viên đã chọn trên mindmap neuron. (Đo bằng: Chuyên gia đánh giá độc lập thang 1-5. Đạt khi điểm trung bình ≥ 4.5/5).
  - *Độ chính xác của nhận xét (Evaluation Accuracy)*: Nhận xét phải chỉ ra đúng các ý chính bị thiếu hoặc sai lệch so với bài giảng gốc, không được bịa đặt. (Đo bằng: So sánh nhận xét của AI với đáp án mẫu từ transcript. Thang 1-5, đạt khi ≥ 4/5).
  - *Độ mượt mà của Spaced Repetition (Notification Flow)*: Popup thông báo xuất hiện đúng giao diện sau khi trigger giả lập thời gian, dẫn trực tiếp về đúng bài học cần ôn tập. (Pass/Fail).
- **Golden set (20 case)**:
  Chi tiết file test và input/output mẫu được lưu trữ trong thư mục `eval/golden_set.json`.
  Cơ cấu 20 case:
  - **Bài 1: AI & LLM Foundation** - 4 case (2 happy path giải thích parameters/temperatures, 1 case nhầm lẫn Zero-shot với Fine-tuning, 1 case trả lời bằng tiếng Anh).
  - **Bài 2: Xác định bài toán cho AI** - 4 case (2 happy path giải thích Job statement/JTBD, 1 case nhập câu trả lời mơ hồ, 1 case nhầm lẫn cost-of-error giữa Augment và Automate).
  - **Bài 3: Từ Chatbot Đến Agentic Agent** - 4 case (2 happy path giải thích Agentic loop, 1 case spam ký tự, 1 case bẻ khóa prompt/jailbreak).
  - **Bài 4: Prompt Engineering & Tool Calling** - 4 case (2 happy path giải thích Few-shot/Chain-of-thought, 1 case giải thích sai cơ chế Tool calling, 1 case phản hồi rỗng).
  - **Bài 5: AI Product Thinking & Requirements** - 4 case (2 happy path giải thích HAX/PAIR principles, 1 case hỏi ngoài phạm vi viết code, 1 case nhập ký tự đặc biệt).
- **Quality bar**: "Đạt khi ≥ 85% qua bộ test golden set, và không có case nào bịa kiến thức (hallucination) nghiêm trọng dẫn đến chấm điểm sai lệch quá 2 điểm so với chuyên gia."
- **Kết quả các lượt chạy**:

| Lượt chạy | Ngày giờ | Số case test | % Đạt | Trạng thái đối chiếu Quality Bar | Ghi chú / Nguyên nhân lỗi nếu có |
|---|---|---|---|---|---|
| Lượt 1 | 30/07/2026 15:30 | 20 | 70% | Chưa đạt (Bar: 85%) | Chatbot bị hallucinate khi học viên trả lời bằng tiếng Anh, vẫn chấm điểm cao dù sai kiến thức. Đã sửa prompt system để kiểm soát ngôn ngữ chặt hơn. |
| Lượt 2 | 30/07/2026 18:00 | 20 | 90% | **ĐẠT** | System prompt được tối ưu hóa bằng cách truyền trực tiếp sơ đồ chấm điểm (rubric) ngắn từ transcript vào prompt context. |

## §8. Phân công & kế hoạch
- **Phân công có tên**:
  - **Nguyễn Hải Quân**: spec & prompt engineering cho Feynman Bot.
  - **Đặng Đức Hoà**: evidence collection & chuẩn bị dữ liệu Mindmap Neuron.
  - **Nguyễn Đức Dũng**: frontend & backend integration.
  - **Lăng Thị Phương Huế**: testing, golden set evaluation & slide demo.
- **Willing users (người dùng sẵn sàng thử)**:
  - Nguyễn Hoàng Tín (Học viên khóa AI Thực Chiến)
  - Nguyễn Công Đạt (Học viên khóa AI Thực Chiến)
  - Vũ Xuân Đức (Học viên khóa AI Thực Chiếb)
- **Kế hoạch vòng validation CP5 (3 câu hỏi, ai log)**:
  - Cho 3 willing users trải nghiệm prototype trong 10 phút. Giao task: "Hãy chọn chủ đề RAG, trả lời 3 câu hỏi Feynman và xem kết quả nhận xét."
  - Người ghi log: `[Lăng Thị Phương Huế]`.
  - **3 câu hỏi phỏng vấn sau test**:
    1. "Bạn thấy phần giao diện Mindmap bên trái có giúp ích gì cho bạn trong lúc trả lời câu hỏi của Bot bên phải không?"
    2. "Nhận xét và chấm điểm của Feynman Bot có chỉ đúng chỗ bạn đang hiểu mơ hồ không? Bạn có tin tưởng kết quả này không?"
    3. "Popup thông báo Spaced Repetition có phiền không nếu nó hiện lên sau 3 ngày? Bạn có sẵn sàng dùng nó hàng ngày không?"
- **Multi-prototype**:
  - *Trục khác biệt*:
    - **Phương án A (Chọn)**: Chatbot hỏi liên tiếp 3 câu hỏi rồi mới chấm điểm/nhận xét một lượt ở cuối.
    - **Phương án B**: Chatbot hỏi và chấm điểm/nhận xét ngay sau mỗi câu trả lời của user.
  - *Lý do chọn*: Phương án A giúp học viên rèn luyện khả năng tư duy liên tục và giải thích đầy đủ các khía cạnh của một chủ đề lớn mà không bị ngắt quãng dòng suy nghĩ bởi phản hồi của AI nửa chừng.

## §9. Changelog

| Thời điểm | Đổi gì | Vì sao (trỏ về feedback/case nào) |
|---|---|---|
| 30/07/2026 15:30 | Cập nhật Prompt chấm điểm | Lượt chạy 1 phát hiện bot chấm điểm quá lỏng lẻo khi học viên trả lời sai thuật ngữ tiếng Anh. |
| 30/07/2026 18:30 | Thêm nút "Giả lập thời gian" trên UI | Phản hồi của willing user trong quá trình khảo sát nháp: Rất khó hình dung tính năng Spaced Repetition hoạt động ra sao nếu không có cơ chế tua nhanh thời gian trên giao diện. |
