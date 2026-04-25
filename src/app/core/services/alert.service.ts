import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Alert {
    type: 'success' | 'danger' | 'warning' | 'info';
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class AlertService {
    private alertSubject = new BehaviorSubject<Alert | null>(null);

    get alert$(): Observable<Alert | null> {
        return this.alertSubject.asObservable();
    }

    success(message: string) {
        this.alertSubject.next({ type: 'success', message });
        this.autoClear();
    }

    error(message: string) {
        this.alertSubject.next({ type: 'danger', message });
        this.autoClear();
    }

    warning(message: string) {
        this.alertSubject.next({ type: 'warning', message });
        this.autoClear();
    }

    clear() {
        this.alertSubject.next(null);
    }

    private autoClear() {
        setTimeout(() => this.clear(), 5000); // clear after 5 seconds
    }
}
