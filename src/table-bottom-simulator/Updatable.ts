export default interface Updatable {
    dirty: boolean;
    generateUpdatePack(): any;
}