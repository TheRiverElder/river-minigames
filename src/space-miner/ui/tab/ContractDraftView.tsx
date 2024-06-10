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

export interface ContractDraftViewProps extends SpaceMinerGameClientCommonProps {
    screen: ContractDraftClientScreen;
}

export interface ContractDraftViewState {
    contractList: Array<ContractModel>;
    selectedContractUid: Nullable<int>;
}

export default class ContractDraftView extends React.Component<ContractDraftViewProps, ContractDraftViewState> {

    state: ContractDraftViewState = {
        contractList: [],
        selectedContractUid: null,
    };

    render(): React.ReactNode {
        const commonProps = purifyGameCommonProps(this.props);
        return (
            <div className="ContractDraftView">
                <button
                    disabled={this.state.selectedContractUid === null}
                    onClick={() => this.acceptContract()}
                >
                    Accept
                </button>
                <div className="contract-list">
                    {this.state.contractList.map(contract => (
                        <div
                            className={classNames("contract", { selected: this.state.selectedContractUid === contract.uid })}
                            onClick={() => this.toggleSelect(contract.uid)}
                        >
                            <div className="info">
                                <p>uid: {contract.uid}</p>
                                <p>此合约由泰拉商业协会提供。</p>
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

    acceptContract(): void {
        const uid = this.state.selectedContractUid;
        if (uid === null) return;

        this.props.screen.channel.request(ScreenCommands.CONTRACT_DRAFT.ACCEPT_CONTRACT, uid)
            .then(() => this.refresh());
    }

    toggleSelect(uid: int) {
        const value = (this.state.selectedContractUid === uid) ? null : uid;
        this.setState({ selectedContractUid: value });
    }

    componentDidMount(): void {
        // this.props.screen.previewContract().then(contract => this.setState({ contract }));
        this.refresh();
    }

    refresh() {
        this.props.screen.channel.request(ScreenCommands.CONTRACT_DRAFT.GET_CONTRACT_LIST)
            .then((contractList: ContractDraftViewState["contractList"]) => {
                let selectedContractUid = this.state.selectedContractUid;
                if (!contractList.find(it => it.uid === selectedContractUid)) {
                    selectedContractUid = null;
                }
                this.setState({ contractList, selectedContractUid });
            });
    }
}