import SpaceMinerChannel from "../../client/channel/SpaceMinerChannel";
import SpaceMinerChannelManager from "../../client/channel/SpaceMinerClientChannelManager";
import { GameRuntime } from "../main";


export default abstract class SpaceMinerServerChannel<TSend = any, TReceive = any> extends SpaceMinerChannel<TSend, TReceive> {

    constructor(
        manager: SpaceMinerChannelManager,
        public readonly runtime: GameRuntime,
    ) { 
        super(manager);
    }

    abstract get name(): string;

    send(data: TSend, id?: number): void {
        const pack: any = {
            channel: this.name,
            data,
        };
        if (typeof id === 'number') {
            pack.id = id;
        }
        this.manager.send(pack);
    }

    request<T>(data: TSend, timeout: number = 12000): Promise<T> {
        if (timeout < 0) throw new Error("Timeout must be greater than 0: " + timeout);

        const id = this.requestPackIdGenerator.generate();

        const promise = new Promise<T>((resolve, reject) => {
            this.manager.send({ channel: this.name, id, data });
            this.pendingRequestPacks.add({ id, resolve, reject });
        });

        setTimeout(
            () => this.pendingRequestPacks.removeByKey(id),
            timeout,
        );

        return promise;
    }

    response(id: number, data: TReceive): void { }

    receive(data: TReceive, id?: number): void { }

}