import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    // Update this port to match where your .NET API is running 
    // (check the launchSettings.json or console output in your API project)
    private apiUrl = 'https://localhost:5001/api/tasks';

    constructor(private http: HttpClient) { }

    // GET: Retrieve all tasks
    getTasks(): Observable<Task[]> {
        return this.http.get<Task[]>(this.apiUrl);
    }

    // POST: Create a new task
    createTask(task: Partial<Task>): Observable<number> {
        return this.http.post<number>(this.apiUrl, task);
    }

    // PUT: Update an existing task
    updateTask(id: number, task: Task): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${id}`, task);
    }

    // DELETE: Remove a task
    deleteTask(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}