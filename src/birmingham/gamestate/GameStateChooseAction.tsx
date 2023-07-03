import { Component, ReactNode } from "react";
import { Nullable } from "../../libs/lang/Optional";
import GameStateViewProps from "./GameStateViewProps";

export interface GameStateChooseActionState {
    selectedAction: Nullable<string>;
    selectedCard: Nullable<string>;
}

export default class GameStateChooseAction extends Component<GameStateViewProps, GameStateChooseActionState> {

    constructor(props: GameStateViewProps) {
        super(props);
        this.state = {
            selectedAction: null,
            selectedCard: null,
        };
    }

    render(): ReactNode {
        return (
            <div>
                <div className="actions">
                    {actions.map(action => (
                        <div onClick={() => this.setState({ selectedAction: action })}>
                            <input 
                                type="radio" 
                                name="action" 
                                value={action} 
                                checked={this.state.selectedAction === action}
                            />
                            <label>{action}</label>
                        </div>
                    ))}
                </div>
                <div className="cards">
                    {this.props.profile.cards.map(card => (
                        <div onClick={() => this.setState({ selectedCard: card })}>
                            <input 
                                type="radio" 
                                name="card" 
                                value={card} 
                                checked={this.state.selectedCard === card} 
                            />
                            <label>{card}</label>
                        </div>
                    ))}
                </div>
                <div>
                    <button disabled={!this.canConfirm()} onClick={() => this.confirm()}>Confirm</button>
                </div>
            </div>
        )
    }

    canConfirm() {
        return (this.state.selectedAction && this.state.selectedCard);
    }

    confirm() {
        this.props.rpc.call("setActionState", this.state.selectedAction, this.state.selectedCard)
            .then(() => this.props.refresh());
    }

}

const actions = [
    "build",
    "sell",
    "loan",
    "network",
    "develop",
    "scout",
];