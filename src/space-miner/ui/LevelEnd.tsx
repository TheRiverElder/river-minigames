import { ReactNode } from "react";
import SpaceMinerUICommonProps from "./SpaceMinerUICommonProps";
import "./LevelEnd.scss";

export interface LevelEndProps extends SpaceMinerUICommonProps {

}

export default function LevelEnd(props: LevelEndProps): ReactNode {
    const { i18n } = props;

    return (
        <div className="LevelEnd">
            <h2>{ i18n.get(`ui.level_end.title`) }</h2>
        </div>
    );

}