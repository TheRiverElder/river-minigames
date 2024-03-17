import { Consumer } from "../../../libs/CommonTypes";
import Channel from "../../../libs/io/channel/Channel";
import Registry from "../../../libs/management/Registry";
import IncrementNumberGenerator from "../../../libs/math/IncrementNumberGenerator";
import SpaceMinerChannelManager from "./SpaceMinerClientChannelManager";


export default abstract class SpaceMinerChannel<TSend = any, TReceive = any> implements Channel<TSend, TReceive> {

    constructor(
        public readonly manager: SpaceMinerChannelManager,
    ) { }

    protected readonly requestPackIdGenerator = new IncrementNumberGenerator(1);
    protected readonly pendingRequestPacks = new Registry<number, RequestPack<TReceive>>(it => it.id);


    abstract get name(): string;

    send(data: TSend): void {
        this.manager.send({
            channel: this.name,
            data,
        });
    }

    request(data: TSend, timeout: number = 12000): Promise<TReceive> {
        if (timeout < 0) throw new Error("Timeout must be greater than 0: " + timeout);

        const id = this.requestPackIdGenerator.generate();

        const promise = new Promise<TReceive>((resolve, reject) => {
            this.manager.send({ channel: this.name, id, data });
            this.pendingRequestPacks.add({ id, resolve, reject });
        });

        setTimeout(
            () => this.pendingRequestPacks.removeByKey(id),
            timeout,
        );

        return promise;
    }

    response(id: number, data: TReceive): void {
        this.pendingRequestPacks.get(id).ifPresent(p => {
            p.resolve(data);
            this.pendingRequestPacks.removeByKey(id);
        });
    }

    abstract receive(data: TReceive): void;

}

export interface RequestPack<T = any> {
    readonly id: number;
    readonly resolve: Consumer<T>;
    readonly reject: Consumer<Error | string | void>;
}