# HƯỚNG DẪN KẾT NỐI SUPABASE VỚI DỰ ÁN IS TIMES

Tài liệu này hướng dẫn cách cài đặt, cấu hình và kết nối **Supabase** (cơ sở dữ liệu dưới dạng dịch vụ - BaaS) với dự án Angular hiện tại, đảm bảo chạy an toàn cả trên môi trường Trình duyệt và Server (SSR).

---

## 1. CÀI ĐẶT THƯ VIỆN SUPABASE

Di chuyển vào thư mục `website-doan-khoa-httt` và cài đặt thư viện chính thức của Supabase:

```bash
cd website-doan-khoa-httt
npm install @supabase/supabase-js
```

---

## 2. CẤU HÌNH BIẾN MÔI TRƯỜNG (ENVIRONMENT VARIABLES)

Angular CLI phiên bản mới không tự tạo sẵn thư mục `environments`. Hãy chạy lệnh sau để sinh cấu hình môi trường:

```bash
ng generate environments
```

Lệnh này sẽ tạo ra thư mục `src/environments/` với 2 tệp:
1. `environment.ts` (Dùng khi chạy production build)
2. `environment.development.ts` (Dùng khi chạy local phát triển)

### Cập nhật cấu hình:

Thêm URL và Anon Key lấy từ Supabase Dashboard của bạn (`Project Settings -> API`):

#### **`src/environments/environment.development.ts`**
```typescript
export const environment = {
  production: false,
  supabaseUrl: 'https://your-project-id.supabase.co',
  supabaseKey: 'YOUR_SUPABASE_ANON_KEY'
};
```

#### **`src/environments/environment.ts`**
```typescript
export const environment = {
  production: true,
  supabaseUrl: 'https://your-project-id.supabase.co',
  supabaseKey: 'YOUR_SUPABASE_ANON_KEY'
};
```

---

## 3. KHỞI TẠO SUPABASE SERVICE AN TOÀN CHO SSR

Do dự án sử dụng Angular SSR (chạy render trên Server trước khi trả về Client), đối tượng `localStorage` và `sessionStorage` không tồn tại trên môi trường Server Node.js. Supabase SDK theo mặc định sẽ cố gắng đọc cookie/localStorage và gây lỗi crash nếu không cấu hình đúng.

Hãy tạo một Angular Service để quản lý kết nối Supabase an toàn:

```bash
ng generate service services/supabase
```

Mở tệp mới tạo **`src/app/services/supabase.service.ts`** và cập nhật nội dung sau:

```typescript
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private readonly platformId = inject(PLATFORM_ID);
  private supabase!: SupabaseClient;

  constructor() {
    const isBrowser = isPlatformBrowser(this.platformId);
    
    // Khởi tạo Supabase Client
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
      {
        auth: {
          // BẮT BUỘC: Chỉ bật lưu session ở Client (localStorage/sessionStorage)
          // Trên Server (Node.js SSR) sẽ tắt đi để không bị lỗi 'localStorage is not defined'
          persistSession: isBrowser,
          autoRefreshToken: isBrowser,
          detectSessionInUrl: isBrowser
        }
      }
    );
  }

  /**
   * Lấy trực tiếp Supabase Client để thực hiện các truy vấn tùy biến
   */
  getClient(): SupabaseClient {
    return this.supabase;
  }

  /**
   * Ví dụ: Lấy danh sách các sự kiện đang hoạt động
   */
  async getEvents() {
    const { data, error } = await this.supabase
      .from('events') // Tên bảng trong Supabase
      .select('*')
      .order('date', { ascending: false });
    
    return { data, error };
  }

  /**
   * Ví dụ: Đăng ký tham gia một sự kiện
   */
  async registerEvent(registration: { event_id: string; student_id: string; full_name: string; email: string }) {
    const { data, error } = await this.supabase
      .from('registrations') // Tên bảng trong Supabase
      .insert(registration)
      .select();
      
    return { data, error };
  }
}
```

---

## 4. HƯỚNG DẪN SỬ DỤNG TRONG COMPONENT

Dưới đây là cách sử dụng `SupabaseService` để tải danh sách sự kiện động trong một component Angular:

### Code TypeScript (`event-list.ts`)
```typescript
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-list.html',
  styleUrl: './event-list.scss'
})
export class EventListComponent implements OnInit {
  // Inject SupabaseService thông qua Angular Dependency Injection
  private readonly supabaseService = inject(SupabaseService);

  protected events: any[] = [];
  protected isLoading = true;
  protected hasError = false;

  ngOnInit(): void {
    this.loadEvents();
  }

  async loadEvents(): Promise<void> {
    this.isLoading = true;
    this.hasError = false;

    try {
      const { data, error } = await this.supabaseService.getEvents();
      
      if (error) {
        throw error;
      }
      
      this.events = data || [];
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu từ Supabase:', err);
      this.hasError = true;
    } finally {
      this.isLoading = false;
    }
  }
}
```

---

## 5. BẢO MẬT DỮ LIỆU TRÊN SUPABASE (QUAN TRỌNG)

Mã `supabaseKey` (Anon Key) dùng trong frontend là công khai. Do đó, bất kỳ ai cũng có thể trích xuất mã này từ trình duyệt và truy cập database của bạn nếu bạn không thiết lập bảo mật.

Để bảo vệ cơ sở dữ liệu, bạn **BẮT BUỘC** phải bật tính năng **RLS (Row Level Security)** trên Supabase Dashboard:

### Cách cấu hình RLS cho các bảng cơ bản:

#### **Bảng `events` (Danh sách sự kiện):**
*   **Mục đích:** Cho phép mọi người đọc sự kiện, nhưng chỉ Admin mới có quyền chỉnh sửa/thêm mới.
*   **Cấu hình Policy trên Supabase:**
    1. Bật RLS: `Enable RLS` cho bảng `events`.
    2. Tạo Policy đọc: Chọn `New Policy` -> `Allowed to read` -> Chọn target `anon` (hoặc public) để bất kỳ ai cũng có thể `SELECT`.
    3. Tạo Policy ghi: Chỉ cho phép người dùng đăng nhập (Authenticated Admin) thực hiện `INSERT`, `UPDATE`, `DELETE`.

#### **Bảng `registrations` (Đăng ký sự kiện):**
*   **Mục đích:** Cho phép sinh viên gửi form đăng ký lên (không yêu cầu đăng nhập), nhưng không cho phép sinh viên xem danh sách đăng ký của người khác.
*   **Cấu hình Policy trên Supabase:**
    1. Bật RLS: `Enable RLS` cho bảng `registrations`.
    2. Tạo Policy thêm mới: Chọn `New Policy` -> Chọn hành động `INSERT` cho target `anon` (cho phép bất cứ ai gửi form).
    3. Tắt Policy đọc công khai: Không tạo policy `SELECT` công khai (chỉ admin đăng nhập mới được `SELECT` để thống kê danh sách).

---

## 6. SỬ DỤNG SUPABASE AUTH (TÙY CHỌN DÀNH CHO TRANG ADMIN)

Nếu bạn làm trang quản trị (Admin Dashboard) để duyệt bài viết hoặc thêm sự kiện:

### 1. Đăng nhập:
```typescript
async login(email: string, password: string) {
  const { data, error } = await this.supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
}
```

### 2. Đăng xuất:
```typescript
async logout() {
  const { error } = await this.supabase.auth.signOut();
  return { error };
}
```

### 3. Lấy thông tin User hiện tại:
```typescript
async getCurrentUser() {
  const { data: { user } } = await this.supabase.auth.getUser();
  return user;
}
```
