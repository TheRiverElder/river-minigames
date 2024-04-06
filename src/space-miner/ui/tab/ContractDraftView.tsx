import React from "react";
import { SpaceMinerGameClientCommonProps } from "../common";
import "./ContractDraftView.scss";
import { ContractModel } from "../../model/contract/Contract";
import { Nullable } from "../../../libs/lang/Optional";
import ContractDraftClientScreen from "../../client/screen/ContractDraftClientScreen";

export interface ContractDraftViewProps extends SpaceMinerGameClientCommonProps {
    screen: ContractDraftClientScreen;
}

export interface ContractDraftViewState {
    contract: Nullable<ContractModel>;
}

export default class ContractDraftView extends React.Component<ContractDraftViewProps> {

    state: ContractDraftViewState = {
        contract: null,
    };

    render(): React.ReactNode {
        return (
            <div className="ContractDraftView">
                {JSON.stringify(this.state.contract)}
            </div>
        );
    }

    componentDidMount(): void {
        this.props.screen.previewContract().then(contract => this.setState({ contract }));
    }
}