import React from "react";
import { Productor } from "../../libs/CommonTypes";

export interface ResProps {
    name: string;
    type?: string;
}

export type ResourceLoader = Productor<string, string>;

export const RESOURCE_LOADER_EMPTY: ResourceLoader = (s => s);

export default class Res extends React.Component<ResProps> {

    static resourceLoader: ResourceLoader = RESOURCE_LOADER_EMPTY;

    get type(): string {
        return this.props.type || "auto";
    }

    render(): React.ReactNode {
        const value = Res.resourceLoader(this.props.name);
        
        switch(this.type) {
            case "auto": return this.renderText(value);
            case "image": return this.renderImage(value);
            case "text": return this.renderText(value);
            default: return (<div>{this.props.name}</div>);
        } 
    }

    renderImage(value: string): React.ReactNode {
        return (
            <img src={value} alt={value} />
        )
    }

    renderText(value: string): React.ReactNode {
        return (
            <span>{value}</span>
        )
    }

}

export function createObjectResourceLoader(object: { [name: string]: string }): ResourceLoader {
    return (name) => object[name] || name;
}