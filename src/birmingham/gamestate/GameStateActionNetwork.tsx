import { Component, ReactNode } from "react";
import { int } from "../../libs/CommonTypes";
import BirminghamMapView from "../ui/BirminghamMapView";
import GameStateViewProps from "./GameStateViewProps";

export interface GameStateActionNetworkState {
    linkUidList: Array<int>,
}

export default class GameStateActionNetwork extends Component<GameStateViewProps, GameStateActionNetworkState> {

    constructor(props: GameStateViewProps) {
        super(props);
        this.state = {
            linkUidList: [],
        };
    }
    
    render(): ReactNode {

        const uidList = new Set<int>(this.state.linkUidList);
        const limit = 1;

        return (
            <div>
            <h2>选择至多{limit}条道路建设</h2>
                <button disabled={!this.canPerform()} onClick={() => this.perform()}>Perform</button>
                <BirminghamMapView 
                    game={this.props.game}
                    scale={0.2}
                    links={{
                        isHidden: () => false,
                        isSelectable: () => uidList.size < limit,
                        hasSelected: (linkUid) => uidList.has(linkUid),
                        onClick: (linkUid) => {
                            if (!uidList.has(linkUid)) {
                                if (uidList.size < limit) uidList.add(linkUid);
                            } else uidList.delete(linkUid);
                            this.setState({ linkUidList: Array.from(uidList) });
                        },
                    }}
                />
            </div>
        )
    }

    canPerform() {
        const limit = 1;
        return this.state.linkUidList.length <= limit;
    }

    perform() {
        this.props.rpc.call("performAction", {
            linkUidList: this.state.linkUidList,
        }).then(() => this.props.refresh());
    }

}