import I18n from "../../libs/i18n/I18n";
import Game from "../Game";
import SpaceMinerGameClientCommonProps, { SpaceMinerUIController } from "./common";
import LevelEndDialog from "./dialog/LevelEndDialog";
import LevelStartDialog from "./dialog/LevelStartDialog";

export function openLevelStartDialog(props: { i18n: I18n, uiController: SpaceMinerUIController, game: Game }) {
    props.uiController.openDialog({
        renderContent: () => (
            <LevelStartDialog
                i18n={props.i18n}
                level={props.game.level}
            />
        ),
        confirmable: true,
        cancelable: false,
        blurable: true,
    });
}

export function openLevelEndDialog(props: SpaceMinerGameClientCommonProps) {
    props.uiController.openDialog({
        renderContent: () => (
            <LevelEndDialog
                {...props}
            />
        ),
        confirmable: false,
        cancelable: false,
        blurable: true,
    });
}