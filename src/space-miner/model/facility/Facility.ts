import { Component } from "react";
import ConfigItem from "../../../libs/config/ConfigItem";
import { Configurable } from "../../../libs/config/Configurable";
import Text from "../../../libs/i18n/Text";
import { Nullable } from "../../../libs/lang/Optional";
import Game from "../../Game";
import { InOrbLocation } from "../orb/Orb";

export default abstract class Facility implements Configurable {
    
    abstract get configItems(): ConfigItem<any>[];
    abstract get config(): any;
    abstract set config(value: any);

    name: string = "";

    abstract get displayedName(): Text;
    abstract get description(): Text;

    location: Nullable<InOrbLocation> = null;

    abstract setup(): void;
    abstract tick(game: Game): void;
    abstract copy(): Facility;
}