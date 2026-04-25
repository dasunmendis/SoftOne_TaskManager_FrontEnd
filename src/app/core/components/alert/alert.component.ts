import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AlertService, Alert } from '../../services/alert.service';

@Component({
    selector: 'app-alert',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div *ngIf="alert" class="alert-container">
            <div class="alert alert-{{ alert.type }} alert-dismissible fade show shadow-lg d-flex align-items-center" role="alert">
                <i class="bi me-2 fs-5" [ngClass]="getIconClass(alert.type)"></i>
                <strong class="me-2">{{ getTitle(alert.type) }}</strong> 
                {{ alert.message }}
                <button type="button" class="btn-close ms-3" aria-label="Close" (click)="close()"></button>
            </div>
        </div>
    `,
    styles: [`
        .alert-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1060;
            min-width: 300px;
            max-width: 450px;
            animation: slideIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .alert {
            border: none;
            border-left: 5px solid;
        }
        .alert-success { border-left-color: #198754; }
        .alert-danger { border-left-color: #dc3545; }
        .alert-warning { border-left-color: #ffc107; }
        .alert-info { border-left-color: #0dcaf0; }

        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `]
})
export class AlertComponent implements OnInit, OnDestroy {
    alert: Alert | null = null;
    private subscription!: Subscription;

    constructor(
        private alertService: AlertService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.subscription = this.alertService.alert$.subscribe(alert => {
            this.alert = alert;
            this.cdr.detectChanges();
        });
    }

    close() {
        this.alertService.clear();
        this.cdr.detectChanges();
    }

    getIconClass(type: string): string {
        switch(type) {
            case 'success': return 'bi-check-circle-fill text-success';
            case 'danger': return 'bi-x-circle-fill text-danger';
            case 'warning': return 'bi-exclamation-triangle-fill text-warning';
            default: return 'bi-info-circle-fill text-info';
        }
    }

    getTitle(type: string): string {
        switch(type) {
            case 'success': return 'Success!';
            case 'danger': return 'Error!';
            case 'warning': return 'Warning!';
            default: return 'Information';
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
