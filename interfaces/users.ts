export interface IUser {
    _id?: string;
    name: string;
    email: string;
    password: string;
    sleep_time: string;
    wakeup_time: string;
    role: 'user' | 'admin';
    created_at?: Date;
    updated_at?: Date;
}