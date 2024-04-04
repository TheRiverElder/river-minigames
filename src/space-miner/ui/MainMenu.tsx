import './MainMenu.scss';
import { SpaceMinerClientCommonProps } from './common';
import LoadingDialog from './dialog/LoadingDialog';
import { connectToWorker } from '../client/main';
import SpaceMinerApi from '../client/SpaceMinerApi';

export interface MainMenuProps extends SpaceMinerClientCommonProps {
}

export default function MainMenu(props: MainMenuProps) {
    const { i18n, uiController } = props;

    const onClickStartGame = () => {
        props.uiController.openDialog({
            initialValue: null,
            renderContent: () => (<LoadingDialog text={i18n.get('ui.dialog.loading')} />),
            cancelable: false,
            confirmable: false,
        });
        setTimeout(() => {
            // const game = initializeTestGame();
            connectToWorker().then((api: SpaceMinerApi) => {
                uiController.closeDialog();
                uiController.startGame(api);
                // openLevelStartDialog({ ...props, level: api., gameApi: api });
            });;
        }, 0);
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