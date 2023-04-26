export default class ResourceType {
    readonly name: string;

    constructor(name: string) {
        this.name = name;
    }
}

export const RESOURCE_TYPE_NONE = new ResourceType("无");

export const RESOURCE_TYPE_IRON = new ResourceType("钢铁");
export const RESOURCE_TYPE_COAL = new ResourceType("煤炭");
export const RESOURCE_TYPE_BEER = new ResourceType("啤酒");

export const RESOURCE_TYPE_COIN = new ResourceType("金钱");

export const RESOURCE_TYPE_TRAFFICE_GOAL = new ResourceType("铁路分");
export const RESOURCE_TYPE_FACTORY_GOAL = new ResourceType("工厂分");