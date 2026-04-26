export interface User {
    username: string;
    firstName: string;
    lastName: string;
    role: string;
}

export interface LoginResponse {
    token?: string;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
}
