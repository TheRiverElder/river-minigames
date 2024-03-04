import './App.css';
import ArtificialLive from './artificial-live/ui/ArtificialLive';
import BirminghamView from './birmingham/ui/BirminghamView';
import LoadingView from './libs/ui/LoadingView';
import MarkingEditorView from './marking-editor/ui/MarkingEditorView';
import OsmosView from './osmos/ui/OsmosView';
import MainUI from './space-miner/ui/MainMenu';
import GameUI from './space-miner/ui/game/GameUI';
import SpaceMinerUI from './space-miner/ui/SpaceMinerUI';
import TableBottomSimulatorEntry from './table-bottom-simulator/ui/TableBottomSimulatorEntry';
// import { initializeBirmingham } from './birmingham/test';

function App() {
    // return renderTBS();
    // return renderAL();
    return renderSM();
    // return renderBirmingham();
    // return renderLoadingView();
    // return renderMarkingEditor();
    // return renderOsmosGame();
}

function renderOsmosGame() {
    return (
        <OsmosView />
    )
}

function renderMarkingEditor() {
    return (
        <MarkingEditorView />
    )
}

function renderBirmingham() {
    return (
        <BirminghamView />
    )
}

function renderLoadingView() {
    return (
        <LoadingView />
    )
}

function renderAL() {
    return (
        <ArtificialLive />
    )
}

function renderTBS() {

    return (
        <div className="App">
            <TableBottomSimulatorEntry/>
        </div>
    );
}

function renderSM() {
    return (
        <div className="App">
            {/* <SpaceMinerUI/> */}
            <SpaceMinerUI/>
        </div>
    );
}

// function renderBirmingham() {
//     const game = new Game();

//     const hostname = window.location.hostname;
//     const playerUid = 116;
//     const connection = new Connection(game, `ws://${hostname}:8080/minigames/birmingham?playerUid=${playerUid}`);
//     connection.start();

//     return (
//         <div className="App">
//             <BirminghamGameView game={game} playerUid={playerUid}/>
//         </div>
//     );
// } 

export default App;
