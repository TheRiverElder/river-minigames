import { Component, ReactNode } from "react";
import "./OrbSelectorView.scss";
import { SpaceMinerGameClientCommonProps, purifyGameCommonProps } from "../common";
import { Consumer, int } from "../../../libs/CommonTypes";
import { OrbInfoModel } from "../../model/orb/Orb";
import OrbInfoView from "../OrbInfoView";

export interface OrbSelectorViewProps extends SpaceMinerGameClientCommonProps {
    uid: int | null;
    onChange: Consumer<int>;
}

export interface OrbSelectorViewState {
    orbList: Array<OrbInfoModel>;
}

export default class OrbSelectorView extends Component<OrbSelectorViewProps, OrbSelectorViewState> {

    state: Readonly<OrbSelectorViewState> = {
        orbList: [],
    };

    render(): ReactNode {
        const { uid, onChange } = this.props;
        const { orbList } = this.state;
        const commonProps = purifyGameCommonProps(this.props);

        const displayedModel = orbList.find(it => it.uid === uid);

        return (
            <div>
                <select
                    value={uid ?? -1}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                >
                    <option value={-1}>-请选择-</option>
                    {orbList.map(orb => (
                        <option key={orb.uid} value={orb.uid}>
                            <span>{orb.name}</span>
                            <span>#{orb.uid}</span>
                        </option>
                    ))}
                </select>
                {displayedModel && <OrbInfoView {...commonProps} orb={displayedModel} />}
            </div>
        );
    }

    componentDidMount(): void {
        this.props.gameApi.channelGameQuery.requestWorld()
            .then(world => this.setState({ orbList: world.orbs }));
    }
}