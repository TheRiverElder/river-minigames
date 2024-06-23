import { Component, ReactNode } from "react";
import { SpaceMinerGameClientCommonProps, purifyGameCommonProps } from "../common";
import { ContractModel } from "../../model/contract/Contract";
import ContractsClientScreen from "../../client/screen/ContractsClientScreen";
import classNames from "classnames";
import ItemListView from "../common/ItemListView";
import I18nText from "../../../libs/i18n/I18nText";
import "./ContractsView.scss";


export interface ContractsViewProps extends SpaceMinerGameClientCommonProps {
    screen: ContractsClientScreen;
}

export interface ContractsViewState {
    contracts: Array<ContractModel>;
}

export default class ContractsView extends Component<ContractsViewProps, ContractsViewState> {
    state: Readonly<ContractsViewState> = {
        contracts: [],
    };

    componentDidMount(): void {
        this.props.screen.updateUiData();
    }

    render(): ReactNode {
        const commonProps = purifyGameCommonProps(this.props);
        return (
            <div className="ContractsView">
                {/* <button
                    disabled={this.state.selectedContractUid === null}
                    onClick={() => this.acceptContract()}
                >
                    Fulfill
                </button> */}
                <div className="contract-list">
                    {this.state.contracts.map(contract => (
                        <div
                            key={contract.uid}
                            className={classNames("contract")}
                            onClick={() => this.fulfill(contract)}
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

    fulfill(contract: ContractModel) {
        this.props.screen.fulfill(contract.uid);
    }


}