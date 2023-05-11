import Stand from "../../../libs/lang/Stand";

export default class ConfigItem<T = any> {
    readonly name: string;
    readonly type: string;
    readonly delegate: Stand<T>;

    constructor(name: string, type: string, delegate: Stand<T>) {
        this.name = name;
        this.type = type;
        this.delegate = delegate;
    }
}