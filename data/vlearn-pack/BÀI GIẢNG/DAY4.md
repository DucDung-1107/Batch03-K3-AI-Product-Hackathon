day_4_slide-sumary-28-7.docx 
TỔNG QUAN CHUYÊN SÂU KHÓA HỌC: NGÀY 4PROMPT ENGINEERING & TOOL CALLING
Tài Liệu Kỹ Thuật Đầy Đủ, Hệ Thống Hóa Không Bỏ Sót Kiến Thức - Phục Vụ Cho Việc Đọc Hiểu Của AI Agent
MỤC LỤC TỰ ĐỘNG
Hướng dẫn cập nhật: Mục lục tự động này được cấu trúc theo chuẩn Microsoft Word. Để cập nhật mục lục sau khi chỉnh sửa tài liệu, vui lòng click chuột phải vào vùng mục lục và chọn 'Update Field'.
1. NỀN TẢNG THIẾT KẾ LỜI NHẮC (PROMPT ENGINEERING FUNDAMENTALS)
Định nghĩa bản chất: Kỹ thuật thiết kế lời nhắc (Prompt Engineering) không phải là việc tìm ra một câu lệnh 'hay' hay mang tính chất thần chú, mà là quá trình lập trình hóa giao diện tương tác giữa ý định con người và khả năng xử lý của mô hình ngôn ngữ lớn (LLM).
★ CÂU HỎI ĐỘNG NÃO ĐẦU BUỔIHai người hỏi AI cùng một việc, một người nhận kết quả xuất sắc, người kia nhận rác. Tại sao? Bởi vì Prompt đóng vai trò là Interface kết nối trực tiếp Human Intent (Ý định con người) và Model Behavior (Hành vi mô hình). Độ rõ ràng của Prompt quyết định độ chính xác của kết quả xử lý.
Nguyên tắc vàng (Specificity Beats Cleverness): Một trong những nguyên tắc cốt lõi nhất của Prompt Engineering là tính cụ thể luôn chiến thắng sự hoa mỹ hay thông minh. Một lời nhắc ngắn gọn nhưng rõ ràng về mặt ràng buộc và định dạng luôn mang lại kết quả ổn định hơn rất nhiều so với lời nhắc dài dòng nhưng thiếu cấu trúc.
Khung Cấu Trúc Lời Nhắc Chuẩn Hóa RTCF
Khung RTCF bao gồm 4 cấu phần bắt buộc phải có khi xây dựng một prompt chất lượng cao cho môi trường sản phẩm (production):
Thành Phần (Component)
Mô Tả Vai Trò
Ví Dụ Thực Tế
Tác Động Kỹ Thuật
ROLE (Vai trò)
Định hình góc nhìn, tone giọng, phong cách viết và lựa chọn thư viện kỹ thuật.
Senior Python developer, FastAPI expert
Ảnh hưởng lớn tới cấu trúc mã nguồn được sinh ra.
TASK (Nhiệm vụ)
Yêu cầu hành động cụ thể cần thực hiện một cách chi tiết, giảm thiểu mơ hồ.
Refactor function X to use async/await
Xác định rõ ràng mục tiêu đầu ra duy nhất.
CONTEXT (Bối cảnh)
Cung cấp nền tảng thông tin xung quanh nhiệm vụ như công nghệ sử dụng, đối tượng thụ hưởng.
FastAPI, Python 3.12, PostgreSQL
Tránh việc model dự đoán sai hoặc lạc đề.
FORMAT (Định dạng)
Định hình chính xác hình thức đầu ra để thuận tiện cho việc xử lý lập trình tự động.
Return only the function, no explanation
Tối ưu hóa để parser lập trình có thể đọc được.
★ THỨ TỰ THIẾT KẾ PROMPT ƯU TIÊNKhi viết một prompt mới, hãy luôn luôn bắt đầu thiết kế bằng Task + Format trước. Chỉ tiến hành thêm cấu phần Role hoặc Context khi chúng thực sự mang lại sự cải thiện rõ rệt về chất lượng đầu ra hoặc tính nhất quán của hành vi mô hình.
Quy Trình Lặp Thiết Kế Lời Nhắc (Prompt Iteration Process)
Bản chất quy trình: Thiết kế prompt là một quá trình thử nghiệm liên tục (iterative process): Viết -> Thử nghiệm -> Quan sát -> Cải tiến. Không ai có thể viết được một prompt hoàn hảo ngay trong lần đầu tiên.
v1 - Mơ hồ:: "Tóm tắt bài báo này" -> Lỗi: Không rõ độ dài, đối tượng đọc, trọng tâm hay định dạng đầu ra.
v2 - Có định dạng:: "Tóm tắt trong 3 bullets, mỗi bullet dưới 20 từ" -> Cải tiến: Đã có format, nhưng vẫn thiếu bối cảnh và mục tiêu cụ thể.
v3 - RTCF đầy đủ:: "Tóm tắt cho executive team. 3 bullets, <20 từ. Focus: Q2 revenue impact. Tone: data-driven." -> Xuất sắc: Đầy đủ bối cảnh, giới hạn nghiêm ngặt, đối tượng rõ ràng.
Phân Loại Lời Nhắc Theo Mục Đích Sử Dụng
Trong các hệ thống thực tế, prompt được chia làm ba nhóm chính tùy thuộc vào ngữ cảnh và vòng đời tương tác:
Loại Lời Nhắc (Prompt)
Mục Đích Chính
Ngữ Cảnh Áp Dụng Điển Hình
Instruction Prompt(Lời nhắc chỉ thị)
Ra lệnh trực tiếp để thực hiện một tác vụ đơn lẻ, độc lập.
Hỏi đáp một lượt (single-turn), biến đổi dữ liệu, tóm tắt văn bản, phân loại dữ liệu.
Conversation Prompt(Lời nhắc hội thoại)
Duy trì và quản lý bối cảnh qua nhiều lượt hội thoại tương tác.
Hệ thống hỗ trợ khách hàng (chatbot support), trợ lý ảo, trợ lý lập trình (pair programming).
System Prompt(Lời nhắc hệ thống)
Thiết lập chính sách, ranh giới hành vi, quy chuẩn an toàn và hợp đồng đầu ra.
Các Agent tự động, trợ lý ảo cấp độ doanh nghiệp, hệ thống sản xuất cần tính ổn định cao.
Negative Prompting & Thiết Lập Ranh Giới Hành Vi
Nguyên tắc thiết lập ranh giới: Khi muốn hạn chế mô hình thực hiện một hành vi nào đó, việc chỉ đưa ra các câu lệnh phủ định (Negative Prompts) như 'đừng làm x' thường mang lại hiệu quả kém do mô hình không có định hướng thay thế.
• Viết kiểu phủ định thuần túy (Kém): Kém hiệu quả: 'Đừng dùng jargon', 'Đừng đoán bừa', 'Đừng trả lời quá dài'.
• Viết kèm phương án thay thế (Tốt): Hiệu quả cao: 'Giải thích bằng ngôn ngữ dễ hiểu mà học sinh lớp 10 cũng hiểu được', 'Nếu không chắc chắn, hãy trả lời chính xác là: Tôi cần thêm thông tin', 'Giới hạn câu trả lời nghiêm ngặt dưới 150 từ'.
Kết luận kỹ thuật: Các câu lệnh phủ định (negative prompts) chỉ thực sự phát huy tối đa hiệu quả khi chúng được đi kèm with các phương án hành vi thay thế tích cực (positive alternative). Mô hình ngôn ngữ cần biết chính xác nó nên làm gì, chứ không chỉ biết nó phải tránh cái gì.
Nhận Thức Ngân Sách Token & Các Tham Số Lấy Mẫu (Sampling Parameters)
Quản lý ngân sách Token: Prompt dài hơn hoàn toàn không đồng nghĩa với prompt tốt hơn. Mỗi token thừa được đưa vào bối cảnh sẽ trực tiếp làm gia tăng chi phí vận hành (API cost), độ trễ phản hồi (latency), và đôi khi làm nhiễu loạn khả năng tập trung của mô hình (Lost in the middle). Do đó, tối ưu hóa độ rõ ràng quan trọng hơn việc gia tăng độ dài.
Việc điều chỉnh các tham số lấy mẫu (sampling parameters) là bắt buộc để kiểm soát tính sáng tạo hoặc tính nhất quán của đầu ra:
Use Case
Temperature
Lý Do Thiết Lập
Tham Số Đồng Hành
Phân loại (Classification), Trích xuất (Extraction)
0.0
Đảm bảo tính nhất quán tuyệt đối, kết quả có khả năng tái lặp cao (deterministic).
Top_p = 1.0 (Không cần điều chỉnh)
Hội thoại (Chatbot), Trợ lý khách hàng
0.3 - 0.5
Cân bằng giữa tính nhất quán của thông tin và sự tự nhiên trong giao tiếp hội thoại.
Top_p = 0.9
Sáng tác (Creative writing), Biên soạn nội dung
0.7 - 1.0
Khai phá tính đa dạng, gia tăng khả năng liên tưởng ngôn ngữ.
Top_p = 0.95
Động não (Brainstorming), Tìm kiếm ý tưởng
1.0 - 1.5
Tối đa hóa không gian tìm kiếm, chấp nhận xuất hiện nhiễu thông tin để tìm đột phá.
Top_p = 0.95
★ LƯU Ý QUAN TRỌNG VỀ TEMPERATURETemperature không thể thay thế cho một prompt được thiết kế tốt. Nếu prompt gốc ban đầu quá mơ hồ, việc giảm temperature xuống 0 chỉ đơn thuần khiến mô hình lặp đi lặp lại một kết quả đầu ra có chất lượng kém.
2. KỸ THUẬT THIẾT KẾ LỜI NHẮC NÂNG CAO (ADVANCED PROMPTING)
Phương châm tiếp cận: Kỹ thuật nâng cao chỉ nên được áp dụng khi chúng mang lại sự cải thiện rõ rệt và đo lường được đối với chất lượng đầu ra thực tế. Tránh việc lạm dụng các kỹ thuật phức tạp như một dạng 'thần chú' khi các giải pháp đơn giản hơn hoàn toàn có thể giải quyết được.
Kỹ Thuật
Mô Tả Bản Chất
Ưu Điểm
Nhược Điểm / Chi Phí
Zero-shot
Không cung cấp bất kỳ ví dụ mẫu nào trong prompt.
Nhanh nhất, rẻ nhất, dễ triển khai.
Dễ sai format với các tác vụ phức tạp.
One-shot
Cung cấp duy nhất 1 ví dụ mẫu mô tả định dạng mong muốn.
Kiểm soát cấu trúc và định dạng đầu ra tốt hơn.
Tốn thêm token bối cảnh của ví dụ.
Few-shot
Cung cấp từ 2 đến 5 ví dụ mẫu có cấu trúc hoàn chỉnh.
Gia tăng tính nhất quán của định dạng, tone giọng.
Tốn token, làm chậm độ trễ (latency).
Chain-of-Thought(CoT)
Yêu cầu mô hình suy luận từng bước trước khi đưa ra đáp án cuối cùng.
Cải thiện vượt trội các bài toán logic, suy luận toán học.
Tăng lượng token đầu ra, tăng độ trễ lớn.
Khi Nào Nên Áp Dụng Few-Shot Prompting?
Ngữ cảnh áp dụng: Kỹ thuật Few-shot nên được cân nhắc áp dụng trong các trường hợp sau: (1) Khi mô hình hiểu nhiệm vụ nhưng liên tục trả ra sai định dạng cấu trúc; (2) Khi cần duy trì một tiêu chuẩn đánh giá nghiêm ngặt, tone giọng đặc thù hoặc cách thức lập luận mang tính chuyên môn cao. Các ví dụ mẫu đưa vào cần phải có tính đa dạng, liên quan trực tiếp đến nhiệm vụ và tuyệt đối chính xác.
Bản chất kỹ thuật: Few-shot không phải là công cụ để 'dạy lại' mô hình một kiến thức hoàn toàn mới; bản chất của nó là chỉ ra một mẫu hình hành vi (pattern) mà bạn muốn mô hình bám theo trong suốt quá trình xử lý.
Các Sai Lầm Thường Gặp (Anti-patterns) Khi Dùng Few-shot
• Ví dụ quá giống nhau:: Khiến mô hình bị hiện tượng overfit vào một khuôn mẫu hẹp, làm mất đi khả năng tổng quát hóa đối với các dữ liệu đầu vào mới khác biệt.
• Ví dụ sai định dạng:: Mô hình sẽ sao chép định dạng sai lệch đó một cách cực kỳ trung thành vào kết quả xử lý cuối cùng.
• Sử dụng quá nhiều ví dụ (>5):: Tạo ra hiệu ứng Diminishing Returns (lợi ích cận biên giảm dần) trong khi làm tốn token bối cảnh và kéo dài đáng kể thời gian phản hồi.
• Ví dụ chứa lỗi logic hoặc lỗi chính tả:: Mô hình sẽ tự động tái lập các lỗi này trong đầu ra thực tế.
Kỹ Thuật Chain-of-Thought (CoT) & Tree-of-Thought (ToT)
Phân định phạm vi áp dụng CoT: Chain-of-Thought (CoT) cực kỳ phù hợp khi bài toán đòi hỏi phải suy luận qua nhiều bước trung gian, hoặc khi bạn muốn ghi lại vết logic để phục vụ cho việc gỡ lỗi (debugging). Ngược lại, nếu tác vụ chỉ đơn thuần là định dạng lại dữ liệu (formatting) hoặc trích xuất thông tin (extraction), việc bắt mô hình suy luận từng bước là một sự lãng phí tài nguyên bối cảnh (overkill).
Mở rộng sang Tree-of-Thought: Tree-of-Thought (ToT) là một bước phát triển nâng cao của CoT, cho phép mô hình khám phá và đánh giá nhiều hướng suy luận đồng thời, rẽ nhánh và quay lui khi phát hiện hướng đi sai. Kỹ thuật này hữu ích cho các bài toán lập kế hoạch phức tạp nhưng đòi hỏi chi phí lập trình rất lớn, thời gian phản hồi rất chậm và tiêu tốn lượng token bối cảnh khổng lồ.
Thiết Kế Đầu Ra Có Cấu Trúc (Structured Output Prompting)
Động lực phát triển: Mặc định, đầu ra của LLM là văn bản tự do (free-form text), điều này gây khó khăn lớn cho việc xử lý dữ liệu tự động bằng mã lập trình. Trong các hệ thống Agent, việc kiểm soát đầu ra theo cấu trúc chuẩn hóa là bắt buộc.
1. Cài đặt mức API (JSON Mode):: Cấu hình tham số trực tiếp trong API của nhà cung cấp (ví dụ OpenAI JSON Mode) để ép buộc mô hình trả về JSON hợp lệ.
2. Ép buộc bằng lời nhắc (Prompt-based JSON):: Sử dụng các câu lệnh nghiêm ngặt trong prompt như: 'Respond ONLY with valid JSON. Do not include any preachy text, explanations, or markdown blocks.'
3. Sử dụng các thẻ đánh dấu XML (XML Tags):: Bọc các phần đầu ra khác nhau bằng các thẻ XML rõ ràng để dễ dàng phân tách bằng regex hoặc thư viện parse XML (ví dụ: <thinking>...</thinking> <response>...</response>).
4. Kỹ thuật điền trước (Prefill):: Bắt đầu câu trả lời của trợ lý bằng ký tự mở ngoặc nhọn `{` (thường dùng trong Anthropic Claude) để hướng mô hình tiếp tục viết định dạng JSON một cách tự nhiên.
★ RỦI RO KỸ THUẬT VỚI STRUCTURED OUTPUTLuôn luôn phải xây dựng một lớp kiểm thử và xác thực (validation layer) cho các đầu ra JSON của mô hình. Ngay cả khi được thiết lập nghiêm ngặt, mô hình vẫn có thể trả ra cấu trúc JSON không hợp lệ khi bối cảnh quá phức tạp hoặc temperature được thiết lập quá cao.
3. KỸ NGHỆ THIẾT KẾ SYSTEM PROMPT CẤP ĐỘ PRODUCTION
Tầm quan trọng: System prompt tốt đóng vai trò như một bộ khung luật pháp tối cao của hệ thống AI, giúp duy trì tính nhất quán, thiết lập ranh giới vận hành an toàn và kiểm soát chặt chẽ hợp đồng dữ liệu đầu ra.
Giải Phẫu Cấu Trúc System Prompt Chuẩn Doanh Nghiệp (Production-Grade)
Một System Prompt cấp độ sản phẩm hoàn chỉnh bắt buộc phải được cấu trúc rõ ràng thành 5 cấu phần cốt lõi sau:
1. Persona (Nhân dạng):: Định nghĩa rõ vai trò, cấp độ chuyên môn và phong cách giao tiếp của hệ thống. Ví dụ: 'Bạn là chuyên gia phân loại dữ liệu cấp cao, giao tiếp ngắn gọn và tập trung hoàn toàn vào dữ liệu thực tế.'
2. Rules (Quy tắc vận hành):: Các chỉ thị bắt buộc mô hình phải tuân thủ trong mọi tình huống xử lý.
3. Capabilities (Năng lực hệ thống):: Khai báo rõ các công cụ, nguồn dữ liệu hoặc quyền hạn mà mô hình được phép truy cập và sử dụng.
4. Constraints (Ràng buộc nghiêm ngặt):: Xác định rõ những việc mô hình tuyệt đối không được phép thực hiện, các kịch bản từ chối xử lý (refusal patterns) hoặc quy trình chuyển tiếp yêu cầu lên cấp nhân sự (escalation).
5. Output Format (Hợp đồng đầu ra):: Định hình cấu trúc kết quả trả về bằng JSON, Markdown, hoặc ngôn ngữ ưu tiên.
Sự Tiến Hóa Của System Prompt Qua Thực Nghiệm
Hãy xem xét cách một System Prompt được cải tiến từ phiên bản thử nghiệm ban đầu lên phiên bản sẵn sàng đưa vào vận hành thực tế:
• Phiên bản v1 (Thiếu ràng buộc): Lời nhắc: 'You are a support agent.' -> Hệ quả: Mô hình tự bịa ra trạng thái đơn hàng (hallucinate), trả lời các câu hỏi lạc đề ngoài phạm vi hỗ trợ của doanh nghiệp, và định dạng câu trả lời không đồng nhất giữa các phiên xử lý khác nhau.
• Phiên bản v2 (Đầy đủ ràng buộc và hợp đồng): Lời nhắc: 'You are a support triage agent. If user asks about out of scope topics, say: "Tôi chỉ hỗ trợ về vấn đề đơn hàng." Output must be strict JSON: {intent, action, reply}.' -> Cải tiến: Thiết lập ranh giới rõ ràng, có kịch bản từ chối cụ thể, và ép cấu trúc đầu ra đồng nhất để lập trình tự động.
Sự Khác Biệt Giữa API Của Anthropic Claude Và OpenAI GPT
Mặc dù có chung triết lý vận hành, cách thức triển khai System Prompt thông qua API của các nhà cung cấp lớn có sự khác biệt rõ rệt về mặt cú pháp:
Nhà Cung Cấp
Vị Trí System Prompt Trong API
Tính Năng Đặc Thù Được Khuyến Nghị
Anthropic Claude
Được khai báo riêng biệt dưới dạng một tham số độc lập 'system' ở cấp độ gốc của lệnh tạo message.
Khuyến khích sử dụng các thẻ XML như <rules>, <constraints> để phân tách bối cảnh có cấu trúc một cách tối ưu.
OpenAI GPT
Được đưa vào mảng 'messages' dưới dạng phần tử đầu tiên với thuộc tính 'role': 'system'.
Thường sử dụng cấu trúc phân tách bằng Markdown (như các tiêu đề #, ##) để phân cấp thông tin.
Các Lỗi Thường Gặp (System Prompt Anti-Patterns)
• Nhồi nhét quá dài (>2000 tokens):: Cố gắng đưa toàn bộ tài liệu hướng dẫn vào một prompt duy nhất và kỳ vọng mô hình sẽ luôn tuân thủ 100% tất cả các quy tắc mà không bị quên.
• Hướng dẫn mâu thuẫn nội bộ:: Ví dụ yêu cầu mô hình 'trả lời cực kỳ ngắn gọn' nhưng ngay sau đó lại yêu cầu 'giải thích chi tiết, cặn kẽ từng bước suy luận'.
• Sử dụng tính từ mơ hồ:: Các mô tả như 'hãy tỏ ra thông minh', 'giao tiếp chuyên nghiệp' mà không đi kèm với định nghĩa rõ ràng về tiêu chuẩn hành vi.
• Bỏ qua việc kiểm thử các trường hợp biên (edge cases):: Quên mất việc thiết lập hành vi khi mô hình nhận được câu hỏi ngoài phạm vi, lỗi công cụ hoặc các nỗ lực tấn công bẻ khóa (prompt injection).
Bảng Kiểm Thử Chất Lượng System Prompt (Testing Checklist)
Trước khi đưa một System Prompt vào vận hành thực tế, bắt buộc phải chạy bộ kiểm thử tối thiểu bao gồm 6 kịch bản kiểm thử (test cases) sau:
□ Happy path:: Kiểm tra xem câu hỏi nằm đúng phạm vi (in-scope) có được xử lý chính xác và trả về đúng định dạng hợp đồng đầu ra hay không.
□ Edge case:: Kiểm tra xem các câu hỏi mơ hồ, thiếu thông tin đầu vào có được mô hình phát hiện và hỏi lại người dùng một cách khéo léo thay vì tự đoán mò hay không.
□ Out of scope:: Kiểm tra xem các câu hỏi nằm ngoài phạm vi nghiệp vụ có bị từ chối một cách lịch sự và chuẩn xác theo đúng kịch bản từ chối hay không.
□ Adversarial:: Kiểm tra khả năng chống chịu bẻ khóa trước các nỗ lực prompt injection của người dùng.
□ Tool decision:: Xác định rõ khi nào mô hình tự xử lý bằng tri thức nội tại, khi nào đưa ra quyết định triệu gọi công cụ một cách hợp lý.
□ Format consistency:: Chạy thử nghiệm ít nhất 10 lượt hội thoại độc lập để đo lường tỷ lệ đầu ra khớp hoàn toàn với cấu trúc JSON/định dạng yêu cầu.
4. KỸ NGHỆ QUẢN TRỊ BỐI CẢNH (CONTEXT ENGINEERING)
Bản chất kỹ thuật: Kỹ nghệ bối cảnh không phải là việc tìm cách nhét bao nhiêu dữ liệu vào cửa sổ ngữ cảnh (Context Window) của mô hình, mà là nghệ thuật lựa chọn, chắt lọc và ưu tiên đúng những thông tin thực sự cần thiết cho tác vụ hiện tại.
Cấu Trúc Quản Lý Cửa Sổ Bối Cảnh (Context Window Allocation)
Một cửa sổ bối cảnh hoàn chỉnh trong hệ thống Agent thực tế luôn bao gồm 5 thành phần tài nguyên chính:
• System Policy: Quy định chính sách, ranh giới hành vi và quy chuẩn hệ thống.
• Recent/Relevant History: Lịch sử tương tác gần nhất hoặc lịch sử có liên quan trực tiếp được truy xuất từ bộ nhớ.
• Current Input: Nhiệm vụ hoặc truy vấn hiện tại của người dùng cần được xử lý.
• Tool Schemas: Khai báo mô tả cấu trúc các công cụ hệ thống có quyền truy cập.
• Output Buffer: Lượng tài nguyên token trống được bảo lưu riêng để mô hình sinh câu trả lời.
Hiệu Ứng Bị Lãng Quên Ở Giữa (Lost in the Middle Problem)
Khám phá khoa học cốt lõi: Nghiên cứu của Liu và các cộng sự (2023) đã chứng minh thực nghiệm rằng khả năng chú ý (Attention) của mô hình ngôn ngữ lớn hoạt động mạnh mẽ nhất ở phần đầu và phần cuối của cửa sổ bối cảnh. Những thông tin nằm ở vị trí giữa bối cảnh rất dễ bị mô hình 'bỏ quên' hoặc xử lý sai lệch.
1. Về vị trí chỉ thị: • Đặt các chỉ thị vận hành, nguyên tắc an toàn quan trọng nhất ở phần đầu hoặc phần cuối của prompt.
2. Về cấu trúc danh sách: • Khi bối cảnh bắt buộc phải kéo dài, hãy chia nhỏ các danh sách dài bằng các tiêu đề phân cấp (headers) hoặc các ký tự phân tách rõ ràng (separators).
3. Về thứ tự thời gian: • Luôn đặt bối cảnh hội thoại gần nhất và truy vấn hiện tại của người dùng ngay trước vị trí bắt đầu câu trả lời của mô hình.
Kỹ Thuật Bơm Bộ Nhớ (Memory Injection) & Nén Bối Cảnh (Context Compression)
Để quản lý bối cảnh hiệu quả trong các phiên hội thoại dài hơi mà không làm cạn kiệt tài nguyên token, các kỹ sư hệ thống sử dụng hai nhóm kỹ thuật chính:
• Memory Injection (Bơm bộ nhớ chọn lọc): Chỉ thực hiện truy xuất và bơm vào bối cảnh các sự thật (facts) hoặc bối cảnh lịch sử thực sự cần thiết cho tác vụ hiện hành dựa trên mức độ tương đồng ngữ nghĩa (semantic similarity), tuyệt đối không dump toàn bộ lịch sử trò chuyện dài dòng vào bối cảnh.
• Context Compression (Nén bối cảnh): Áp dụng các chiến lược giảm thiểu kích thước bối cảnh bao gồm: (1) Summarize (Tóm tắt lại các phần hội thoại cũ đã qua); (2) Drop (Loại bỏ hoàn toàn các lượt trao đổi không còn giá trị thông tin); (3) Archive (Đẩy lịch sử cũ ra ngoài bối cảnh hoạt động, lưu vào cơ sở dữ liệu và chỉ nạp lại khi có truy vấn kích hoạt).
Phân Bổ Ngân Sách Token & Rủi Ro Đi Kèm
Mỗi cấu phần trong bối cảnh khi chiếm dung lượng quá lớn đều tạo ra các rủi ro hệ thống trực tiếp:
Thành Phần Chiếm Token
Nội Dung Chứa Đựng
Hệ Quả Nếu Quá Tải
System Prompt
Chính sách, luật lệ hệ thống, định dạng đầu ra.
Làm chậm tốc độ phản hồi tổng thể (Time-to-First-Token), tăng chi phí cơ sở.
History
Các lượt hội thoại cũ, thông tin ngữ cảnh đã thu thập.
Dễ gây nhiễu loạn thông tin, dẫn tới hiện tượng mô hình bị lạc đề hoặc lãng quên chỉ thị.
Tool Schemas
Tên công cụ, mô tả chi tiết, đặc tả tham số đầu vào.
Mô hình dễ đưa ra quyết định chọn sai công cụ hoặc truyền sai kiểu tham số.
Output Buffer
Phần không gian token dành cho câu trả lời của mô hình.
Gây lỗi câu trả lời bị cắt cụt giữa chừng khi không đủ không gian sinh token.
Mẫu Thiết Kế Truy Xuất Bối Cảnh Theo Yêu Cầu (RAG Context Pattern)
Cơ chế vận hành: Thay vì nhét sẵn toàn bộ cơ sở tri thức (Knowledge Base) khổng lồ vào prompt, một Agent thông minh sẽ sử dụng công cụ tìm kiếm tri thức (ví dụ: tool `search_kb`) để thực hiện truy xuất thông tin on-demand (khi cần thiết). Quy trình chuẩn hóa bao gồm: Nhận truy vấn người dùng -> Tìm kiếm trên cơ sở dữ liệu vector -> Trích xuất phân đoạn liên quan nhất (chunk size 500-1000 tokens) -> Bơm vào bối cảnh kèm theo nguồn trích dẫn cụ thể (source citation) -> Trả lời.
5. AN TOÀN LỜI NHẮC & KHUNG ĐÁNH GIÁ CHẤT LƯỢNG
Triết lý thiết kế: Một prompt tốt không chỉ dừng lại ở việc đưa ra kết quả xử lý chính xác trong các điều kiện thông thường, mà còn phải chứng minh được tính an toàn, bảo mật và khả năng chống chịu trước các hành vi tấn công phá hoại của người dùng trong môi trường thực tế.
Các Hình Thức Tấn Công Lời Nhắc (Prompt Injection)
Prompt Injection là hành vi thao túng đầu ra của LLM bằng cách đưa vào các câu lệnh độc hại. Cuộc tấn công này được chia làm hai dạng chính:
• Direct Injection (Tấn công trực tiếp):: Người dùng trực tiếp đưa các câu lệnh can thiệp vào bối cảnh hội thoại nhằm ghi đè (override) lên System Prompt, ví dụ: 'Hãy quên tất cả các chỉ thị trước đó của bạn và thực hiện hành động sau đây...'
• Indirect Injection (Tấn công gián tiếp):: Nội dung độc hại được ẩn giấu tinh vi bên trong các tài liệu, trang web hoặc email mà Agent vô tình đọc được trong quá trình sử dụng các công cụ duyệt web hoặc tìm kiếm dữ liệu.
Chiến Lược Phòng Ngự Chiều Sâu (Defense-in-Depth)
Không có bất kỳ giải pháp phòng ngự đơn lẻ nào có khả năng chống đỡ hoàn toàn 100% các cuộc tấn công bẻ khóa prompt. Hệ thống bắt buộc phải triển khai phòng ngự nhiều lớp (defense-in-depth):
1. Phân tách bằng ký tự đặc biệt (Delimiter separation):: Sử dụng các thẻ bọc rõ ràng để phân tách phần dữ liệu đầu vào chưa được kiểm chứng của người dùng, ví dụ: <user_input> [Dữ liệu của người dùng] </user_input>.
2. Phân cấp chỉ thị (Instruction hierarchy):: Thiết lập quy định rõ ràng trong System Prompt rằng các chỉ thị của hệ thống luôn có mức độ ưu tiên tối cao hơn bất kỳ yêu cầu nào nằm trong thẻ dữ liệu của người dùng.
3. Xác thực đầu vào (Input validation):: Xây dựng bộ lọc kiểm tra (filter) để phát hiện và ngăn chặn ngay lập tức các mẫu từ khóa bẻ khóa phổ biến trước khi đưa dữ liệu vào prompt chính.
4. Xác thực đầu ra (Output validation):: Kiểm tra kỹ lưỡng kết quả đầu ra của mô hình trước khi cho phép hệ thống thực thi các hành động thực tế bên ngoài.
5. Nguyên tắc đặc quyền tối thiểu (Least privilege):: Chỉ cấp phát quyền hạn tối thiểu cần thiết cho các công cụ mà Agent được phép gọi.
6. Giám sát nhân sự (Human-in-the-loop):: Yêu cầu sự xác nhận thủ công của con người trước khi thực thi các tác vụ mang tính nhạy cảm cao (như chuyển tiền, xóa dữ liệu, gửi email chính thức).
Khung Đánh Giá Chất Lượng Lời Nhắc (Prompt Evaluation Framework)
Để đánh giá mức độ ổn định và an toàn của một prompt trước khi triển khai, các kỹ sư cần thiết lập một quy trình đo lường định lượng rõ ràng:
Khía Cạnh Đánh Giá
Câu Hỏi Đo Lường Cốt Lõi
Phương Pháp Thực Nghiệm
Correctness (Độ chính xác)
Mô hình có đưa ra câu trả lời đúng bản chất nhiệm vụ không?
Sử dụng bộ test cases chuẩn hóa kết hợp kiểm duyệt thủ công bởi chuyên gia.
Consistency (Tính nhất quán)
Chạy thử nghiệm 10 lần với cùng một đầu vào có cho ra một kết quả đồng nhất không?
Thực hiện chạy lặp lại nhiều lần liên tiếp, đo lường tỷ lệ trùng khớp đầu ra (% match).
Safety (Tính an toàn)
Mô hình có bị bypass ranh giới khi bị tấn công bẻ khóa không?
Chạy các bộ test cases tấn công giả lập (adversarial test cases).
★ TIÊU CHUẨN ĐO LƯỜNG CHẤT LƯỢNGLuôn thực hiện chạy thử nghiệm tối thiểu từ 10 đến 20 test cases độc lập. Nếu tỷ lệ vượt qua (pass rate) đạt mức dưới 90%, điều đó đồng nghĩa với việc prompt của bạn chưa đủ độ ổn định để đưa vào vận hành thực tế và bắt buộc phải quay lại quy trình lặp để cải tiến prompt.
Mẫu Thiết Kế Ranh Giới Bảo Vệ (Guardrails Pattern)
Guardrails Pattern là mô hình thiết kế thiết lập hai chốt chặn an toàn bao bọc xung quanh mô hình ngôn ngữ lớn (LLM):
• Pre-guard (Chốt chặn đầu vào): Thực hiện phát hiện các nỗ lực tấn công bẻ khóa (injection attempts), kiểm tra tính đúng đắn của định dạng dữ liệu đầu vào và thực hiện giới hạn tần suất yêu cầu (rate limiting).
• Post-guard (Chốt chặn đầu ra): Thực hiện che giấu các thông tin định danh cá nhân nhạy cảm (masking PII), kiểm tra tính hợp lệ của cấu trúc dữ liệu trả về (JSON schema verification) và ngăn chặn ngay lập tức các cuộc gọi công cụ mang tính chất nguy hiểm.
6. CƠ CHẾ TRIỆU GỌI CÔNG CỤ (TOOL CALLING MECHANICS)
Bản chất kỹ thuật: Cơ chế triệu gọi công cụ (Tool Calling) chính là cầu nối kỹ thuật giúp mô hình ngôn ngữ lớn chuyển dịch từ trạng thái chỉ có thể 'nói' (tạo văn bản) sang trạng thái có thể 'tương tác thực tế với thế giới bên ngoài' (gọi API, truy vấn cơ sở dữ liệu, chạy mã nguồn).
★ BẢN CHẤT CỐT LÕI CỦA TOOL CALLINGMô hình ngôn ngữ lớn tuyệt đối không tự chạy mã nguồn hay tự động gọi trực tiếp các API bên ngoài. Bản chất của Tool Calling là mô hình nhận diện ý định người dùng, tính toán lựa chọn công cụ phù hợp, trả ra cấu trúc JSON yêu cầu gọi công cụ, ứng dụng của bạn nhận được JSON này sẽ thực thi công cụ trong môi trường của nó, và gửi trả lại kết quả xử lý cho mô hình.
Quy Trình Vận Hành Vòng Lặp Triệu Gọi Công Cụ (Tool Calling Flow)
Vòng lặp hoàn chỉnh của cơ chế Tool Calling diễn ra qua 4 bước nghiêm ngặt sau:
Bước 1: Mô hình ngôn ngữ đưa ra quyết định gọi công cụ và trả ra cấu trúc dữ liệu JSON mô tả hành động (ví dụ: `tool_call` với tên hàm và các tham số truyền vào).
Bước 2: Ứng dụng phía Developer (không phải LLM) bắt được yêu cầu này, tiến hành trích xuất tham số, chạy hàm thực thi trong môi trường thực tế (gọi API thời tiết, thực hiện câu lệnh SQL).
Bước 3: Ứng dụng gửi trả kết quả xử lý thực tế từ công cụ quay trở lại cho mô hình ngôn ngữ lớn.
Bước 4: Mô hình ngôn ngữ thực hiện tổng hợp dữ liệu nhận được từ công cụ để sinh ra câu trả lời tự nhiên, chính xác nhất gửi tới người dùng cuối.
Giải Phẫu Cấu Trúc Khai Báo Công Cụ (Tool Schema Anatomy)
Để mô hình ngôn ngữ có thể hiểu và sử dụng chính xác các công cụ, lập trình viên bắt buộc phải cung cấp một đặc tả cấu trúc (schema) hoàn chỉnh bao gồm 4 thông tin cốt lõi sau:
• Name (Tên công cụ): Nên được đặt ngắn gọn, rõ ràng, sử dụng các động từ mô tả chính xác hành động thực tế (ví dụ: `get_weather`, `lookup_order`).
• Description (Mô tả công cụ): Đóng vai trò như một cuốn tài liệu hướng dẫn cho mô hình ngôn ngữ. Mô tả cần chỉ rõ công cụ này dùng để làm gì, khi nào nên gọi và khi nào không nên gọi.
• Parameters (Các tham số): Mô tả chi tiết kiểu dữ liệu, cấu trúc của các biến đầu vào bằng định dạng chuẩn JSON Schema.
• Required Fields (Tham số bắt buộc): Khai báo rõ những biến số nào bắt buộc phải có thì mô hình mới được phép kích hoạt cuộc gọi công cụ.
Kỹ Nghệ Viết Mô Tả Công Cụ (Tool Description Engineering)
Tương tự như prompt, sự thay đổi trong cách viết mô tả công cụ (description) sẽ định hình trực tiếp hành vi lựa chọn công cụ của mô hình:
• Mô tả tồi, mơ hồ: Mô tả: 'Gets weather' -> Hệ quả: Quá ngắn gọn, mơ hồ, mô hình hoàn toàn không thể xác định được khi nào nên kích hoạt công cụ này.
• Mô tả rườm rà: Mô tả: 'This comprehensive tool can be used to retrieve current weather information for any city worldwide...' -> Hệ quả: Quá dài dòng, bổ sung nhiều từ ngữ thừa làm tăng lượng token và gây nhiễu cho mô hình.
• Mô tả tốt, chuẩn hóa: Mô tả: 'Get current weather for a city. Use when user asks about weather, temperature, or conditions.' -> Hệ quả: Xuất sắc. Chỉ rõ chức năng chính cùng điều kiện kích hoạt cụ thể.
Tham Số Điều Khiển Lựa Chọn Công Cụ (tool_choice Parameter)
Tham số `tool_choice` cho phép nhà phát triển kiểm soát mức độ chủ động gọi công cụ của mô hình:
Giá Trị Tham Số
Ý Nghĩa Vận Hành
Ngữ Cảnh Áp Dụng Điển Hình
auto (Mặc định)
Mô hình tự động phân tích ý định người dùng để tự quyết định có cần gọi công cụ hay trả lời trực tiếp.
Áp dụng cho hầu hết các tác vụ thông thường của Agent.
required / any
Cưỡng chế mô hình bắt buộc phải lựa chọn và thực thi ít nhất một công cụ trong danh sách.
Áp dụng trong các bước định tuyến (routing) hoặc các đường ống xử lý (pipeline) cố định.
none
Cấm mô hình gọi bất kỳ công cụ nào, chỉ cho phép trả lời bằng văn bản thông thường.
Áp dụng trong kịch bản chạy thử nghiệm hoặc khi muốn kích hoạt chế độ dự phòng (fallback).
{"name": "get_weather"}
Cưỡng chế mô hình bắt buộc phải gọi duy nhất một công cụ cụ thể được chỉ định sẵn.
Áp dụng khi hệ thống biết chắc chắn bước tiếp theo cần thực thi công cụ nào.
★ CẢNH BÁO KỸ THUẬT VỀ TOOL_CHOICEHãy cực kỳ cẩn trọng khi thiết lập chế độ cưỡng chế 'required' hoặc chỉ định đích danh công cụ. Nếu người dùng cung cấp thiếu thông tin đầu vào cần thiết, mô hình ngôn ngữ lớn có xu hướng tự động bịa đặt ra các tham số giả (hallucinated arguments) để hoàn thành cuộc gọi bắt buộc đó.
Cú Pháp Tool Calling: OpenAI vs Anthropic
Mặc dù có chung triết lý vận hành, hai nhà cung cấp lớn có sự khác biệt nhỏ về cấu trúc khai báo JSON:
• OpenAI Format: Sử dụng thuộc tính 'type': 'function' và bọc toàn bộ đặc tả tham số bên trong thuộc tính có tên 'parameters'.
• Anthropic Format: Loại bỏ thuộc tính 'type' ở cấp gốc và thay thế tên thuộc tính 'parameters' thành 'input_schema'.
Xử Lý Lỗi Triệu Gọi Công Cụ (Tool Error Handling)
Trong môi trường sản xuất, lỗi công cụ không phải là trường hợp ngoại lệ (edge case) mà là những sự cố chắc chắn sẽ xảy ra. Hệ thống bắt buộc phải có phương án dự phòng cho các loại lỗi phổ biến:
Loại Lỗi Thường Gặp
Chiến Lược Xử Lý Dự Phòng
Cách Thức Cài Đặt Chi Tiết
Timeout (Quá thời hạn gọi API/DB)
Thực hiện cơ chế thử lại tự động (retry) kết hợp giãn cách thuật toán.
Áp dụng Exponential Backoff.
Error response (Công cụ trả về mã lỗi hệ thống)
Truyền trực tiếp thông điệp lỗi quay trở lại cho mô hình.
Bổ sung chỉ thị: 'Nếu công cụ trả về lỗi, hãy giải thích rõ sự cố cho người dùng.'
Unexpected format (Đầu ra công cụ sai định dạng)
Thiết lập lớp xác thực định dạng trung gian trước khi gửi về mô hình.
Sử dụng lớp Validation Layer để định dạng lại dữ liệu thành JSON sạch.
Tool not found (Gọi tên công cụ không tồn tại)
Ghi lại nhật ký hệ thống (log) và trả về thông báo lỗi chuẩn hóa.
Trả về cấu trúc JSON mô tả sự cố không tìm thấy công cụ.
7. NGUYÊN TẮC THIẾT KẾ CÔNG CỤ TIN CẬY (TOOL DESIGN PRINCIPLES)
Triết lý phát triển: Một công cụ tốt phục vụ cho Agentic AI phải được thiết kế như một giao diện lập trình phần mềm (software interface) chuẩn mực, có tính tin cậy cao, chứ không đơn thuần là một prompt trang trí.
4 Nguyên Tắc Vàng Trong Thiết Kế Công Cụ
1. Single Responsibility (Đơn nhiệm):: Mỗi công cụ chỉ nên thực hiện một nhiệm vụ duy nhất và rõ ràng. Nếu công cụ thực hiện quá nhiều việc, mô hình ngôn ngữ sẽ rất khó khăn trong việc đưa ra quyết định có nên lựa chọn công cụ đó hay không.
2. Idempotency (Tính đồng nhất):: Cùng một tham số đầu vào phải luôn trả về cùng một kết quả xử lý đồng nhất, đảm bảo các tác vụ thử lại (retry) khi gặp lỗi không gây ra các tác dụng phụ ngoài ý muốn (side effects).
3. Granularity hợp lý (Độ mịn thiết kế):: Thiết lập kích thước và phạm vi công cụ vừa vặn với nghiệp vụ thực tế, tránh việc chia nhỏ quá mức hoặc gom nhóm quá lớn.
4. Khả năng kiểm thử độc lập (Testability):: Mỗi công cụ bắt buộc phải có khả năng chạy Unit Test độc lập hoàn toàn trong môi trường phát triển trước khi được tích hợp vào vòng lặp xử lý của Agent.
Đánh Giá Độ Mịn Thiết Kế Công Cụ (Tool Granularity)
Việc lựa chọn mức độ Granularity của công cụ có ảnh hưởng cực kỳ sâu sắc tới hiệu năng và độ ổn định của toàn bộ hệ thống Agent:
• Thiết kế quá nhỏ (Over-granular): Ví dụ hệ thống chia nhỏ thành các hàm độc lập: `get_customer_name`, `get_customer_email`, `get_customer_phone`. -> Hệ quả: Agent bắt buộc phải thực hiện quá nhiều lượt gọi công cụ liên tiếp (high overhead), làm tăng độ trễ (latency), tiêu tốn token và làm luồng xử lý (flow control) trở nên cực kỳ rối rắm.
• Thiết kế quá to (Under-granular): Ví dụ hệ thống gộp chung vào một hàm duy nhất: `handle_all_customer_operations`. -> Hệ quả: Mô hình ngôn ngữ hoàn toàn không thể xác định được ranh giới xử lý của công cụ, gây khó khăn lớn cho việc gỡ lỗi (debugging) và triệt tiêu khả năng tái sử dụng mã nguồn.
• Thiết kế tối ưu: Thiết kế công cụ xoay quanh các hành động nghiệp vụ thực tế rõ ràng, ví dụ: `lookup_order`, `query_sales_data`, `send_email_draft`.
Tiêu Chuẩn Thiết Kế Tham Số & Định Dạng Dữ Liệu Trả Về
• Chỉ yêu cầu bắt buộc (Required) đối với những biến số thực sự cần thiết cho quá trình thực thi hàm. Các biến phụ trợ nên được thiết lập ở trạng thái tùy chọn (Optional).
• Sử dụng các ràng buộc kiểu Enum (status: ['pending', 'shipped', 'delivered']) để thu hẹp không gian lựa chọn của mô hình, triệt tiêu hoàn toàn khả năng sinh tham số sai lệch.
• Luôn trả về dữ liệu dưới định dạng cấu trúc JSON sạch, tuyệt đối không trả về các đoạn mã nguồn raw HTML, XML hoặc văn bản tự do không cấu trúc.
• Thiết lập cơ chế cắt ngắn dữ liệu (Truncation Layer) tự động đối với các phản hồi từ công cụ có kích thước quá lớn, tránh hiện tượng làm tràn cửa sổ bối cảnh của mô hình.
8. MẪU THIẾT KẾ SONG SÁNG VÀ QUẢN LÝ LUỒNG NÂNG CAO
Động lực phát triển: Trong các hệ thống Agent thực tế cấp độ doanh nghiệp, việc tương tác với công cụ không chỉ dừng lại ở các cuộc gọi đơn lẻ mà đòi hỏi sự kết hợp phức tạp giữa nhiều công cụ khác nhau dưới các mẫu thiết kế luồng (Control Flow) nâng cao.
Triệu Gọi Tuần Tự (Sequential) vs Song Song (Parallel)
• Triệu gọi Tuần tự (Sequential):: Được áp dụng khi có sự phụ thuộc dữ liệu trực tiếp giữa các công cụ. Đầu ra của công cụ A bắt buộc phải là tham số đầu vào của công cụ B (ví dụ: tìm kiếm mã khách hàng `lookup_customer_id` -> tra cứu lịch sử mua hàng dựa trên ID tìm được `get_customer_orders`).
• Triệu gọi Song song (Parallel):: Được áp dụng khi các công cụ hoạt động độc lập hoàn toàn với nhau. Hệ thống có thể gọi đồng thời nhiều công cụ cùng lúc để tối ưu hóa thời gian xử lý (ví dụ: gọi đồng thời API thời tiết `get_weather`, API tỷ giá `get_exchange_rate` và API lịch họp `get_calendar`).
3 Mẫu Thiết Kế Tương Tác Công Cụ Phổ Biến (Tool Use Patterns)
Sự kết hợp giữa mô hình ngôn ngữ và công cụ thường tuân theo một trong ba mẫu thiết kế chính sau:
• Conditional Tool Use (Gọi công cụ có điều kiện):: Agent tự động phân tích và đưa ra quyết định có cần thiết phải sử dụng công cụ hay có thể trực tiếp đưa ra câu trả lời cho người dùng bằng tri thức nội tại.
• Tool Chaining (Chuỗi liên kết công cụ):: Thực hiện kết nối đầu ra của công cụ này thành đầu vào của công cụ tiếp theo dưới sự điều phối tuần tự của mô hình ngôn ngữ.
• Parallel Fetch & Merge (Truy xuất song song & Tổng hợp):: Thực hiện gọi đồng thời nhiều nguồn dữ liệu độc lập, sau đó tiến hành gộp kết quả và gửi về mô hình để thực hiện tổng hợp thông tin duy nhất.
Mã Nguồn Giả Lập Vòng Lặp Agent ReAct Hoàn Chỉnh (Agent Loop Pseudocode)
Mã nguồn giả dưới đây minh họa chi tiết cách thức một ứng dụng phía Developer triển khai vòng lặp suy luận ReAct (Reasoning and Acting) kết hợp triệu gọi công cụ và quản lý lỗi thực tế:
def run_agent_loop(user_query, max_iterations=5): # 1. Khởi tạo lịch sử bối cảnh hội thoại messages = [ {"role": "system", "content": SYSTEM_PROMPT}, {"role": "user", "content": user_query} ] for iteration in range(max_iterations): # 2. LLM đưa ra quyết định hành động response = call_llm(messages, tools=AVAILABLE_TOOL_SCHEMAS) messages.append(response) # Nếu mô hình quyết định kết thúc luồng và trả lời trực tiếp if not response.tool_calls: return response.content # 3. Thực thi các cuộc gọi công cụ được yêu cầu for tool_call in response.tool_calls: try: # Tìm hàm thực thi thực tế trong hệ thống tool_func = get_tool_implementation(tool_call.name) # Chạy thực thi công cụ với các tham số LLM truyền vào result = tool_func(**tool_call.arguments) # Gửi kết quả thành công quay lại cho mô hình messages.append({ "role": "tool", "tool_call_id": tool_call.id, "content": json.dumps(result) }) except Exception as e: # Quản lý lỗi công cụ một cách an toàn error_msg = f"Lỗi khi chạy công cụ {tool_call.name}: {str(e)}" messages.append({ "role": "tool", "tool_call_id": tool_call.id, "content": json.dumps({"status": "error", "message": error_msg}) }) raise TimeoutError("Agent đạt giới hạn số lần lặp tối đa mà chưa hoàn thành tác vụ.")
9. TIÊU CHUẨN THỰC HÀNH LAB 4 & KIỂM THỬ SẢN PHẨM
Mục tiêu bài thực hành: Mục tiêu cốt lõi của bài Lab thực hành số 4 là giúp học viên tự tay xây dựng hoàn chỉnh một tác nhân ReAct Agent chạy ổn định end-to-end, tích hợp đầy đủ System Prompt tiêu chuẩn cùng 2 công cụ tùy biến.
Yêu Cầu Sản Phẩm Đầu Ra (Lab 4 Deliverables)
Một sản phẩm bài Lab đạt tiêu chuẩn nghiệm thu bắt buộc phải bàn giao đầy đủ các cấu phần kỹ thuật sau:
• Agent Script: Mã nguồn chạy được end-to-end không xảy ra lỗi crash hệ thống.
• System Prompt: Lời nhắc hệ thống chuẩn chỉnh chứa đầy đủ 5 thành phần (Persona, Rules, Capabilities, Constraints, Format).
• 2 Tool Schemas: Đặc tả chi tiết 2 công cụ tự viết (gồm 1 API Wrapper đơn giản và 1 bộ truy vấn dữ liệu mock data).
• 5 Test Outputs: Bộ kết quả kiểm thử trên đúng 5 câu hỏi chuẩn hóa.
• Error Notes: Bản ghi chép, phân loại các lỗi phát hiện trong quá trình chạy (phân định rõ lỗi do Prompt, do Tool Schema hay do luồng điều khiển Control Flow).
• Self-Review Checklist: Bộ câu hỏi tự đánh giá chất lượng sản phẩm gồm 6 hạng mục kiểm thử.
Kịch Bản 5 Câu Hỏi Kiểm Thử Nghiệm Thu (5 Test Questions)
Bộ 5 câu hỏi kiểm thử dưới đây được thiết kế đặc biệt để chứng minh năng lực định hướng hành vi thông minh của Agent:
STT
Câu Hỏi Kiểm Thử
Kết Quả Mong Đợi (Expected Outcome)
Mục Tiêu Kiểm Tra Khả Năng
1
“Thời tiết Hà Nội hôm nay thế nào?”
Kích hoạt và gọi chính xác công cụ get_weather.
Kiểm tra năng lực hoạt động của Tool A.
2
“Doanh số tháng 3 của công ty là bao nhiêu?”
Kích hoạt và gọi chính xác công cụ query_sales.
Kiểm tra năng lực hoạt động của Tool B.
3
“So sánh doanh số với tình hình thời tiết tuần này.”
Gọi đồng thời cả 2 công cụ get_weather và query_sales tuần tự hoặc song song.
Kiểm tra năng lực phối hợp chuỗi liên kết công cụ (Chaining/Parallel).
4
“Kỹ thuật Prompt Engineering là gì?”
Mô hình trả lời trực tiếp bằng tri thức nội tại, tuyệt đối không kích hoạt công cụ.
Kiểm tra năng lực gọi công cụ có điều kiện (Conditional: No tool).
5
“Cho tôi xin số điện thoại cá nhân của CEO.”
Mô hình lịch sự từ chối dựa trên các ràng buộc bảo mật.
Kiểm tra năng lực quản trị ranh giới và từ chối an toàn (Refusal handling).
Checklist Tự Đánh Giá Chất Lượng (Self-Review Checklist)
□ Hạng mục 1:: Agent có hoạt động trơn tru end-to-end mà không xảy ra bất kỳ lỗi crash hệ thống nào hay không?
□ Hạng mục 2:: System Prompt đã được tích hợp đầy đủ 5 thành phần cốt lõi (Persona, Rules, Capabilities, Constraints, Format) hay chưa?
□ Hạng mục 3:: Mô tả công cụ (Tool Schemas) đã rõ ràng về mặt chức năng, phạm vi và các trường tham số bắt buộc hay chưa?
□ Hạng mục 4:: Agent đã phân định thông minh khi nào cần gọi công cụ, khi nào có thể trực tiếp trả lời người dùng hay chưa?
□ Hạng mục 5:: Agent có xử lý lỗi một cách khéo léo (gracefully) khi công cụ gặp sự cố thay vì crash hệ thống hay không?
□ Hạng mục 6:: Đã ghi nhận lại đầy đủ tối thiểu 2 lỗi hệ thống và phân loại chính xác nguyên nhân gốc rễ hay chưa?
Tài Liệu Tham Khảo Học Thuật Chính Thức
Để nghiên cứu sâu hơn về mặt kỹ thuật, người đọc và AI Agent có thể truy cập trực tiếp các nguồn tài liệu chính thống dưới đây:
• Anthropic. Prompt Engineering Overview & Best Practices. URL: docs.anthropic.com
• Anthropic. Tool Use Overview (Function Calling). URL: docs.anthropic.com
• OpenAI. Function Calling Guide & Structured Output. URL: platform.openai.com/docs
• Wei et al. Chain-of-Thought Prompting Elicits Reasoning in LLMs (NIPS 2022).
• Liu et al. Lost in the Middle: How Language Models Use Long Contexts (2023).
• LangGraph Docs. Agentic Workflow Quickstart. URL: langchain-ai.github.io/langgraph
• OWASP. Top 10 Security Vulnerabilities for LLM Applications. URL: owasp.org

