# DOAN_KHOA_HTTT_SKILL — PHIÊN BẢN V5

## 0. TRIẾT LÝ THIẾT KẾ
Đây không phải một landing page công nghệ chung chung — đây là "Mái Nhà Xanh" của sinh viên khoa Hệ thống Thông tin. Ẩn dụ *mái nhà* (ấm áp, gắn kết, thuộc về) phải va chạm với chất *tech* (khoa CNTT, dữ liệu, hệ thống). Mọi lựa chọn thiết kế bên dưới phục vụ 2 trục này cùng lúc: **Ấm áp — Chính xác**. Nếu một chi tiết chỉ đẹp mà không nói được 1 trong 2 điều đó, bỏ nó đi.

Tránh 3 "default" mà AI hay rơi vào: (1) nền cam đất be be kiểu editorial chung chung, (2) nền đen với 1 màu neon acid, (3) tờ báo hairline không bo góc. Bộ token dưới đây được chốt cứng để không trôi về 1 trong 3 lối đó.

---

## 1. DESIGN TOKENS (TAILWIND V4 — `@theme` TRONG `src/styles.scss`)

### 1.1 Màu sắc — đầy đủ, có ngữ nghĩa
```scss
@theme {
  /* Thương hiệu — trục "chính xác/tech" */
  --color-primary:     #003087; /* Navy — màu Đoàn/Hội chính thức, dùng cho header, footer, text nhấn quan trọng */
  --color-tech:        #1E40AF; /* Blue điện — dùng cho link, icon active, border focus */
  --color-tech-light:  #3B82F6; /* Blue sáng hơn — hover state, glow nhẹ */

  /* Mái Nhà Xanh — trục "ấm áp/thuộc về" — BẮT BUỘC PHẢI CÓ, đây là chữ ký của brief */
  --color-green:       #16A34A; /* Xanh lá — dùng cho BADGE và trạng thái THÀNH CÔNG ("đang diễn ra", "đã đăng ký", toast xác nhận) */
  --color-green-light: #DCFCE7; /* Nền pill/badge xanh nhạt */

  /* Accent nhấn mạnh — dùng RIÊNG cho CTA chính, không lấn sang vai trò của xanh lá */
  --color-accent:       #DC2626; /* Đỏ — DUY NHẤT dùng cho: nút CTA chính (Đăng ký tham gia), số liệu nổi bật cần thu hút ngay lập tức */
  --color-accent-hover: #B91C1C; /* Hover/active của CTA đỏ */

  /* Nền & bề mặt */
  --color-surface:     #F8FAFC; /* Nền trang mặc định */
  --color-surface-alt: #EEF2FF; /* Nền section xen kẽ (tint xanh dương rất nhạt) — dùng để tạo nhịp, KHÔNG dùng xám trơn */
  --color-card:        #FFFFFF; /* Nền thẻ/card, luôn có shadow đi kèm để tách khỏi surface */
  --color-overlay:     rgba(26, 26, 46, 0.6); /* Lớp phủ modal/menu mobile */

  /* Chữ */
  --color-ink:         #1A1A2E; /* Text chính */
  --color-ink-muted:   #545468; /* Text phụ, mô tả, caption */
  --color-ink-subtle:  #9296A8; /* Placeholder, timestamp, metadata */
  --color-on-primary:  #FFFFFF; /* Text đặt trên nền primary/tech */

  /* Viền */
  --color-border:      #E2E8F0; /* Viền mặc định */
  --color-border-focus: var(--color-tech); /* Viền khi focus input */

  /* Semantic — bắt buộc có để không phải tự bịa khi làm form/thông báo */
  --color-success: #16A34A; /* trùng --color-green có chủ đích: "thành công" cũng là 1 dạng "ấm áp" */
  --color-warning: #D97706;
  --color-error:   #DC2626;
  --color-info:    var(--color-tech);
}
```
**Quy tắc dùng màu:** Có đúng 2 màu ấm trong toàn bộ site, mỗi màu 1 vai trò cố định, KHÔNG hoán đổi cho nhau:
- `--color-accent` (đỏ) → chỉ dùng cho CTA chính và số liệu cần thu hút mắt ngay. Một trang chỉ nên có 1 nút đỏ nổi bật nhất — nếu 2 CTA đỏ đứng cạnh nhau, một trong hai phải đổi thành `variant="outline"` (viền `--color-tech`, nền trắng).
- `--color-green` → chỉ dùng cho badge trạng thái và xác nhận thành công. Không dùng xanh lá cho nút bấm hành động.
Không thêm cam/vàng/hồng nào khác ngoài 2 màu này — nếu cần thêm accent thứ 3, quay lại sửa token này chứ không tự chế màu mới giữa chừng code.

