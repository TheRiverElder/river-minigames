import { Component, ReactNode } from "react";
import { int } from "../../libs/CommonTypes";
import { Nullable } from "../../libs/lang/Optional";
import { CITIES } from "../Constants";
import { Location, locationEquals } from "../Types";
import BirminghamMapView from "../ui/BirminghamMapView";
import GameStateViewProps from "./GameStateViewProps";

export interface GameStateActionSellState {
    orders: Array<[Location, Location]>;
    sourceLocation: Nullable<Location>;
    targetLocation: Nullable<Location>;
}

export default class GameStateActionSell extends Component<GameStateViewProps, GameStateActionSellState> {

    constructor(props: GameStateViewProps) {
        super(props);
        this.state = {
            orders: [],
            sourceLocation: null,
            targetLocation: null,
        };
    }
    
    render(): ReactNode {
        const { sourceLocation, targetLocation } = this.state;

        return (
            <div>
                <h2>选择商品厂址与售卖酒馆</h2>
                <button disabled={!this.canNext()} onClick={() => this.next()}>Confirm and Handle Next Bill</button>
                <button disabled={!this.canPerform()} onClick={() => this.perform()}>Perform</button>
                
                <BirminghamMapView 
                    scale={0.2}
                    industrySlots={{
                        isHidden: () => false,
                        isSelectable: () => sourceLocation === null,
                        hasSelected: (loc) => locationEquals(loc, sourceLocation),
                        onClick: (loc) => {
                            if (locationEquals(loc, sourceLocation)) {
                                this.setState({ sourceLocation: null });
                            } else this.setState({ sourceLocation: loc });
                        },
                    }}
                    merchants={{
                        isHidden: () => false,
                        isSelectable: () => targetLocation === null,
                        hasSelected: (loc) => locationEquals(loc, targetLocation),
                        onClick: (loc) => {
                            if (locationEquals(loc, targetLocation)) {
                                this.setState({ targetLocation: null });
                            } else this.setState({ targetLocation: loc });
                        },
                    }}
                />
            </div>
        )
    }

    canNext() {
        return (this.state.sourceLocation !== null && this.state.targetLocation !== null);
    }

    next() {
        const s = this.state;
        const order = [s.sourceLocation, s.targetLocation] as [Location, Location];
        this.setState({ 
            orders: this.state.orders.concat(order),
            sourceLocation: null,
            targetLocation: null,
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