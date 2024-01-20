import { ReactNode } from "react";
import SpaceMinerGameClientCommonProps from "../common";
import "./LevelEndDialog.scss";

export interface LevelEndDialogProps extends SpaceMinerGameClientCommonProps {

}

export default function LevelEndDialog(props: LevelEndDialogProps): ReactNode {
    const { i18n } = props;

    return (
        <div className="LevelEndDialog">
            <h2>{ i18n.get(`ui.dialog.level_end.title`) }</h2>
        </div>
    );

}