### 1.2 Typography
```scss
@theme {
  --font-heading: "Montserrat", sans-serif; /* Chỉ dùng weight 600/700/800 — không dùng 400 cho heading */
  --font-body:    "Inter", sans-serif;      /* Weight 400/500 cho đọc, 600 cho nhấn inline */
  --font-mono:    "JetBrains Mono", monospace; /* CHỈ dùng cho: ngày giờ sự kiện, mã lớp/mã sinh viên, số liệu thống kê — không dùng cho câu văn thường */

  /* Type scale — tỉ lệ 1.25 (major third), base 16px */
  --text-caption: 0.75rem;  /* 12px — timestamp, label eyebrow */
  --text-body-sm: 0.875rem; /* 14px */
  --text-body:    1rem;     /* 16px — mặc định */
  --text-body-lg: 1.125rem; /* 18px — dẫn nhập/lead paragraph */
  --text-h6:      1.25rem;  /* 20px */
  --text-h5:      1.5625rem;/* 25px */
  --text-h4:      1.953rem; /* ~31px */
  --text-h3:      2.441rem; /* ~39px */
  --text-h2:      3.052rem; /* ~49px */
  --text-h1:      3.815rem; /* ~61px desktop — mobile clamp xuống 2.25rem, xem Gate 4 */
}
```

### 1.3 Spacing (bội số 4px — dùng để ép nhịp section nhất quán)
```scss
@theme {
  --space-1: 0.25rem;  --space-2: 0.5rem;   --space-3: 0.75rem;
  --space-4: 1rem;     --space-6: 1.5rem;   --space-8: 2rem;
  --space-12: 3rem;    --space-16: 4rem;    --space-24: 6rem;
  --space-32: 8rem;    /* padding-top/bottom mặc định cho <section> desktop */
  --space-40: 10rem;
}
```

### 1.4 Bo góc, đổ bóng, breakpoint
```scss
@theme {
  --radius-card:   24px;    /* Cố định cho MỌI card — đây là Gate 5 */
  --radius-button: 9999px;  /* Pill, mọi button/CTA */
  --radius-input:  12px;
  --radius-badge:  9999px;
  --radius-image:  16px;    /* Ảnh trong bài viết/sự kiện, KHÔNG dùng 24px để phân biệt ảnh với card */
  --radius-modal:  32px;

  --shadow-sm: 0 1px 2px rgba(26,26,46,0.06);
  --shadow-md: 0 4px 16px rgba(26,26,46,0.08);
  --shadow-lg: 0 12px 32px rgba(26,26,46,0.12);
  --shadow-glow-tech: 0 0 24px rgba(30,64,175,0.25);   /* dùng cho hero CTA hover */
  --shadow-glow-green: 0 0 24px rgba(22,163,74,0.25);  /* dùng cho badge "đang mở đăng ký" */
}
```
Breakpoint theo mặc định Tailwind v4: `sm:640px md:768px lg:1024px xl:1280px 2xl:1536px`. Không override trừ khi có lý do cụ thể ghi lại trong PR.

---

## 2. QUALITY GATES (THE AUDIT) — MỖI GATE PHẢI ĐO ĐƯỢC, KHÔNG MƠ HỒ

**Gate 1 — Em-dash.** Dùng `-`  thay cho `—`  trong văn xuôi (câu văn, mô tả, giới thiệu). **Ngoại lệ không đổi:** ngày tháng (`20/11/2025`), số điện thoại, đường dẫn URL/code, tên biến CSS, danh sách gạch đầu dòng markdown (`- item`).

**Gate 2 — Design Read (bắt buộc trước khi viết code).** Trình bày ngắn gọn trước khi code:
- Palette áp dụng cho section này (chọn từ token, không bịa thêm).
- Layout concept bằng 1 câu + ASCII wireframe.
- Signature element của section (nếu có) — thứ khiến section này không lẫn với site khác.
- Tự phản biện: nếu đây là default sẽ làm cho brief bất kỳ nào khác, phải sửa lại.

**Gate 3 — Section Rhythm (đo được).** Lập danh sách layout pattern cho phép, ví dụ: `[Full-bleed hero] → [2 cột ảnh trái/chữ phải] → [Grid 3 card] → [Chữ trái/ảnh phải] → [Carousel ngang] → [CTA full-width]`. Quy tắc cứng: **2 section liền kề không được dùng cùng 1 pattern trong danh sách trên.** Khi review, đánh số pattern từng section theo thứ tự trên trang — nếu 2 số liên tiếp trùng nhau, Gate 3 fail.

