import { Component, ReactNode } from "react";
import { SpaceMinerGameClientCommonProps, purifyGameCommonProps } from "../common";
import { ContractModel } from "../../model/contract/Contract";
import ContractsClientScreen from "../../client/screen/ContractsClientScreen";
import classNames from "classnames";
import ItemListView from "../common/ItemListView";
import "./ContractsView.scss";
import { restoreText } from "../../../libs/i18n/TextRestorer";
import { int } from "../../../libs/CommonTypes";
import OrbSelectorView from "../common/OrbSelectorView";


export interface ContractsViewProps extends SpaceMinerGameClientCommonProps {
    screen: ContractsClientScreen;
}

export interface ContractsViewState {
    contracts: Array<ContractModel>;
    selectOrbUid: int | null;
}

export default class ContractsView extends Component<ContractsViewProps, ContractsViewState> {

    state: Readonly<ContractsViewState> = {
        contracts: [],
        selectOrbUid: null,
    };

    componentDidMount(): void {
        this.props.screen.updateUiData();
    }

    render(): ReactNode {
        const { i18n } = this.props;
        const commonProps = purifyGameCommonProps(this.props);

        return (
            <div className="ContractsView">
                {/* <button
                    disabled={this.state.selectedContractUid === null}
                    onClick={() => this.acceptContract()}
                >
                    Fulfill
                </button> */}
                <div className="orb-selector">
                    <OrbSelectorView 
                        {...commonProps}
                        uid={this.state.selectOrbUid}
                        onChange={uid => this.setState({ selectOrbUid: uid })}
                    />
                </div>
                <div className="contract-list">
                    {this.state.contracts.map(contract => (
                        <div
                            key={contract.uid}
                            className={classNames("contract")}
                            onClick={() => this.fulfill(contract)}
                        >
                            <div className="info">
                                <p>uid: {contract.uid}</p>
                                <p>{restoreText(contract.description).process(i18n)}</p>
                            </div>
                            <div className="item-list">
                                <h3 className="title">需求：</h3>
                                <ItemListView {...commonProps} itemList={contract.offering} />
                            </div>
                            <div className="item-list">
                                <h3 className="title">报酬：</h3>
                                <ItemListView {...commonProps} itemList={contract.receiving} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    fulfill(contract: ContractModel) {
        const orbUid = this.state.selectOrbUid;
        if (orbUid === null) return;
        
        this.props.screen.fulfill(contract.uid, orbUid);
    }


}