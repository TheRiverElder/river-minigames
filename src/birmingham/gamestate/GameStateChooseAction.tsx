import { ReactNode } from "react";
import { Nullable } from "../../libs/lang/Optional";
import GameState, { GameStateRenderContext } from "../GameState";

export default class GameStateChooseAction implements GameState {

    selectedAction: Nullable<string> = null;
    selectedCard: Nullable<string> = null;

    render(context: GameStateRenderContext): ReactNode {
        return (
            <div>
                <div className="actions">
                    {actions.map(action => (
                        <div onClick={() => {
                            this.selectedAction = action;
                            context.updateUi(); 
                        }}>
                            <input 
                                type="radio" 
                                name="action" 
                                value={action} 
                                checked={this.selectedAction === action}
                            />
                            <label>{action}</label>
                        </div>
                    ))}
                </div>
                <div className="cards">
                    {context.profile.cards.map(card => (
                        <div onClick={() => {
                            this.selectedCard = card;
                            context.updateUi();
                        }}>
                            <input 
                                type="radio" 
                                name="card" 
                                value={card} 
                                checked={this.selectedCard === card} 
                            />
                            <label>{card}</label>
                        </div>
                    ))}
                </div>
                <div>
                    <button disabled={!this.canConfirm()} onClick={() => this.confirm(context)}>Confirm</button>
                </div>
            </div>
        )
    }

    canConfirm() {
        return (this.selectedAction && this.selectedCard);
    }

    confirm(context: GameStateRenderContext) {
        context.rpc.call("choose_action", this.selectedAction, this.selectedCard)
            .then(() => context.updateUi());
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