import './App.css';
import { initializeBasic } from './table-bottom-simulator/builtin/BasicInitialization';
import initializeTest from './table-bottom-simulator/builtin/Test';
import WebSocketCommunication from './table-bottom-simulator/communication/WebSocketCommunication';
import TableBottomSimulatorCommon from './table-bottom-simulator/simulator/TableBottomSimulatorCommon';
import TableBottomSimulatorView from './table-bottom-simulator/ui/TableBottomSimulatorView';
// import { initializeBirmingham } from './birmingham/test';

function App() {
    return renderTBS();
}

function renderTBS() {
    const simulator = new TableBottomSimulatorCommon(1);
    initializeBasic(simulator);
    initializeTest(simulator);

    const communication = new WebSocketCommunication(simulator, "ws://localhost:8082/minigames/tbs", 5);
    simulator.communication = communication;
    communication.start();

    return (
        <div className="App">
            <TableBottomSimulatorView simulator={simulator}/>
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
