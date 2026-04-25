import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { AlertComponent } from './core/components/alert/alert.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, AlertComponent],
    template: `
        <div class="d-flex flex-column min-vh-100 bg-light">
            <!-- Navbar -->
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm flex-shrink-0" style="padding: 0.75rem 0;">
                <div class="container max-w-custom">
                    <a class="navbar-brand d-flex align-items-center fw-bold fs-4" href="#">
                        <i class="bi bi-check2-square me-2 fs-3"></i> TaskManager
                    </a>
                    
                    <div class="d-flex align-items-center" *ngIf="isLoggedIn">
                        <div class="dropdown">
                            <button class="btn btn-primary bg-opacity-10 text-white border-0 fw-semibold d-flex align-items-center py-2 px-3 rounded-pill" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="bi bi-person-circle fs-5 me-2"></i> 
                                {{ username }}
                            </button>
                        </div>
                        <button class="btn btn-outline-light ms-3 fw-bold rounded-pill px-4" (click)="logout()">
                            <i class="bi bi-box-arrow-right me-1"></i> Logout
                        </button>
                    </div>
                </div>
            </nav>

            <!-- Global Alert Component -->
            <app-alert></app-alert>

            <!-- Main Content -->
            <main class="flex-grow-1 d-flex flex-column content-wrapper">
                <router-outlet (activate)="onActivate()"></router-outlet>
            </main>
        </div>
    `,
    styles: [`
        .max-w-custom {
            max-width: 1200px;
        }
    `]
})
export class AppComponent implements OnInit {
    isLoggedIn = false;
    username = '';

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private router: Router
    ) {}

    ngOnInit() {
        this.checkAuth();
    }

    // Called whenever a route is activated
    onActivate() {
        this.checkAuth();
    }

    checkAuth() {
        if (isPlatformBrowser(this.platformId)) {
            const storedUsername = sessionStorage.getItem('username');
            if (storedUsername) {
                this.isLoggedIn = true;
                this.username = storedUsername;
            } else {
                this.isLoggedIn = false;
                this.username = '';
            }
        }
    }

    logout() {
        if (isPlatformBrowser(this.platformId)) {
            sessionStorage.clear();
            localStorage.removeItem('basicAuth'); // Clear old local storage just in case
            this.isLoggedIn = false;
            this.username = '';
            this.router.navigate(['/login']);
        }
    }
}