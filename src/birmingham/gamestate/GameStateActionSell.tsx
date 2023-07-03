import { Component, ReactNode } from "react";
import { int } from "../../libs/CommonTypes";
import { Nullable } from "../../libs/lang/Optional";
import { CITIES } from "../Constants";
import { Location } from "../Types";
import GameStateViewProps from "./GameStateViewProps";

export interface GameStateActionSellState {
    orders: Array<[Location, Location]>;
    sourceCity: Nullable<string>;
    sourceIndustySlotIndex: Nullable<int>;
    targetCity: Nullable<string>;
    targetIndustySlotIndex: Nullable<int>;
}

export default class GameStateActionSell extends Component<GameStateViewProps, GameStateActionSellState> {

    constructor(props: GameStateViewProps) {
        super(props);
        this.state = {
            orders: [],
            sourceCity: null,
            sourceIndustySlotIndex: null,
            targetCity: null,
            targetIndustySlotIndex: null,
        };
    }
    
    render(): ReactNode {
        return (
            <div>
                <h2>选择商品厂址</h2>
                <div className="cities">
                    {CITIES.map(city => (
                        <div onClick={() => {
                            if (this.state.sourceCity !== city.name) this.setState({ sourceCity: city.name, sourceIndustySlotIndex: null });
                        }}>
                            <input 
                                type="radio" 
                                checked={this.state.sourceCity === city.name}
                            />
                            <label>{city.name}</label>
                            {this.state.sourceCity === city.name && city.industrySlots.map((slot, index) => (
                                <div onClick={() => this.setState({ sourceIndustySlotIndex: index })}>
                                    <span>{index} - </span>
                                    <input 
                                        type="radio" 
                                        checked={this.state.sourceIndustySlotIndex === index}
                                    />
                                    <label>{slot.join(" | ")}</label>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <h2>选择售卖酒馆</h2>
                <div className="cities">
                    {CITIES.map(city => (
                        <div onClick={() => {
                            if (this.state.targetCity !== city.name) this.setState({ targetCity: city.name, targetIndustySlotIndex: null });
                        }}>
                            <input 
                                type="radio" 
                                checked={this.state.targetCity === city.name}
                            />
                            <label>{city.name}</label>
                            {this.state.targetCity === city.name && city.industrySlots.map((slot, index) => (
                                <div onClick={() => this.setState({ targetIndustySlotIndex: index })}>
                                    <span>{index} - </span>
                                    <input 
                                        type="radio" 
                                        checked={this.state.targetIndustySlotIndex === index}
                                    />
                                    <label>{slot.join(" | ")}</label>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <button disabled={!this.canNext()} onClick={() => this.next()}>Next Bill</button>
                <button disabled={!this.canPerform()} onClick={() => this.perform()}>Perform</button>
            </div>
        )
    }

    canNext() {
        return (
            this.state.sourceCity !== null && this.state.sourceIndustySlotIndex !== null && 
            this.state.targetCity !== null && this.state.targetIndustySlotIndex !== null
        );
    }

    next() {
        const s = this.state;
        const order = [[s.sourceCity, s.sourceIndustySlotIndex], [s.targetCity, s.targetIndustySlotIndex]] as [Location, Location];
        this.setState({ 
            orders: this.state.orders.concat(order),
            sourceCity: null,
            sourceIndustySlotIndex: null,
            targetCity: null,
            targetIndustySlotIndex: null,
        });
    }

    canPerform() {
        return this.state.orders.length >= 1;
    }

    perform() {
        this.props.rpc.call("performAction", {
            orders: this.state.orders,
        }).then(() => this.props.refresh());
    }

}