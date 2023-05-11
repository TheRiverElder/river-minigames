import './App.css';
import ArtificialLive from './artificial-live/ui/ArtificialLive';
import TableBottomSimulatorEntry from './table-bottom-simulator/ui/TableBottomSimulatorEntry';
// import { initializeBirmingham } from './birmingham/test';

function App() {
    // return renderTBS();
    return renderAL();
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
