
export interface Channel {
    send(command: string, data?: any): void;
    request<T = any>(command: string, data?: any): Promise<T>;
    receive<T = any>(command: string, data?: any): T;
}