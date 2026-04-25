# TaskManager Frontend

A modern, highly-responsive Single Page Application (SPA) built with Angular 19 and Bootstrap 5. This application serves as the frontend client for the TaskManager system, interacting with a C# .NET Web API backend.

## 🚀 Features

*   **Secure Authentication:** Full registration and login workflows using backend validation.
*   **Task Management:** Complete CRUD (Create, Read, Update, Delete) operations for tasks.
*   **Advanced Filtering:** Real-time client-side search and sorting (by Title, Status).
*   **Modern UI/UX:** Premium, custom-designed interface utilizing Bootstrap 5 utility classes, responsive grid layouts, subtle shadow effects, and floating labels.
*   **Global State Management:** Custom RxJS-powered global `AlertService` for non-blocking UI notifications.

## 🛠️ Technology Stack

*   **Framework:** [Angular 19](https://angular.dev/) (Standalone Components, Reactive Forms)
*   **Styling:** [Bootstrap 5.3.2](https://getbootstrap.com/) (Imported via CDN) & Custom CSS
*   **Icons:** [Bootstrap Icons](https://icons.getbootstrap.com/)
*   **Routing:** Angular Router with custom `AuthGuard` route protection.
*   **HTTP Client:** Built-in Angular `HttpClient` with custom `AuthInterceptor` for session token injection.

## 📁 Project Architecture

This application strictly follows the **Clean Architecture** principles, enforcing separation of concerns:

```
src/app/
├── core/                   # Singleton services, models, guards, and interceptors
│   ├── components/         # Global shared UI (e.g., AlertComponent)
│   ├── guards/             # Route guards (e.g., AuthGuard)
│   ├── interceptors/       # HTTP request interception (e.g., AuthInterceptor)
│   ├── models/             # TypeScript interfaces (e.g., Task, User)
│   └── services/           # API communication (AuthService, TaskService, AlertService)
├── features/               # Feature-specific modules (Lazy-loaded logic)
│   ├── auth/               # Login & Register components
│   └── tasks/              # Task Dashboard and Grid logic
├── app.component.ts        # Root layout and Navbar
└── app.routes.ts           # Application routing configuration
```

## 📋 Prerequisites

Before you begin, ensure you have met the following requirements:
*   You have installed the latest LTS version of [Node.js](https://nodejs.org/en/).
*   You have installed the Angular CLI globally:
    ```bash
    npm install -g @angular/cli
    ```

## ⚙️ Installation & Setup

1.  **Clone the repository and navigate to the directory:**
    ```bash
    cd TaskManager/frontend/task-manager-ui
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the Backend API:**
    *   Navigate to the backend solution (`TaskManager.API`).
    *   Ensure the C# .NET Web API is running, typically on `https://localhost:5001`. (If your backend runs on a different port, update the `apiUrl` in `src/app/core/services/task.service.ts` and `auth.service.ts`).

4.  **Run the Angular Development Server:**
    ```bash
    ng serve
    ```
    Alternatively, you can run `npm run start`.

5.  **Access the Application:**
    Open your browser and navigate to `http://localhost:4200/`.

## 🛡️ Best Practices & Guidelines for Developers

If you are contributing to or extending this repository, please adhere to the following guidelines:

1.  **Standalone Components:** This project does *not* use `NgModules`. All new components must be standalone (`standalone: true`). Import specific Angular modules directly into the component's `imports` array (e.g., `CommonModule`, `ReactiveFormsModule`).
2.  **State Management:** Avoid passing complex state via deep component trees. Rely on Angular Services and RxJS `BehaviorSubject` (as seen in `AlertService`) for cross-component communication.
3.  **Styling Boundaries:**
    *   Use **Bootstrap 5 utility classes** (e.g., `d-flex`, `mt-4`, `p-3`, `text-primary`) in your HTML templates as much as possible.
    *   Write custom CSS *only* when Bootstrap utilities cannot achieve the desired effect (e.g., custom animations, complex grid overlays, specific hover effects).
4.  **HTTP Requests:** All backend communication must flow through the designated services in the `core/services` directory. Components should strictly subscribe to these services and handle UI state (loading spinners, error alerts).

## 🔨 Available Scripts

Run `ng help` for more Angular CLI commands.

*   `ng serve` - Starts the development server.
*   `ng build` - Builds the app for production into the `dist/` folder.
*   `ng test` - Executes the unit tests via [Karma](https://karma-runner.github.io).
*   `ng generate component [name]` - Scaffolds a new Angular component.
