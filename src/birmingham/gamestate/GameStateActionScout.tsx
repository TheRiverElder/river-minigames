import { Component, ReactNode } from "react";
import { int } from "../../libs/CommonTypes";
import GameStateViewProps from "./GameStateViewProps";

export interface GameStateActionScoutState {
    extraCardIndexes: Set<int>;
}

export default class GameStateActionScout extends Component<GameStateViewProps, GameStateActionScoutState> {

    constructor(props: GameStateViewProps) {
        super(props);
        this.state = {
            extraCardIndexes: new Set(),
        };
    }
    
    render(): ReactNode {
        const indexes = this.state.extraCardIndexes;
        return (
            <div>
                <h2>选择2张手牌丢弃</h2>
                <div className="cards">
                    {this.props.profile.cards.map((card, index) => (
                        <div onClick={() => {
                            if (indexes.has(index)) indexes.delete(index);
                            else indexes.add(index);
                            this.forceUpdate();
                        }}>
                            <input 
                                type="radio" 
                                checked={indexes.has(index)}
                                disabled={!indexes.has(index) && indexes.size >= 2}
                            />
                            <label>{card}</label>
                        </div>
                    ))}
                </div>
                <button disabled={!this.canPerform()} onClick={() => this.perform()}>Perform</button>
            </div>
        )
    }

    canPerform() {
        return this.state.extraCardIndexes.size === 2;
    }

    perform() {
        this.props.rpc.call("performAction", {
            extraCards: Array.from(this.state.extraCardIndexes).map(index => this.props.profile.cards[index]),
        }).then(() => this.props.refresh());
    }

}