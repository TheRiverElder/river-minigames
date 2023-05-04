export default interface Updatable {
    dirty: boolean;
    generateUpdatePack(): any;
    receiveUpdatePack(data: any): void;
}