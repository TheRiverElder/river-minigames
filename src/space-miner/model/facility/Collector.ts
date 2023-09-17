import ResourceItem from "../item/ResourceItem";

export default interface Collector {
    canCollect(item: ResourceItem): boolean;
}