import I18n from "../../../libs/i18n/I18n";
import PlainText from "../../../libs/i18n/PlainText";
import { SpaceMinerUIController } from "../common";
import "./LevelEndDialog.scss";

export interface LevelEndDialogProps {
    i18n: I18n;
    uiController: SpaceMinerUIController;
}

export default function LevelEndDialog(props: LevelEndDialogProps) {
    const { i18n, uiController } = props;

    const onClickButtonNextLevel = () => {
        uiController.displayMessage(new PlainText("// TODO 该功能还未实现"));
    };

    const onClickButtonStay = () => {
        uiController.closeDialog();
    };

    const onClickButtonReturnToMainMenu = () => {
        uiController.endGame();
    };

    return (
        <div className="LevelEndDialog">
            <h3 className="title">{i18n.get(`ui.dialog.level_end.title`)}</h3>
            <p className="description">{i18n.get(`ui.dialog.level_end.description`)}</p>
            <div className="buttons">
                <button onClick={onClickButtonNextLevel}>{i18n.get(`ui.dialog.level_end.button.next_level`)}</button>
                <button onClick={onClickButtonStay}>{i18n.get(`ui.dialog.level_end.button.stay`)}</button>
                <button onClick={onClickButtonReturnToMainMenu}>{i18n.get(`ui.dialog.level_end.button.return_to_main_menu`)}</button>
            </div>
        </div>
    );

}