**Gate 4 — Hero Discipline.**
- H1 tối đa 2 dòng ở viewport 1280px.
- CTA chính (nút) phải nằm trong khung nhìn đầu tiên tại **1280×800** (desktop) **và 375×812** (mobile, iPhone chuẩn) — không cuộn.
- H1 dùng `clamp(2.25rem, 4vw + 1rem, 3.815rem)` để tự co giữa mobile/desktop thay vì 2 giá trị rời rạc.

**Gate 5 — Theme Audit.**
- Mọi `<Card>` dùng đúng `--radius-card: 24px`, không có giá trị bo góc rời rạc khác (16px, 20px...) lẫn vào.
- Mọi button dùng `--radius-button` (pill).
- Không có màu hex hard-code ngoài bảng token ở mục 1.1 — grep toàn bộ code trước khi merge.

**Gate 6 — Accessibility (mới).**
- Contrast text thường ≥ 4.5:1, text lớn (≥24px hoặc bold ≥18.66px) ≥ 3:1 — kiểm bằng token: `--color-ink` trên `--color-surface` đạt chuẩn, nhưng `--color-ink-subtle` trên `--color-surface-alt` phải tự kiểm lại.
- Mọi phần tử tương tác có `focus-visible` rõ ràng dùng `--color-border-focus`, không tắt outline mà không thay thế.
- Tôn trọng `prefers-reduced-motion` — tắt/giảm animation GSAP khi user bật chế độ này.

**Gate 7 — Content Voice (mới, xem mục 3).** Copy phải qua checklist giọng văn trước khi merge.

**Gate 8 — State Completeness (mới).** Mọi khối dữ liệu động (danh sách sự kiện, tin tức, thành viên) phải có đủ 3 trạng thái: loading (skeleton, không spinner trơn), empty (thông điệp + hành động gợi ý, không để trống trơn), error (giải thích + nút thử lại).

---

## 3. CONTENT / VOICE (MỤC MỚI — BẮT BUỘC)

- **Ngôi xưng:** "Đoàn khoa" hoặc "mình" khi nói với sinh viên (thân thiện, không dùng "chúng tôi" khô cứng của doanh nghiệp).
- **Giọng:** gần gũi nhưng không sáo rỗng — câu ngắn, động từ chủ động, không dùng mỹ từ kiểu "kiến tạo tương lai rực rỡ".
- **Nút CTA đặt tên theo hành động cụ thể sinh viên nhận ra**, không đặt tên theo hệ thống: dùng "Đăng ký tham gia", "Xem lịch sự kiện" — không dùng "Submit", "Xem thêm" chung chung.
- **Tên hành động nhất quán xuyên suốt luồng**: nút bấm "Đăng ký tham gia" → toast xác nhận phải nói "Đã đăng ký tham gia thành công", không đổi thành từ khác.
- **Trạng thái rỗng là lời mời hành động**, không phải thông báo tiêu cực: thay vì "Chưa có sự kiện nào" → "Sự kiện sắp tới đang được lên lịch — theo dõi để không bỏ lỡ."
- **Lỗi nói rõ chuyện gì xảy ra và cách sửa**, giọng hệ thống chứ không giả vờ là người: "Không gửi được form — kiểm tra lại kết nối mạng và thử lại."

---

## 4. TECHNICAL STANDARDS
- Framework: **Angular 22+** (bản stable mới nhất tính đến 07/2026; nếu môi trường CI đang ở LTS Angular 21 thì dùng 21, không dùng thấp hơn).
- CSS: Tailwind CSS v4 (CSS-first, `@theme`).
- Icons: Phosphor Icons — dùng weight `regular` cho UI thường, `fill` cho trạng thái active/selected.
- Animation — **chia rõ vai trò, không để tự do chọn:**
  - **GSAP**: hero load sequence, scroll-triggered reveal cho section, parallax nhẹ.
  - **Angular Animations (native)**: micro-interaction UI thường xuyên (mở/đóng menu, toggle, route transition) — vì cần tích hợp signal/state của Angular.

---

## 5. MANDATORY WORKFLOW
1. Load skill này làm nguồn sự thật duy nhất.
2. **Design Read** cho section sắp làm (Gate 2) — trình bày trước, chưa viết code.
3. Chờ người dùng duyệt plan.
4. Implementation theo đúng plan đã duyệt, dùng token ở mục 1, không tự chế giá trị mới.
5. **Quality Audit** — chạy qua đủ 8 Gate ở mục 2 trước khi báo hoàn thành.