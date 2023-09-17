import "./DeploymentView.scss";
import { Component, ReactNode } from "react";
import SpaceMinerUICommonProps from "./SpaceMinerUICommonProps";
import OrbInfoView from "./OrbInfoView";
import { Nullable } from "../../libs/lang/Optional";
import Orb from "../model/orb/Orb";
import Item from "../model/item/Item";
import { removeFromArray } from "../../libs/lang/Collections";
import ItemInfoView from "./ItemInfoView";
import FacilityItem from "../model/item/FacilityItem";

export interface DeploymentViewProps extends SpaceMinerUICommonProps {

}

export interface DeploymentViewState {
    selectedOrb: Nullable<Orb>;
    appendedItemList: Array<FacilityItem>;
    unappendedItemList: Array<FacilityItem>;
}

export default class DeploymentView extends Component<DeploymentViewProps, DeploymentViewState> {

    constructor(props: DeploymentViewProps) {
        super(props);
        this.state = {
            selectedOrb: null,
            appendedItemList: [],
            unappendedItemList: this.getMinerItems(props.game.profile.warehouse.items),
        };
    }

    override render(): ReactNode {
        const { game, i18n, resources } = this.props;
        const { selectedOrb, unappendedItemList, appendedItemList } = this.state;

        return (
            <div className="DeploymentView">
                <div className="orb-selector">
                    <div className="title">{i18n.get("ui.deployment.title.select_orb")}</div>
                    <select
                        value={selectedOrb?.uid || ""}
                        onChange={e => this.setState({ selectedOrb: game.world.orbs.get(Number.parseInt(e.target.value)).orNull() })}
                    >
                        <option value={-1}>---</option>
                        {Array.from(game.profile.ownedOrbs).map(orb => (
                            <option key={orb.uid} value={orb.uid}>{orb.name}#{orb.uid}</option>
                        ))}
                    </select>
                    <div className="info-wrapper">
                        {selectedOrb && (
                            <OrbInfoView orb={selectedOrb} game={game} i18n={i18n} resources={resources} previewMode />
                        )}
                    </div>
                </div>
                <div className="miners-selector">
                    <div className="title">{i18n.get("ui.deployment.title.select_miners")}</div>
                    <div className="appended">
                        {appendedItemList.map((item, i) =>
                            <ItemInfoView 
                                key={i}
                                item={item} 
                                i18n={i18n} 
                                resources={resources} 
                                game={this.props.game}
                                tools={(
                                    <button onClick={() => this.unappend(item)}>{i18n.get("ui.deployment.button.unappend")}</button>
                                )} 
                            />
                        )}
                    </div>
                    <div className="unappended">
                        {unappendedItemList.map((item, i) =>
                            <ItemInfoView 
                                key={i}
                                item={item} 
                                i18n={i18n} 
                                resources={resources} 
                                game={this.props.game}
                                tools={(
                                    <button onClick={() => this.append(item)}>{i18n.get("ui.deployment.button.append")}</button>
                                )} 
                            />
                        )}
                    </div>
                </div>
                <div className="buttons">
                    <button
                        disabled={!this.canDeploy()} 
                        onClick={() => this.deploy()}
                    >{i18n.get("ui.deployment.button.deploy")}</button>
                </div>
            </div>
        );
    }

    getMinerItems(items: Array<Item>): Array<FacilityItem> {
        return items.filter(item => item instanceof FacilityItem).map(item => item as FacilityItem);
    } 

    append(facility: FacilityItem): boolean {
        const unappendedItemList = this.state.unappendedItemList.slice();
        if (!removeFromArray(unappendedItemList, facility)) return false;
    
        const appendedItemList = this.state.appendedItemList.slice();
        appendedItemList.push(facility);
        this.setState({
            unappendedItemList,
            appendedItemList,
        });

        return true;
    }

    unappend(facility: FacilityItem): boolean {
        const appendedItemList = this.state.appendedItemList.slice();
        if (!removeFromArray(appendedItemList, facility)) return false;
    
        const unappendedItemList = this.state.unappendedItemList.slice();
        unappendedItemList.push(facility);
        this.setState({
            unappendedItemList,
            appendedItemList,
        });

        return true;
    }

    canDeploy() {
        return !!this.state.selectedOrb && this.state.appendedItemList.length > 0;
    }

    deploy() {
        const { selectedOrb, appendedItemList } = this.state;
        if (!selectedOrb || appendedItemList.length === 0) return;

        const game = this.props.game;
        if (game.actions.deploy(selectedOrb, appendedItemList, game.profile)) {
            this.setState({ appendedItemList: [] });
        }
    }
}