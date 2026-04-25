import { Component, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AlertService } from '../../../core/services/alert.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    template: `
        <div class="d-flex align-items-center justify-content-center flex-grow-1 p-3 w-100 auth-bg">
            <div class="card border-0 rounded-4 auth-card p-4 p-sm-5">
                <div class="text-center mb-4">
                    <div class="icon-container bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3">
                        <i class="bi bi-box-arrow-in-right display-6"></i>
                    </div>
                    <h3 class="fw-bold text-dark mb-2">Welcome Back</h3>
                    <p class="text-secondary fs-6">Please enter your details to sign in.</p>
                </div>
                <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control custom-input" id="usernameInput" formControlName="username" placeholder="Username">
                        <label for="usernameInput" class="text-muted">Username</label>
                    </div>
                    <div class="form-floating mb-4">
                        <input type="password" class="form-control custom-input" id="passwordInput" formControlName="password" placeholder="Password">
                        <label for="passwordInput" class="text-muted">Password</label>
                    </div>
                    <button type="submit" class="btn btn-primary w-100 fw-bold rounded-3 py-3 mb-4 custom-btn" [disabled]="loginForm.invalid || isLoading">
                        <span *ngIf="!isLoading">Sign In</span>
                        <span *ngIf="isLoading"><span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Signing In...</span>
                    </button>
                    <div class="text-center">
                        <span class="text-secondary">Don't have an account?</span> 
                        <a routerLink="/register" class="text-primary fw-bold text-decoration-none ms-1 auth-link">Sign up</a>
                    </div>
                </form>
            </div>
        </div>
    `,
    styles: [`
        .auth-bg {
            background-color: #f8f9fa;
            background-image: radial-gradient(#dee2e6 1px, transparent 1px);
            background-size: 24px 24px;
        }
        .auth-card {
            max-width: 440px;
            width: 100%;
            box-shadow: 0 20px 50px rgba(0,0,0,0.08) !important;
            background: #ffffff;
            border: 1px solid rgba(0,0,0,0.05) !important;
        }
        .icon-container {
            width: 72px;
            height: 72px;
        }
        .custom-input {
            border-radius: 10px;
            border: 1.5px solid #dee2e6;
            transition: all 0.2s ease;
        }
        .custom-input:focus {
            border-color: #0d6efd;
            box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.1);
        }
        .custom-btn {
            font-size: 1.05rem;
            letter-spacing: 0.3px;
            transition: all 0.2s ease;
        }
        .custom-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 15px rgba(13, 110, 253, 0.25);
        }
        .auth-link {
            transition: all 0.2s ease;
            padding-bottom: 2px;
            border-bottom: 2px solid transparent;
        }
        .auth-link:hover {
            border-bottom-color: #0d6efd;
        }
    `]
})
export class LoginComponent {
    loginForm: FormGroup;
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private authService: AuthService,
        private alertService: AlertService,
        private cdr: ChangeDetectorRef,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // If already logged in, redirect
        if (isPlatformBrowser(this.platformId)) {
            if (sessionStorage.getItem('basicAuth')) {
                this.router.navigate(['/tasks']);
            }
        }
    }

    onLogin() {
        if (this.loginForm.invalid) return;

        this.isLoading = true;
        const formValue = this.loginForm.value;

        this.authService.login(formValue).subscribe({
            next: () => {
                this.isLoading = false;
                const encodedAuth = btoa(`${formValue.username}:${formValue.password}`);

                if (isPlatformBrowser(this.platformId)) {
                    sessionStorage.setItem('basicAuth', encodedAuth);
                    sessionStorage.setItem('username', formValue.username);
                    this.alertService.success('Logged in successfully!');
                    this.router.navigate(['/tasks']);
                }
            },
            error: (err) => {
                this.isLoading = false;
                if (err.status === 0) {
                    this.alertService.error('Unable to connect to the backend service. Is the server running?');
                } else {
                    this.alertService.error(err.error?.Error || 'Invalid username or password.');
                }
                this.cdr.detectChanges();
            }
        });
    }
}
