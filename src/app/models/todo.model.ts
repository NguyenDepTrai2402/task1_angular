export type TodoPriority = 'low' | 'medium' | 'high';

export interface Todo {
    id: string; 
    title: string;
    description?: string;
    completed: boolean;
    priority: TodoPriority;
    googleCalendarEventId?: string;
    dueDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}
