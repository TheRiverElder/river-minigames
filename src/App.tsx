import './App.css';
import ArtificialLive from './artificial-live/components/ArtificialLive';
// import Entry from './table-bottom-simulator/ui/Entry';
// import { initializeBirmingham } from './birmingham/test';

function App() {
    return renderAL();
}

function renderAL() {
    return (
        <ArtificialLive />
    )
}

// function renderTBS() {

//     return (
//         <div className="App">
//             <Entry/>
//         </div>
//     );
// }

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
