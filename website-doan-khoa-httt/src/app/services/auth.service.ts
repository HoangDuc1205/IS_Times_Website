import { inject, Injectable, PLATFORM_ID, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SupabaseService } from './supabase.service';
import type { User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly supabaseService = inject(SupabaseService);
  private readonly platformId = inject(PLATFORM_ID);

  // Signal lưu trạng thái user hiện tại (null = chưa đăng nhập)
  private readonly _currentUser = signal<User | null>(null);

  /** User hiện tại (reactive signal) */
  readonly currentUser = this._currentUser.asReadonly();

  /** Tên hiển thị trên header (lấy từ metadata khi đăng ký) */
  readonly displayName = computed(() => {
    const user = this._currentUser();
    if (!user) return null;
    return user.user_metadata?.['full_name'] || user.email?.split('@')[0] || 'Người dùng';
  });

  /** Đã đăng nhập hay chưa */
  readonly isLoggedIn = computed(() => !!this._currentUser());

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initAuthListener();
    }
  }

  /**
   * Lắng nghe sự thay đổi trạng thái auth (đăng nhập, đăng xuất, token refresh)
   * Chạy 1 lần duy nhất khi app khởi động trên trình duyệt
   */
  private initAuthListener(): void {
    const client = this.supabaseService.getClient();
    
    // Lấy session hiện tại nếu đã lưu trong localStorage
    client.auth.getSession().then(({ data }) => {
      this._currentUser.set(data.session?.user ?? null);
    });

    // Lắng nghe mọi thay đổi auth (login, logout, token refresh)
    client.auth.onAuthStateChange((_event, session) => {
      this._currentUser.set(session?.user ?? null);
    });
  }

  /**
   * Đăng nhập bằng Email & Mật khẩu
   */
  async signIn(email: string, password: string) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  }

  /**
   * Đăng xuất
   */
  async signOut() {
    const client = this.supabaseService.getClient();
    const { error } = await client.auth.signOut();
    if (!error) {
      this._currentUser.set(null);
    }
    return { error };
  }
}
