import './App.css';
import BirminghamGameView from './birmingham/components/BirminghamGameView';
import Connection from './birmingham/connection/Connection';
import Game from './birmingham/Game';
// import { initializeBirmingham } from './birmingham/test';

function App() {
    const game = new Game();

    const playerUid = 72;
    const connection = new Connection(game, `ws://127.0.0.1:8080/minigames/birmingham?playerUid=${playerUid}`);
    connection.start();

    return (
        <div className="App">
            {/* <ArtificialLive /> */}
            <BirminghamGameView game={game} playerUid={playerUid}/>
        </div>
    );
  }

export default App;
