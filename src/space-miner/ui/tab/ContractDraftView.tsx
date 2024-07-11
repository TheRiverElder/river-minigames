import React from "react";
import { SpaceMinerGameClientCommonProps, purifyGameCommonProps } from "../common";
import "./ContractDraftView.scss";
import { ContractModel } from "../../model/contract/Contract";
import { Nullable } from "../../../libs/lang/Optional";
import ContractDraftClientScreen from "../../client/screen/ContractDraftClientScreen";
import ItemPreviewView from "../common/model-view/ItemPreviewView";
import ItemListView from "../common/ItemListView";
import ScreenCommands from "../../common/screen/ScreenCommands";
import { int } from "../../../libs/CommonTypes";
import classNames from "classnames";
import { restoreText } from "../../../libs/i18n/TextRestorer";

export interface ContractDraftViewProps extends SpaceMinerGameClientCommonProps {
    screen: ContractDraftClientScreen;
}

export interface ContractDraftViewState {
    contracts: Array<ContractModel>;
    selectedContractUid: Nullable<int>;
}

export default class ContractDraftView extends React.Component<ContractDraftViewProps, ContractDraftViewState> {

    state: ContractDraftViewState = {
        contracts: [],
        selectedContractUid: null,
    };

    render(): React.ReactNode {
        const { i18n } = this.props;
        const commonProps = purifyGameCommonProps(this.props);
        return (
            <div className="ContractDraftView">
                <div className="contract-list">
                    {this.state.contracts.map(contract => (
                        <div
                            key={contract.uid}
                            className={classNames("contract", { selected: this.state.selectedContractUid === contract.uid })}
                            onClick={() => this.toggleSelect(contract.uid)}
                        >
                            <div className="info">
                                <p className="uid">uid: {contract.uid}</p>
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
                <div className="button-bar">
                    <button
                        disabled={this.state.selectedContractUid === null}
                        onClick={() => this.acceptContract()}
                    >
                        Accept
                    </button>
                </div>
            </div>
        );
    }

    acceptContract(): void {
        const uid = this.state.selectedContractUid;
        if (uid === null) return;

        this.props.screen.acceptContract(uid);
    }

    toggleSelect(uid: int) {
        const value = (this.state.selectedContractUid === uid) ? null : uid;
        this.setState({ selectedContractUid: value });
    }

    componentDidMount(): void {
        // this.props.screen.previewContract().then(contract => this.setState({ contract }));
        this.props.screen.updateUiData();
    }
}