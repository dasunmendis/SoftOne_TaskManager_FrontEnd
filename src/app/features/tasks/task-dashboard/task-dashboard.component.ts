import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../../core/services/task.service';
import { AlertService } from '../../../core/services/alert.service';
import { Task } from '../../../core/models/task.model';

@Component({
    selector: 'app-task-dashboard',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
        <div class="container py-4 max-w-custom">
            <!-- Dashboard Header -->
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
                <div>
                    <h2 class="mb-1 fw-bold text-dark"><i class="bi bi-layout-text-window-reverse text-primary me-2"></i>My Tasks</h2>
                    <p class="text-muted mb-0 fs-6">Manage your daily goals and track your progress.</p>
                </div>
                <div class="mt-3 mt-md-0">
                    <button class="btn btn-primary fw-bold px-4 shadow-sm custom-btn" (click)="openModal()">
                        <i class="bi bi-plus-lg me-2"></i> Create New Task
                    </button>
                </div>
            </div>

            <!-- Toolbar (Search & Sort) -->
            <div class="card border-0 shadow-sm rounded-4 mb-4 p-1">
                <div class="card-body p-2">
                    <div class="row g-2">
                        <div class="col-md-7 col-lg-8">
                            <div class="input-group">
                                <span class="input-group-text bg-light border-0 text-muted px-3"><i class="bi bi-search"></i></span>
                                <input type="text" class="form-control bg-light border-0 px-2 custom-input" placeholder="Search tasks by title..." (input)="filterTasks($event)">
                            </div>
                        </div>
                        <div class="col-md-5 col-lg-4">
                            <div class="input-group">
                                <span class="input-group-text bg-light border-0 text-muted px-3"><i class="bi bi-filter"></i></span>
                                <select class="form-select bg-light border-0 custom-input" (change)="sortTasks($event)">
                                    <option value="titleAsc">Title (A-Z)</option>
                                    <option value="titleDesc">Title (Z-A)</option>
                                    <option value="statusInc">Pending First</option>
                                    <option value="statusComp">Completed First</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tasks Grid -->
            <div class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3">
                <div class="col" *ngFor="let task of filteredTasks">
                    <div class="card h-100 shadow-sm task-card border-0 rounded-4" [ngClass]="{'opacity-75': task.isCompleted, 'border-start border-4 border-success': task.isCompleted, 'border-start border-4 border-primary': !task.isCompleted}">
                        <div class="card-body p-3">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <span class="badge rounded-pill mb-2 px-2 py-1 fw-semibold" [ngClass]="task.isCompleted ? 'bg-success-subtle text-success' : 'bg-primary-subtle text-primary'">
                                        <i class="bi" [ngClass]="task.isCompleted ? 'bi-check-circle-fill' : 'bi-clock-fill'"></i>
                                        {{ task.isCompleted ? 'Completed' : 'In Progress' }}
                                    </span>
                                </div>
                                <div class="form-check form-switch fs-5 mb-0" title="Toggle Completion">
                                    <input class="form-check-input mt-0 shadow-none cursor-pointer" type="checkbox" role="switch" [checked]="task.isCompleted" (change)="toggleComplete(task)">
                                </div>
                            </div>
                            <h5 class="card-title fw-bold text-truncate mb-2" [ngClass]="{'text-decoration-line-through text-muted': task.isCompleted}">
                                {{ task.title }}
                            </h5>
                            <p class="card-text text-secondary task-desc small">{{ task.description || 'No description provided.' }}</p>
                        </div>
                        <div class="card-footer bg-transparent border-0 d-flex justify-content-end gap-2 p-3 pt-0">
                            <button class="btn btn-light text-primary btn-sm px-3 fw-bold rounded-3 action-btn" (click)="openModal(task)" title="Edit">
                                <i class="bi bi-pencil-square me-1"></i> Edit
                            </button>
                            <button class="btn btn-light text-danger btn-sm px-3 fw-bold rounded-3 action-btn" (click)="deleteTask(task.id)" title="Delete">
                                <i class="bi bi-trash3 me-1"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div *ngIf="filteredTasks.length === 0" class="text-center py-5 my-4">
                <div class="mb-3">
                    <div class="d-inline-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-circle" style="width: 80px; height: 80px;">
                        <i class="bi bi-inbox display-5"></i>
                    </div>
                </div>
                <h4 class="fw-bold text-dark">No tasks found</h4>
                <p class="text-muted small mb-4">You're all caught up! Create a new task to get started.</p>
                <button class="btn btn-primary fw-bold px-4 rounded-3 custom-btn" (click)="openModal()">
                    <i class="bi bi-plus-lg me-2"></i> Create New Task
                </button>
            </div>
        </div>

        <!-- Custom Modal Overlay for Add/Edit -->
        <div class="modal-overlay" *ngIf="isModalOpen">
            <div class="modal-dialog-centered custom-modal shadow-lg">
                <div class="modal-content border-0 rounded-4 overflow-hidden">
                    <div class="modal-header border-bottom-0 bg-light p-4 pb-3">
                        <h4 class="modal-title fw-bold mb-0 text-dark">
                            <i class="bi text-primary me-2" [ngClass]="isEditMode ? 'bi-pencil-square' : 'bi-plus-square'"></i>
                            {{ isEditMode ? 'Edit Task' : 'Create New Task' }}
                        </h4>
                        <button type="button" class="btn-close" (click)="closeModal()"></button>
                    </div>
                    <div class="modal-body p-4 pt-3">
                        <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
                            <div class="mb-4">
                                <label class="form-label fw-bold text-secondary ms-1">Task Title</label>
                                <input type="text" class="form-control form-control-lg bg-light custom-input border-0" formControlName="title" placeholder="What needs to be done?"
                                    [ngClass]="{'is-invalid': taskForm.get('title')?.invalid && taskForm.get('title')?.touched}">
                                <div class="invalid-feedback ms-1">Title is required (Max 100 chars).</div>
                            </div>
                            <div class="mb-4">
                                <label class="form-label fw-bold text-secondary ms-1">Description (Optional)</label>
                                <textarea class="form-control bg-light custom-input border-0" rows="5" formControlName="description" placeholder="Add some details..."></textarea>
                            </div>
                            <div class="d-flex justify-content-end gap-3 pt-2">
                                <button type="button" class="btn btn-light px-4 fw-bold rounded-3" (click)="closeModal()">Cancel</button>
                                <button type="submit" class="btn btn-primary px-5 fw-bold rounded-3 custom-btn" [disabled]="taskForm.invalid">
                                    {{ isEditMode ? 'Save Changes' : 'Create Task' }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Custom Delete Confirmation Modal -->
        <div class="modal-overlay" *ngIf="taskToDelete !== null">
            <div class="modal-dialog-centered custom-modal shadow-lg" style="max-width: 420px;">
                <div class="modal-content border-0 rounded-4 overflow-hidden text-center p-4 p-sm-5">
                    <div class="mb-4">
                        <div class="d-inline-flex align-items-center justify-content-center bg-danger-subtle text-danger rounded-circle" style="width: 80px; height: 80px;">
                            <i class="bi bi-exclamation-triangle-fill" style="font-size: 2.5rem;"></i>
                        </div>
                    </div>
                    <h3 class="fw-bold mb-3 text-dark">Delete Task?</h3>
                    <p class="text-secondary mb-4 fs-6">Are you absolutely sure you want to delete this task? This action cannot be undone.</p>
                    <div class="d-flex justify-content-center gap-3">
                        <button class="btn btn-light px-4 py-2 fw-bold rounded-3 w-50" (click)="cancelDelete()">Cancel</button>
                        <button class="btn btn-danger px-4 py-2 fw-bold rounded-3 w-50 custom-btn" (click)="confirmDelete()">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .max-w-custom {
            max-width: 1200px;
        }
        .task-card {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .task-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 30px rgba(0,0,0,0.08) !important;
        }
        .task-desc {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            line-height: 1.6;
        }
        .custom-input {
            border-radius: 8px !important;
            transition: all 0.3s ease;
        }
        .custom-input:focus {
            background-color: #fff !important;
            box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.15) !important;
            border: 1px solid #86b7fe !important;
        }
        .custom-btn {
            transition: all 0.2s ease;
        }
        .custom-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 15px rgba(0,0,0,0.15) !important;
        }
        .action-btn {
            background-color: #f8f9fa;
            transition: all 0.2s ease;
        }
        .action-btn:hover {
            background-color: #e9ecef;
            transform: translateY(-1px);
        }
        .cursor-pointer {
            cursor: pointer;
        }
        /* Modal Styles */
        .modal-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1050;
            animation: fadeIn 0.25s ease-out;
            padding: 1rem;
        }
        .custom-modal {
            background: #fff;
            width: 100%;
            max-width: 550px;
            border-radius: 1rem;
            transform: scale(0.95);
            animation: zoomIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes zoomIn { from { transform: scale(0.95); } to { transform: scale(1); } }
    `]
})
export class TaskDashboardComponent implements OnInit {
    tasks: Task[] = [];
    filteredTasks: Task[] = [];

    taskForm: FormGroup;
    isModalOpen = false;
    isEditMode = false;
    currentTaskId: number | null = null;
    currentSort = 'titleAsc';
    taskToDelete: number | null = null;

    constructor(
        private fb: FormBuilder,
        private taskService: TaskService,
        private alertService: AlertService,
        private cdr: ChangeDetectorRef
    ) {
        this.taskForm = this.fb.group({
            title: ['', [Validators.required, Validators.maxLength(100)]],
            description: ['', Validators.maxLength(500)]
        });
    }

    ngOnInit() {
        this.loadTasks();
    }

    loadTasks() {
        this.taskService.getTasks().subscribe({
            next: (data) => {
                this.tasks = data;
                this.applyFiltersAndSort();
                this.cdr.detectChanges();
            },
            error: (err) => {
                if (err.status === 0) {
                    this.alertService.error('Unable to connect to the backend service.');
                } else {
                    this.alertService.error('Failed to load tasks from server.');
                }
                this.cdr.detectChanges();
            }
        });
    }

    filterTasks(event: any) {
        const term = event.target.value.toLowerCase();
        this.filteredTasks = this.tasks.filter(t => t.title.toLowerCase().includes(term));
        this.executeSort();
    }

    sortTasks(event: any) {
        this.currentSort = event.target.value;
        this.executeSort();
    }

    private applyFiltersAndSort() {
        this.filteredTasks = [...this.tasks];
        this.executeSort();
    }

    private executeSort() {
        this.filteredTasks.sort((a, b) => {
            switch (this.currentSort) {
                case 'titleAsc': return a.title.localeCompare(b.title);
                case 'titleDesc': return b.title.localeCompare(a.title);
                case 'statusInc': return (a.isCompleted === b.isCompleted) ? 0 : a.isCompleted ? 1 : -1;
                case 'statusComp': return (a.isCompleted === b.isCompleted) ? 0 : a.isCompleted ? -1 : 1;
                default: return 0;
            }
        });
    }

    // Modal Logic
    openModal(task?: Task) {
        if (task) {
            this.isEditMode = true;
            this.currentTaskId = task.id;
            this.taskForm.patchValue({
                title: task.title,
                description: task.description
            });
        } else {
            this.isEditMode = false;
            this.currentTaskId = null;
            this.taskForm.reset();
        }
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
        this.taskForm.reset();
    }

    onSubmit() {
        if (this.taskForm.invalid) return;

        const formValue = this.taskForm.value;

        if (this.isEditMode && this.currentTaskId) {
            const existingTask = this.tasks.find(t => t.id === this.currentTaskId);
            if (existingTask) {
                const updatedTask = { ...existingTask, ...formValue };
                this.taskService.updateTask(this.currentTaskId, updatedTask).subscribe({
                    next: () => {
                        this.alertService.success('Task updated successfully!');
                        this.loadTasks();
                        this.closeModal();
                    },
                    error: () => this.alertService.error('Failed to update task.')
                });
            }
        } else {
            this.taskService.createTask(formValue).subscribe({
                next: () => {
                    this.alertService.success('Task added successfully!');
                    this.loadTasks();
                    this.closeModal();
                },
                error: () => this.alertService.error('Failed to add task.')
            });
        }
    }

    // Delete Logic
    deleteTask(id: number) {
        this.taskToDelete = id;
    }

    cancelDelete() {
        this.taskToDelete = null;
    }

    confirmDelete() {
        if (this.taskToDelete !== null) {
            this.taskService.deleteTask(this.taskToDelete).subscribe({
                next: () => {
                    this.alertService.success('Task deleted.');
                    this.loadTasks();
                    this.taskToDelete = null;
                },
                error: () => {
                    this.alertService.error('Failed to delete task.');
                    this.taskToDelete = null;
                }
            });
        }
    }

    toggleComplete(task: Task) {
        const updatedTask = { ...task, isCompleted: !task.isCompleted };
        this.taskService.updateTask(task.id, updatedTask).subscribe({
            next: () => {
                task.isCompleted = updatedTask.isCompleted;
                this.applyFiltersAndSort();
                this.cdr.detectChanges();
            },
            error: () => {
                this.alertService.error('Failed to update status.');
                task.isCompleted = !updatedTask.isCompleted;
                this.cdr.detectChanges();
            }
        });
    }
}
