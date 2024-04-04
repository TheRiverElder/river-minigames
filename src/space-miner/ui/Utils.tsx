import I18n from "../../libs/i18n/I18n";
import SpaceMinerApi from "../client/SpaceMinerApi";
import { SpaceMinerUIController } from "./common";
import LevelEndDialog from "./dialog/LevelEndDialog";
import LevelStartDialog from "./dialog/LevelStartDialog";

export function openLevelStartDialog(props: { i18n: I18n, uiController: SpaceMinerUIController, gameApi: SpaceMinerApi }) {
    props.gameApi.channelGameQuery.requestLevel().then(level => {
        props.uiController.openDialog({
            renderContent: () => (
                <LevelStartDialog
                    i18n={props.i18n}
                    level={level}
                />
            ),
            confirmable: true,
            cancelable: false,
            blurable: true,
        }).then(() => {
            props.gameApi.channelUi.notifyLevelChecked();
        });
    });
}

export function openLevelEndDialog(props: { i18n: I18n, uiController: SpaceMinerUIController }) {
    props.uiController.openDialog({
        renderContent: () => (
            <LevelEndDialog
                i18n={props.i18n}
                uiController={props.uiController}
            />
        ),
        confirmable: false,
        cancelable: false,
        blurable: true,
    });
}