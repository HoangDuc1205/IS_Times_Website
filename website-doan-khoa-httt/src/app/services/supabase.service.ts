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
    
    // Khởi tạo Supabase Client với các cấu hình an toàn cho SSR
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
      {
        auth: {
          // BẮT BUỘC: Chỉ bật persist session trên trình duyệt (sử dụng localStorage)
          // Trên Server (Node.js SSR) sẽ tắt đi để tránh lỗi 'localStorage is not defined'
          persistSession: isBrowser,
          autoRefreshToken: isBrowser,
          detectSessionInUrl: isBrowser
        }
      }
    );
  }

  /**
   * Lấy trực tiếp đối tượng Supabase Client để thực hiện các truy vấn tự do
   */
  getClient(): SupabaseClient {
    return this.supabase;
  }

  /**
   * Ví dụ: Lấy danh sách các sự kiện đang hoạt động từ bảng 'events'
   */
  async getEvents() {
    const { data, error } = await this.supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false });
    
    return { data, error };
  }

  /**
   * Ví dụ: Đăng ký tham gia một sự kiện vào bảng 'registrations'
   */
  async registerEvent(registration: { event_id: string; student_id: string; full_name: string; email: string }) {
    const { data, error } = await this.supabase
      .from('registrations')
      .insert(registration)
      .select();
      
    return { data, error };
  }

  /**
   * Đăng ký tài khoản mới bằng Email & Mật khẩu
   */
  async signUp(email: string, password: string, fullName: string, studentId: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          student_id: studentId,
          role: 'member'
        }
      }
    });
    
    return { data, error };
  }
}
