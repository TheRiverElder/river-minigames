import './MainMenu.scss';
import I18n from '../../libs/i18n/I18n';
import Game from '../Game';
import { initializeTestGame } from '../test/Test';
import { SpaceMinerUIController } from './common';
import LoadingDialog from './dialog/LoadingDialog';
import { openLevelStartDialog } from './Utils';
import { createGameWorker } from '../worker';

export interface MainMenuProps {
    i18n: I18n;
    uiController: SpaceMinerUIController;
}

export default function MainMenu(props: MainMenuProps) {
    const { i18n, uiController } = props;

    const onClickStartGame = () => {
        new Promise<Worker>((resolve) => {
            props.uiController.openDialog({
                initialValue: null,
                renderContent: () => (<LoadingDialog text={i18n.get('ui.dialog.loading')} />),
                cancelable: false,
                confirmable: false,
            });
            setTimeout(() => {
                // const game = initializeTestGame();
                const worker = createGameWorker();
                resolve(worker);
            }, 0);
        }).then((worker: Worker) => {

            uiController.startGame(worker);
            props.uiController.closeDialog();
            // openLevelStartDialog({ ...props, level });
        });
    };

    return (
        <div className="MainMenu">
            <div className='logo-wrapper'>
                <h1 className='logo'>{i18n.get("ui.main_menu.logo")}</h1>
            </div>
            <div className='button-bar'>
                <button onClick={onClickStartGame}>{i18n.get("ui.main_menu.button.start_test_game")}</button>
            </div>
        </div>
    );
}