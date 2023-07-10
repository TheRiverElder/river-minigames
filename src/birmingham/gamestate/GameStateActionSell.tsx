import { Component, ReactNode } from "react";
import { int } from "../../libs/CommonTypes";
import { Nullable } from "../../libs/lang/Optional";
import { Location, locationEquals } from "../Types";
import BirminghamMapView from "../ui/BirminghamMapView";
import GameStateViewProps from "./GameStateViewProps";

export type OrderData = [int, int, Array<int>];

export interface GameStateActionSellState {
    orders: Array<OrderData>;
    sourceUid: Nullable<int>;
    targetUid: Nullable<int>;
}

export default class GameStateActionSell extends Component<GameStateViewProps, GameStateActionSellState> {

    constructor(props: GameStateViewProps) {
        super(props);
        this.state = {
            orders: [],
            sourceUid: null,
            targetUid: null,
        };
    }
    
    render(): ReactNode {
        const { sourceUid, targetUid } = this.state;

        return (
            <div>
                <h2>选择商品厂址与售卖酒馆</h2>
                <button disabled={!this.canNext()} onClick={() => this.next()}>Confirm and Handle Next Bill</button>
                <button disabled={!this.canPerform()} onClick={() => this.perform()}>Perform</button>
                
                <BirminghamMapView 
                    game={this.props.game}
                    scale={0.2}
                    industrySlots={{
                        isHidden: () => false,
                        isSelectable: () => sourceUid === null,
                        hasSelected: (uid) => uid === sourceUid,
                        onClick: (uid) => {
                            if (uid === sourceUid) this.setState({ sourceUid: null });
                            else this.setState({ sourceUid: uid });
                        },
                    }}
                    merchants={{
                        isHidden: () => false,
                        isSelectable: () => targetUid === null,
                        hasSelected: (uid) => uid === targetUid,
                        onClick: (uid) => {
                            if (uid === targetUid) this.setState({ targetUid: null });
                            else this.setState({ targetUid: uid });
                        },
                    }}
                />
            </div>
        )
    }

    canNext() {
        return (this.state.sourceUid !== null && this.state.targetUid !== null);
    }

    next() {
        const s = this.state;
        const order = [s.sourceUid, s.targetUid, []] as OrderData;
        this.setState({ 
            orders: this.state.orders.concat(order),
            sourceUid: null,
            targetUid: null,
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