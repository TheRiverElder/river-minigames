import React from "react";
import { int } from "../../libs/CommonTypes";
import { constrains } from "../../libs/math/Mathmatics";

interface BirminghamGameInitializerProps {
    
}
 
interface BirminghamGameInitializerState {
    playerAmount: int
}
 
class BirminghamGameInitializer extends React.Component<BirminghamGameInitializerProps, BirminghamGameInitializerState> {
    constructor(props: BirminghamGameInitializerProps) {
        super(props);
        this.state = {
            playerAmount: 1,
        };
    }

    mutatePlayerAmount(delta: int) {
        this.setState(s => ({ playerAmount: constrains(s.playerAmount + delta, 1, 4) }));
    }

    startGame() {
        // TODO
    }

    render() { 
        return (
            <div>
                <span>玩家数量（1~4）：</span>
                <button onClick={() => this.mutatePlayerAmount(-1)}>-1</button>
                <span>{ this.state.playerAmount }</span>
                <button onClick={() => this.mutatePlayerAmount(+1)}>+1</button>
                <br/>
                <button onClick={() => this.startGame()}>开始游戏</button>
            </div>
        );
    }
}
 
export default BirminghamGameInitializer;