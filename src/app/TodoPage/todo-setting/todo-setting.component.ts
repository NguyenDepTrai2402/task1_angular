import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonSegment,
  IonSegmentButton
} from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './todo-setting.component.html',
  styleUrls: ['./todo-setting.component.scss'],
  imports: [
    RouterLink,
    ReactiveFormsModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonInput,
    IonItem,
    IonLabel,
    IonSegment,
    IonSegmentButton
  ]
})
export class SettingsPage {
  private readonly formBuilder = inject(FormBuilder);
  readonly authService = inject(AuthService);

  readonly mode = signal<'login' | 'register'>('login');
  readonly errorMessage = signal('');

  readonly authForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onModeChange(event: CustomEvent): void {
    this.mode.set(event.detail.value as 'login' | 'register');
    this.errorMessage.set('');
    this.authForm.reset();
  }

  async onSubmit(): Promise<void> {
    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.authForm.getRawValue();
    this.errorMessage.set('');

    try {
      if (this.mode() === 'login') {
        await this.authService.login(email, password);
      } else {
        await this.authService.register(email, password);
      }
    } catch (error) {
      this.errorMessage.set(
        this.authService.friendlyErrorMessage(error)
      );
    }
  }

  async onGoogleLogin(): Promise<void> {
    this.errorMessage.set('');

    try {
      await this.authService.loginWithGoogle();
    } catch (error) {
      this.errorMessage.set(
        this.authService.friendlyErrorMessage(error)
      );
    }
  }

  async onLogout(): Promise<void> {
    await this.authService.logout();
  }
}
