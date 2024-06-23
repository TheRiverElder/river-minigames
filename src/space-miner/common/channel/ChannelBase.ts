import { Consumer, int } from "../../../libs/CommonTypes";
import Registry from "../../../libs/management/Registry";
import IncrementNumberGenerator from "../../../libs/math/IncrementNumberGenerator";
import { Channel } from "./Channel";
import { ChannelDataSender } from "./ChannelDataSender";

export default abstract class ChannelBase implements Channel {

    public timeout: int = 12000;

    constructor(
        public readonly sender: ChannelDataSender<Channel>,
    ) { }

    private readonly pendingTaskIdGenerator = new IncrementNumberGenerator(0);
    private readonly pendingTasks = new Registry<int, ChannelPendingTask>(it => it.id);



    request<T = any>(command: string, data?: any): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const task: ChannelPendingTask<T> = {
                id: this.pendingTaskIdGenerator.generate(),
                resolve,
                reject,
            };
            this.pendingTasks.add(task);
            
            if (this.timeout > 0 && Number.isFinite(this.timeout)) {
                setTimeout(() => {
                    this.pendingTasks.take(task.id).ifPresent(task => {
                        task.reject("Timeout,");
                    });
                }, this.timeout);
            }

            this.sender.sendRequest(this, task.id, command, data);
        });
    }

    response<T = any>(command: string, data?: any): T {
        throw new Error("Not implemented");
    }

    send(command: string, data?: any): void {
        this.sender.sendData(this, command, data);
    }

    receive(command: string, data?: any): void { }

    receiveResponse(id: int, data: any): void {
        this.pendingTasks.take(id).ifPresent(task => {
            task.resolve(data);
        });
    }

    receiveResponseError(id: int, error: unknown): void {
        this.pendingTasks.take(id).ifPresent(task => {
            task.reject(error as any);
        });
    }

}

export interface ChannelPendingTask<T = any> {
    readonly id: int;
    readonly resolve: Consumer<T>;
    readonly reject: Consumer<Error | string>;
}