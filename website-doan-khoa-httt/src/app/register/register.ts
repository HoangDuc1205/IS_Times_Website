import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  private readonly supabaseService = inject(SupabaseService);
  private readonly router = inject(Router);

  // Form Fields
  protected fullName = '';
  protected studentId = '';
  protected email = '';
  protected password = '';
  protected confirmPassword = '';

  // UI States
  protected isLoading = signal(false);
  protected errorMessage = signal<string | null>(null);
  protected isSuccess = signal(false);

  // Password visibility
  protected showPassword = signal(false);

  protected togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  protected async onSubmit(): Promise<void> {
    // Reset state
    this.errorMessage.set(null);

    // Validate inputs
    if (!this.fullName.trim() || !this.studentId.trim() || !this.email.trim() || !this.password.trim()) {
      this.errorMessage.set('Vui lòng điền đầy đủ tất cả các trường thông tin.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage.set('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage.set('Mật khẩu phải chứa ít nhất 6 ký tự.');
      return;
    }

    // Call Supabase service to sign up
    this.isLoading.set(true);
    try {
      const { data, error } = await this.supabaseService.signUp(
        this.email,
        this.password,
        this.fullName,
        this.studentId
      );

      if (error) {
        throw error;
      }

      this.isSuccess.set(true);
      // Optional: Redirect to login or home after delay
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 5000);
      
    } catch (err: any) {
      console.error('Đăng ký thất bại:', err);
      // Translate common error messages
      if (err.message?.includes('User already registered')) {
        this.errorMessage.set('Email này đã được đăng ký tài khoản.');
      } else {
        this.errorMessage.set(err.message || 'Có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại.');
      }
    } finally {
      this.isLoading.set(false);
    }
  }
}
