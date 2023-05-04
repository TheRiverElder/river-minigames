import './App.css';
import initializeTest from './table-bottom-simulator/builtin/Test';
import { Side } from './table-bottom-simulator/gameobject/Behavior';
import TableBottomSimulator from './table-bottom-simulator/TableBottomSimulator';
import TableBottomSimulatorView from './table-bottom-simulator/ui/TableBottomSimulatorView';
// import { initializeBirmingham } from './birmingham/test';

function App() {
    return renderTBS();
}

function renderTBS() {
    const simulator = new TableBottomSimulator(Side.COMMON);
    initializeTest(simulator);

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
