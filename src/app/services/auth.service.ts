import { Injectable, signal } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly currentUser = signal<User | null>(null);

  private readonly auth = getAuth(initializeApp(environment.firebase));

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
        this.currentUser.set(user);
    });
  }

  async register(email: string, password: string): Promise<void> {
    const result = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    this.currentUser.set(result.user);
  }

  async login(email: string, password: string): Promise<void> {
    const result = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    this.currentUser.set(result.user);
  }

  async loginWithGoogle(): Promise<void> {
    const result = await signInWithPopup(
      this.auth,
      new GoogleAuthProvider()
    );
    this.currentUser.set(result.user);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.currentUser.set(null);
  }

  friendlyErrorMessage(error: any): string {
    const code = error?.code ?? '';

    if (code === 'auth/email-already-in-use') {
      return 'Email này đã được đăng ký, thử đăng nhập nhé';
    }
    if (code === 'auth/weak-password') {
      return 'Mật khẩu phải từ 6 ký tự trở lên';
    }
    if (code === 'auth/invalid-email') {
      return 'Email không đúng định dạng';
    }
    if (code === 'auth/invalid-credential') {
      return 'Sai email hoặc mật khẩu';
    }
    if (code === 'auth/popup-closed-by-user') {
      return 'Bạn đã đóng cửa sổ đăng nhập Google';
    }
    return 'Có lỗi xảy ra, thử lại nhé';
  }
}
