
export interface Channel {
    send(command: string, data?: any): void;
    request<T = any>(command: string, data?: any): Promise<T>;
    receive(command: string, data?: any): void;
    response<T = any>(command: string, data?: any): T;
}