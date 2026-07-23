import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Form Fields
  protected email = '';
  protected password = '';

  // UI States
  protected isLoading = signal(false);
  protected errorMessage = signal<string | null>(null);

  // Password visibility
  protected showPassword = signal(false);

  protected togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  protected async onSubmit(): Promise<void> {
    this.errorMessage.set(null);

    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage.set('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    this.isLoading.set(true);
    try {
      const { error } = await this.authService.signIn(this.email, this.password);

      if (error) {
        throw error;
      }

      // Đăng nhập thành công, chuyển về trang chủ
      this.router.navigate(['/']);

    } catch (err: any) {
      console.error('Đăng nhập thất bại:', err);
      if (err.message?.includes('Invalid login credentials')) {
        this.errorMessage.set('Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
      } else if (err.message?.includes('Email not confirmed')) {
        this.errorMessage.set('Tài khoản chưa được xác thực. Hãy kiểm tra hòm thư email của bạn.');
      } else {
        this.errorMessage.set(err.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    } finally {
      this.isLoading.set(false);
    }
  }
}
