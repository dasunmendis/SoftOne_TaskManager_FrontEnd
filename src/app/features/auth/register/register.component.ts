import { Component, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AlertService } from '../../../core/services/alert.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    template: `
        <div class="d-flex align-items-center justify-content-center flex-grow-1 p-3 w-100 auth-bg">
            <div class="card border-0 rounded-4 auth-card p-4 p-sm-5">
                <div class="text-center mb-4">
                    <div class="icon-container bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3">
                        <i class="bi bi-person-plus display-6"></i>
                    </div>
                    <h3 class="fw-bold text-dark mb-2">Create Account</h3>
                    <p class="text-secondary fs-6">Sign up to get started with TaskManager.</p>
                </div>
                <form [formGroup]="registerForm" (ngSubmit)="onRegister()">
                    <div class="row g-3 mb-3">
                        <div class="col-md-6">
                            <div class="form-floating">
                                <input type="text" class="form-control custom-input" id="firstNameInput" formControlName="firstName" placeholder="First Name" [ngClass]="{'is-invalid': registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched}">
                                <label for="firstNameInput" class="text-muted">First Name</label>
                                <div class="invalid-feedback ms-1" *ngIf="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched">
                                    First name is required.
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-floating">
                                <input type="text" class="form-control custom-input" id="lastNameInput" formControlName="lastName" placeholder="Last Name" [ngClass]="{'is-invalid': registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched}">
                                <label for="lastNameInput" class="text-muted">Last Name</label>
                                <div class="invalid-feedback ms-1" *ngIf="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched">
                                    Last name is required.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control custom-input" id="usernameInput" formControlName="username" placeholder="Username" [ngClass]="{'is-invalid': registerForm.get('username')?.invalid && registerForm.get('username')?.touched}">
                        <label for="usernameInput" class="text-muted">Choose a Username</label>
                        <div class="invalid-feedback ms-1" *ngIf="registerForm.get('username')?.invalid && registerForm.get('username')?.touched">
                            Username is required.
                        </div>
                    </div>
                    <div class="form-floating mb-4">
                        <input type="password" class="form-control custom-input" id="passwordInput" formControlName="password" placeholder="Password" [ngClass]="{'is-invalid': registerForm.get('password')?.invalid && registerForm.get('password')?.touched}">
                        <label for="passwordInput" class="text-muted">Create a Password</label>
                        <div class="invalid-feedback ms-1" *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
                            Password is required.
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary w-100 fw-bold rounded-3 py-3 mb-4 custom-btn" [disabled]="registerForm.invalid || isLoading">
                        <span *ngIf="!isLoading">Sign Up</span>
                        <span *ngIf="isLoading"><span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Registering...</span>
                    </button>
                    <div class="text-center">
                        <span class="text-secondary">Already have an account?</span> 
                        <a routerLink="/login" class="text-primary fw-bold text-decoration-none ms-1 auth-link">Log in</a>
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
            max-width: 500px;
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
export class RegisterComponent {
    registerForm: FormGroup;
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private authService: AuthService,
        private alertService: AlertService,
        private cdr: ChangeDetectorRef,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.registerForm = this.fb.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            username: ['', [Validators.required]],
            password: ['', [Validators.required]]
        });

        // If already logged in, redirect
        if (isPlatformBrowser(this.platformId)) {
            if (sessionStorage.getItem('basicAuth')) {
                this.router.navigate(['/tasks']);
            }
        }
    }

    onRegister() {
        if (this.registerForm.invalid) return;

        this.isLoading = true;
        const formValue = this.registerForm.value;

        this.authService.register(formValue).subscribe({
            next: () => {
                this.isLoading = false;
                this.alertService.success('Registration successful! Please login.');
                this.router.navigate(['/login']);
            },
            error: (err) => {
                this.isLoading = false;
                if (err.status === 0) {
                    this.alertService.error('Unable to connect to the backend service. Is the server running?');
                } else if (err.status === 400 && err.error?.Errors) {
                    this.alertService.error(err.error.Errors.join(' '));
                } else {
                    this.alertService.error(err.error?.Error || 'Failed to register user.');
                }
                this.cdr.detectChanges();
            }
        });
    }
}
